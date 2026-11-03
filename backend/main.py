import os
import pandas as pd

from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="Personalized Learning Recommendation System API",
    version="1.0.0"
)

frontend_urls = [
    url.strip().rstrip("/")
    for url in os.getenv(
        "FRONTEND_URLS",
        "http://localhost:5173"
    ).split(",")
    if url.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent / "data"

def load_csv(filename):
    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")

    return pd.read_csv(path)


@app.get("/")
def home():
    return {
        "message": "Personalized Learning Recommendation System API",
        "status": "running"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.get("/api/stats")
def get_stats():
    students = load_csv("student_profiles.csv")
    recommendations = load_csv("top_recommendations.csv")
    resources = load_csv("resource_catalogue.csv")

    return {
        "total_students": int(students["Student-Id"].nunique()),
        "total_courses": int(resources["Course Code"].nunique()),
        "total_resources": int(len(resources)),
        "total_recommendations": int(len(recommendations)),
        "students_covered": int(
            recommendations["Student-Id"].nunique()
        )
    }


@app.get("/api/students")
def get_students():
    students = load_csv("student_profiles.csv")

    return students.fillna("").to_dict(orient="records")


@app.get("/api/students/{student_id}")
def get_student(student_id: int):
    students = load_csv("student_profiles.csv")

    result = students[
        students["Student-Id"] == student_id
    ]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return result.fillna("").iloc[0].to_dict()


@app.get("/api/students/{student_id}/recommendations")
def get_recommendations(student_id: int):
    recommendations = load_csv("top_recommendations.csv")

    result = recommendations[
        recommendations["Student-Id"] == student_id
    ]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail="No recommendations found for this student"
        )

    return result.sort_values(
        "Recommendation Rank"
    ).fillna("").to_dict(orient="records")
