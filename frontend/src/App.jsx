
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function explainRecommendation(item) {
  if (Number(item.Priority) === 1) {
    return {
      title: "Practice recommended",
      explanation:
        "Previous attempts are recorded in this course. The system gives practice resources higher priority to encourage further practice.",
      icon: "🎯",
    };
  }

  if (Number(item.Priority) === 2) {
    return {
      title: "Revision recommended",
      explanation:
        "This beginner-level resource can help you revise and strengthen fundamental concepts.",
      icon: "📘",
    };
  }

  return {
    title: "Additional learning",
    explanation:
      "This resource provides another learning option to help you explore more topics in this course.",
    icon: "💡",
  };
}

function App() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("201801001");
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState("");

  async function loadStudentData(id) {
    setLoading(true);
    setError("");
    setProfile(null);
    setRecommendations([]);

    try {
      const [profileRes, recommendationRes] = await Promise.all([
        fetch(`${API}/api/students/${id}`),
        fetch(`${API}/api/students/${id}/recommendations`),
      ]);

      if (!profileRes.ok || !recommendationRes.ok) {
        throw new Error(
          "Student data not found. Please check the Student ID."
        );
      }

      const [profileData, recommendationData] = await Promise.all([
        profileRes.json(),
        recommendationRes.json(),
      ]);

      setProfile(profileData);
      setRecommendations(recommendationData);
    } catch (err) {
      setError(
        err.message || "Unable to load student recommendations."
      );
    } finally {
      setLoading(false);
    }
  }

  async function getRecommendations() {
    if (!studentId) {
      setError("Please select a student ID.");
      return;
    }

    await loadStudentData(studentId);
  }

  useEffect(() => {
    let isMounted = true;

    async function initializeDashboard() {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          fetch(`${API}/api/stats`),
          fetch(`${API}/api/students`),
        ]);

        if (!statsRes.ok || !studentsRes.ok) {
          throw new Error("Unable to connect to the backend.");
        }

        const [statsData, studentsData] = await Promise.all([
          statsRes.json(),
          studentsRes.json(),
        ]);

        if (!isMounted) return;

        setStats(statsData);
        setStudents(studentsData);
        setApiConnected(true);

        if (studentsData.length > 0) {
          const initialStudent = String(
            studentsData[0]["Student-Id"]
          );

          setStudentId(initialStudent);

          await loadStudentData(initialStudent);
        } else {
          setError("No student records found.");
        }
      } catch (err) {
        if (isMounted) {
          setApiConnected(false);
          setError(
            err.message || "Backend connection failed."
          );
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
          setStudentsLoading(false);

          // Short transition after API initialization
          setTimeout(() => {
            if (isMounted) setAppReady(true);
          }, 1000);
        }
      }
    }

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayValue = (value) =>
    value === null || value === undefined || value === ""
      ? "Not Available"
      : value;

  // Full-screen animated loading screen
  if (!appReady) {
    return (
      <div className="ml-loader">
        <div className="loader-content">

          <div className="neural-orb">
            <div className="orb-ring ring-one"></div>
            <div className="orb-ring ring-two"></div>

            <div className="orb-core">✦</div>

            <span className="node node-one"></span>
            <span className="node node-two"></span>
            <span className="node node-three"></span>
            <span className="node node-four"></span>
          </div>

          <span className="loader-label">
            PERSONALIZED LEARNING SYSTEM
          </span>

          <h1>Building Your Learning Path</h1>

          <p>
            Analyzing learner profiles and preparing
            personalized resources...
          </p>

          <div className="loader-progress">
            <span></span>
          </div>

          <div className="loader-steps">
            <div>
              {apiConnected ? "✓" : "✦"} Connecting to recommendation API
            </div>

            <div>
              {students.length > 0 ? "✓" : "✦"} Loading student profiles
            </div>

            <div className="active-step">
              ✦ Preparing learning recommendations
            </div>
          </div>

          <span className="loader-footer">
            INTELLIGENT LEARNING ANALYTICS
          </span>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="app">

      <header className="header">
        <div>
          <div className="brand">
            <span className="brand-icon">✦</span>
            <h1>Personalized Learning System</h1>
          </div>

          <p>
            Smart learning recommendations for every student
          </p>
        </div>

        <span
          className={`status ${
            apiConnected ? "online" : "offline"
          }`}
        >
          <span className="status-dot"></span>
          {apiConnected ? "API Connected" : "API Disconnected"}
        </span>
      </header>

      <main>

        <section className="welcome">
          <div>
            <span className="eyebrow">
              LEARNING ANALYTICS
            </span>

            <h2>Dashboard Overview</h2>

            <p>
              Understand student activity and discover
              personalized learning resources.
            </p>
          </div>
        </section>

        {/* Dashboard statistics */}
        <section className="stats">

          {[
            ["Total Students", stats?.total_students, "👨‍🎓"],
            ["Courses", stats?.total_courses, "📚"],
            ["Learning Resources", stats?.total_resources, "📖"],
            ["Recommendations", stats?.total_recommendations, "🎯"],
          ].map(([label, value, icon]) => (

            <div className="stat-card" key={label}>

              <div className="stat-top">
                <span>{icon}</span>
              </div>

              {statsLoading ? (
                <div className="skeleton skeleton-number"></div>
              ) : (
                <h3>{value ?? "N/A"}</h3>
              )}

              <p>{label}</p>

            </div>
          ))}

        </section>

        {/* Student selection */}
        <section className="panel search-panel">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                STUDENT EXPLORER
              </span>

              <h2>Find Your Learning Recommendations</h2>

              <p>
                Select a student ID to view their profile
                and suggested resources.
              </p>
            </div>

            <span className="heading-icon">🔍</span>
          </div>

          <div className="search-row">

            <select
              value={studentId}
              disabled={
                studentsLoading || students.length === 0
              }
              onChange={(e) => setStudentId(e.target.value)}
            >
              {students.map((student) => (
                <option
                  key={student["Student-Id"]}
                  value={student["Student-Id"]}
                >
                  {student["Student-Id"]}
                </option>
              ))}
            </select>

            <button
              onClick={getRecommendations}
              disabled={
                loading || studentsLoading || !apiConnected
              }
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Finding Resources...
                </>
              ) : (
                "Get Recommendations →"
              )}
            </button>

          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </section>

        {/* Recommendation loading */}
        {loading && (
          <section className="panel loading-state">
            <div className="spinner"></div>

            <h3>
              Finding the best learning resources...
            </h3>

            <p>
              Analyzing the selected student's learning profile.
            </p>
          </section>
        )}

        {/* Student profile */}
        {!loading && profile && (
          <section className="panel">

            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  LEARNER INFORMATION
                </span>

                <h2>Student Profile</h2>
              </div>

              <span className="heading-icon">👤</span>
            </div>

            <div className="profile-grid">

              <p>
                <b>Student ID</b>
                <span>{profile["Student-Id"]}</span>
              </p>

              <p>
                <b>Courses Enrolled</b>
                <span>{displayValue(profile.courses_enrolled)}</span>
              </p>

              <p>
                <b>Average Feedback</b>
                <span>{displayValue(profile.avg_feedback)}</span>
              </p>

              <p>
                <b>Previous Attempts</b>
                <span>{displayValue(profile.previous_attempts)}</span>
              </p>

              <p>
                <b>Days Viewed</b>
                <span>{displayValue(profile.days_viewed)}</span>
              </p>

              <p>
                <b>Total Clicks</b>
                <span>{displayValue(profile.total_clicks)}</span>
              </p>

            </div>
          </section>
        )}

        {/* Personalized recommendations */}
        {!loading && recommendations.length > 0 && (
          <section className="panel">

            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  YOUR LEARNING PATH
                </span>

                <h2>Personalized Recommendations</h2>

                <p>
                  Resources selected using your available
                  learning profile.
                </p>
              </div>

              <span className="recommendation-count">
                {recommendations.length} Resources
              </span>
            </div>

            <div className="recommendations">

              {recommendations.map((item) => {

                const explanation =
                  explainRecommendation(item);

                return (
                  <article
                    className="resource-card"
                    key={item["Recommendation Rank"]}
                  >

                    <span className="rank">
                      RECOMMENDATION #{item["Recommendation Rank"]}
                    </span>

                    <h3>{item.Topic}</h3>

                    <p className="course-name">
                      {item["Course Name"]}
                    </p>

                    <div className="tags">
                      <span>{item["Resource Type"]}</span>
                      <span>{item.Difficulty}</span>
                      <span>Priority {item.Priority}</span>
                    </div>

                    <div className="why-box">

                      <h4>
                        {explanation.icon} Why recommended?
                      </h4>

                      <strong>
                        {explanation.title}
                      </strong>

                      <p>
                        {explanation.explanation}
                      </p>

                    </div>

                  </article>
                );
              })}

            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading &&
          profile &&
          recommendations.length === 0 && (
            <section className="panel empty-state">
              <h3>No recommendations available</h3>

              <p>
                There are currently no recommendations
                for this student.
              </p>
            </section>
          )}

      </main>

      <footer>
        <strong>
          Personalized Learning Recommendation System
        </strong>

        <span>
          Built for PBL Project · 2026
        </span>
      </footer>

    </div>
  );
}

export default App;
