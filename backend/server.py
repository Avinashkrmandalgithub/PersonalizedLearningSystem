from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib
import os


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Personalized Learning Recommendation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "logistic_recommender.pkl"
)

RESOURCE_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "processed",
    "resource_catalog.csv"
)

HISTORY_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "processed",
    "learner_history_features.csv"
)

ENGAGEMENT_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "processed",
    "resource_engagement.csv"
)

ACTIVITY_PROFILE_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "processed",
    "learner_activity_profile.csv"
)

HISTORY_RESOURCE_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "processed",
    "history_resource_lookup.csv"
)

# =========================================================
# LOAD MODEL + DATA
# =========================================================

model = joblib.load(MODEL_PATH)

resource_catalog = pd.read_csv(RESOURCE_PATH)

learner_history_features = pd.read_csv(HISTORY_PATH)

resource_engagement = pd.read_csv(ENGAGEMENT_PATH)

learner_activity_profile = pd.read_csv(ACTIVITY_PROFILE_PATH)

history_resource_lookup = pd.read_csv(
    HISTORY_RESOURCE_PATH
)


print("Model loaded successfully")
print("Resource catalog:", resource_catalog.shape)
print("Learner history:", learner_history_features.shape)
print("Resource engagement:", resource_engagement.shape)
print("Activity profile:", learner_activity_profile.shape)


# =========================================================
# REQUEST MODELS
# =========================================================

class ScoreRequest(BaseModel):
    popularity_score: float
    activity_preference_score: float

    history_total_clicks: float
    history_unique_resources: float
    history_active_days: float
    history_learning_span: float
    avg_clicks_per_active_day: float

    unique_activity_types: float
    activity_diversity_ratio: float

    days_since_last_activity: float

    clicks_last_7_days: float
    active_days_last_7_days: float

    clicks_last_30_days: float
    active_days_last_30_days: float

    historical_average_score: float | None = None
    historical_assessment_count: float | None = None
    historical_min_score: float | None = None
    historical_max_score: float | None = None
    historical_avg_submission_day: float | None = None

    activity_type: str


class RecommendationRequest(BaseModel):
    id_student: int
    code_module: str
    code_presentation: str
    top_k: int = 5

class DashboardRequest(BaseModel):
    id_student: int
    code_module: str
    code_presentation: str

# =========================================================
# BASIC ROUTES
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Personalized Learning Recommendation API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


# =========================================================
# SINGLE RESOURCE SCORE
# =========================================================

@app.post("/predict-score")
def predict_score(data: ScoreRequest):

    input_data = pd.DataFrame([
        data.model_dump()
    ])

    probability = model.predict_proba(
        input_data
    )[0][1]

    return {
        "recommendation_score": round(
            float(probability),
            4
        )
    }


# =========================================================
# PERSONALIZED RECOMMENDATIONS
# =========================================================

