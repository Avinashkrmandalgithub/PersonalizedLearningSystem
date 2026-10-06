import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StudentForm from "./components/StudentForm";
import ErrorAlert from "./components/ErrorAlert";
import LearningSnapshot from "./components/LearningSnapshot";
import ActivityChart from "./components/ActivityChart";
import AcademicSnapshot from "./components/AcademicSnapshot";
import RecommendationJourney from "./components/RecommendationJourney";
import RecommendationStats from "./components/RecommendationStats";
import RecommendationList from "./components/RecommendationList";
import Footer from "./components/Footer";


const API_URL = "http://127.0.0.1:8000";


function App() {

  const [dashboard, setDashboard] = useState(null);

  const [studentId, setStudentId] = useState("8462");
  const [course, setCourse] = useState("DDD");
  const [presentation, setPresentation] = useState("2013J");
  const [topK, setTopK] = useState(5);

  const [recommendations, setRecommendations] = useState([]);

  const [candidateResources, setCandidateResources] = useState(null);
  const [seenResources, setSeenResources] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const getRecommendations = async () => {

    setLoading(true);
    setError("");
    setRecommendations([]);
    setDashboard(null);

    try {

      // ----------------------------------
      // 1. Student dashboard
      // ----------------------------------

      const dashboardResponse = await fetch(
        `${API_URL}/student-dashboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_student: Number(studentId),
            code_module: course,
            code_presentation: presentation,
          }),
        }
      );


      const dashboardData =
        await dashboardResponse.json();


      if (
        !dashboardResponse.ok ||
        !dashboardData.found
      ) {
        throw new Error(
          dashboardData.message ||
            "No learning profile found for this student-course combination."
        );
      }


      setDashboard(dashboardData);


      // ----------------------------------
      // 2. Recommendations
      // ----------------------------------

      const response = await fetch(
        `${API_URL}/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_student: Number(studentId),
            code_module: course,
            code_presentation: presentation,
            top_k: Number(topK),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to generate recommendations"
        );
      }


      if (!data.recommendations?.length) {
        throw new Error(
          data.message ||
            "No recommendations found."
        );
      }


      setRecommendations(
        data.recommendations
      );

      setCandidateResources(
        data.candidate_resources
      );

      setSeenResources(
        data.seen_resources_removed
      );

    } catch (err) {

      setError(
        err.message ||
          "Unable to connect to ML server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      <Hero />


      <main className="mx-auto -mt-8 max-w-6xl px-5 pb-16 lg:px-8">

        {/* INPUT */}
        <StudentForm
          studentId={studentId}
          setStudentId={setStudentId}
          course={course}
          setCourse={setCourse}
          presentation={presentation}
          setPresentation={setPresentation}
          topK={topK}
          setTopK={setTopK}
          loading={loading}
          onSubmit={getRecommendations}
        />


        {/* ERROR */}
        <ErrorAlert message={error} />


        {/* RESULTS */}
        {dashboard && recommendations.length > 0 && (

          <div className="mt-12">

            {/* SNAPSHOT */}
            <LearningSnapshot
              dashboard={dashboard}
            />


            {/* ACTIVITY + ACADEMIC */}
            <section className="mb-10 grid gap-6 lg:grid-cols-2">

              <ActivityChart
                activities={
                  dashboard.activity_breakdown
                }
              />

              <AcademicSnapshot
                academic={
                  dashboard.academic
                }
              />

            </section>


            {/* JOURNEY */}
            <RecommendationJourney
              dashboard={dashboard}
              recommendationCount={
                recommendations.length
              }
            />


            {/* STATS */}
            <RecommendationStats
              candidateResources={
                candidateResources
              }
              seenResources={
                seenResources
              }
              recommendationCount={
                recommendations.length
              }
            />


            {/* RECOMMENDATIONS */}
            <RecommendationList
              recommendations={
                recommendations
              }
              studentId={studentId}
              course={course}
              presentation={presentation}
            />

          </div>

        )}

      </main>


      <Footer />

    </div>
  );
}


export default App;