@app.post("/recommend")
def recommend(data: RecommendationRequest):

    # -----------------------------------------------------
    # 1. Find learner history profile
    # -----------------------------------------------------

    learner = learner_history_features[
        (learner_history_features["id_student"] == data.id_student)
        &
        (learner_history_features["code_module"] == data.code_module)
        &
        (
            learner_history_features["code_presentation"]
            == data.code_presentation
        )
    ]

    if learner.empty:
        return {
            "student": data.id_student,
            "course": data.code_module,
            "presentation": data.code_presentation,
            "recommendations": [],
            "message": "Learner/course profile not found"
        }

    learner_row = learner.iloc[0]


    # -----------------------------------------------------
    # 2. Get all resources for this course
    # -----------------------------------------------------

    candidates = resource_catalog[
        (resource_catalog["code_module"] == data.code_module)
        &
        (
            resource_catalog["code_presentation"]
            == data.code_presentation
        )
    ].copy()

    if candidates.empty:
        return {
            "student": data.id_student,
            "course": data.code_module,
            "presentation": data.code_presentation,
            "recommendations": [],
            "message": "No resources found"
        }


    # -----------------------------------------------------
    # 3. Remove resources already seen by the student
    # -----------------------------------------------------

    seen_resources = history_resource_lookup[
        (history_resource_lookup["id_student"] == data.id_student)
        &
        (
            history_resource_lookup["code_module"]
            == data.code_module
        )
        &
        (
            history_resource_lookup["code_presentation"]
            == data.code_presentation
        )
    ]["id_site"].unique()

    candidates = candidates[
        ~candidates["id_site"].isin(seen_resources)
    ].copy()


    if candidates.empty:
        return {
            "student": data.id_student,
            "course": data.code_module,
            "presentation": data.code_presentation,
            "recommendations": [],
            "message": "No new resources available"
        }


    # -----------------------------------------------------
    # 4. Add resource popularity
    # -----------------------------------------------------

    engagement = resource_engagement[
        (resource_engagement["code_module"] == data.code_module)
        &
        (
            resource_engagement["code_presentation"]
            == data.code_presentation
        )
    ][
        [
            "id_site",
            "popularity_score"
        ]
    ].drop_duplicates("id_site")

    candidates = candidates.merge(
        engagement,
        on="id_site",
        how="left"
    )


    # -----------------------------------------------------
    # 5. Add learner activity behaviour
    # -----------------------------------------------------

    activity_profile = learner_activity_profile[
        (learner_activity_profile["id_student"] == data.id_student)
        &
        (
            learner_activity_profile["code_module"]
            == data.code_module
        )
        &
        (
            learner_activity_profile["code_presentation"]
            == data.code_presentation
        )
    ][
        [
            "activity_type",
            "activity_preference_score"
        ]
    ]

    candidates = candidates.merge(
        activity_profile,
        on="activity_type",
        how="left"
    )


    # -----------------------------------------------------
    # 6. Fill missing candidate values
    # -----------------------------------------------------

    candidates["popularity_score"] = (
        candidates["popularity_score"].fillna(0)
    )

    candidates["activity_preference_score"] = (
        candidates["activity_preference_score"].fillna(0)
    )


    # -----------------------------------------------------
    # 7. Add learner history features
    # -----------------------------------------------------

    history_columns = [
        "history_total_clicks",
        "history_unique_resources",
        "history_active_days",
        "history_learning_span",
        "avg_clicks_per_active_day",
        "unique_activity_types",
        "activity_diversity_ratio",
        "days_since_last_activity",
        "clicks_last_7_days",
        "active_days_last_7_days",
        "clicks_last_30_days",
        "active_days_last_30_days",
        "historical_average_score",
        "historical_assessment_count",
        "historical_min_score",
        "historical_max_score",
        "historical_avg_submission_day"
    ]

    for column in history_columns:
        candidates[column] = learner_row[column]


    # -----------------------------------------------------
    # 8. ML feature order
    # -----------------------------------------------------

    ml_features = [
        "popularity_score",
        "activity_preference_score",

        "history_total_clicks",
        "history_unique_resources",
        "history_active_days",
        "history_learning_span",
        "avg_clicks_per_active_day",

        "unique_activity_types",
        "activity_diversity_ratio",

        "days_since_last_activity",

        "clicks_last_7_days",
        "active_days_last_7_days",

        "clicks_last_30_days",
        "active_days_last_30_days",

        "historical_average_score",
        "historical_assessment_count",
        "historical_min_score",
        "historical_max_score",
        "historical_avg_submission_day",

        "activity_type"
    ]


    # -----------------------------------------------------
    # 9. ML prediction
    # -----------------------------------------------------

    prediction_data = candidates[
        ml_features
    ].copy()

    candidates["recommendation_score"] = (
        model.predict_proba(prediction_data)[:, 1]
    )


    # -----------------------------------------------------
    # 10. Rank recommendations
    # -----------------------------------------------------

    top_recommendations = (
        candidates
        .sort_values(
            "recommendation_score",
            ascending=False
        )
        .head(data.top_k)
    )


    # -----------------------------------------------------
    # 11. Response
    # -----------------------------------------------------

    recommendations = []

    for _, row in top_recommendations.iterrows():

        recommendations.append({
            "resource_id": int(row["id_site"]),
            "activity_type": row["activity_type"],
            "recommendation_score": round(
                float(row["recommendation_score"]),
                4
            )
        })


    return {
        "student": data.id_student,
        "course": data.code_module,
        "presentation": data.code_presentation,
        "seen_resources_removed": len(seen_resources),
        "candidate_resources": len(candidates),
        "recommendations": recommendations
    }


@app.post("/student-dashboard")
def student_dashboard(data: DashboardRequest):

    # -----------------------------------------------------
    # 1. Find learner profile
    # -----------------------------------------------------

    learner = learner_history_features[
        (learner_history_features["id_student"] == data.id_student)
        &
        (learner_history_features["code_module"] == data.code_module)
        &
        (
            learner_history_features["code_presentation"]
            == data.code_presentation
        )
    ]

    if learner.empty:
        return {
            "student": data.id_student,
            "course": data.code_module,
            "presentation": data.code_presentation,
            "found": False,
            "message": (
                "No learning profile found for this "
                "student-course combination."
            )
        }

    learner_row = learner.iloc[0]


    # -----------------------------------------------------
    # 2. Basic learning snapshot
    # -----------------------------------------------------

    total_clicks = int(
        learner_row["history_total_clicks"]
    )

    unique_resources = int(
        learner_row["history_unique_resources"]
    )

    active_days = int(
        learner_row["history_active_days"]
    )

    learning_span = int(
        learner_row["history_learning_span"]
    )

    avg_clicks_per_day = round(
        float(learner_row["avg_clicks_per_active_day"]),
        2
    )


    # -----------------------------------------------------
    # 3. Academic information
    # -----------------------------------------------------

    average_score = learner_row[
        "historical_average_score"
    ]

    assessment_count = learner_row[
        "historical_assessment_count"
    ]

    if pd.isna(average_score):
        average_score = None
    else:
        average_score = round(
            float(average_score),
            2
        )

    if pd.isna(assessment_count):
        assessment_count = None
    else:
        assessment_count = int(
            assessment_count
        )


    # -----------------------------------------------------
    # 4. Activity breakdown
    # -----------------------------------------------------

    activity_data = learner_activity_profile[
        (learner_activity_profile["id_student"] == data.id_student)
        &
        (
            learner_activity_profile["code_module"]
            == data.code_module
        )
        &
        (
            learner_activity_profile["code_presentation"]
            == data.code_presentation
        )
    ].copy()

    activity_breakdown = []

    if not activity_data.empty:

        activity_data = activity_data.sort_values(
            "activity_clicks",
            ascending=False
        )

        for _, row in activity_data.iterrows():

            activity_breakdown.append({
                "activity_type": row["activity_type"],
                "clicks": int(row["activity_clicks"]),
                "share": round(
                    float(row["activity_preference_score"]) * 100,
                    2
                )
            })


    # -----------------------------------------------------
    # 5. Course resource statistics
    # -----------------------------------------------------

    course_resources = resource_catalog[
        (resource_catalog["code_module"] == data.code_module)
        &
        (
            resource_catalog["code_presentation"]
            == data.code_presentation
        )
    ]

    total_course_resources = len(
        course_resources
    )


    # -----------------------------------------------------
    # 6. Already explored resources
    # -----------------------------------------------------

    seen_resources = history_resource_lookup[
        (history_resource_lookup["id_student"] == data.id_student)
        &
        (
            history_resource_lookup["code_module"]
            == data.code_module
        )
        &
        (
            history_resource_lookup["code_presentation"]
            == data.code_presentation
        )
    ]["id_site"].nunique()


    # -----------------------------------------------------
    # 7. New resources
    # -----------------------------------------------------

    new_resources = max(
        total_course_resources - seen_resources,
        0
    )


    # -----------------------------------------------------
    # 8. Return dashboard data
    # -----------------------------------------------------

    return {
        "found": True,

        "student": data.id_student,

        "course": data.code_module,

        "presentation": data.code_presentation,

        "snapshot": {
            "total_clicks": total_clicks,
            "unique_resources": unique_resources,
            "active_days": active_days,
            "learning_span_days": learning_span,
            "average_clicks_per_day": avg_clicks_per_day
        },

        "academic": {
            "average_score": average_score,
            "assessment_count": assessment_count
        },

        "resources": {
            "total_course_resources": total_course_resources,
            "already_explored": seen_resources,
            "new_resources": new_resources
        },

        "activity_breakdown": activity_breakdown
    }
