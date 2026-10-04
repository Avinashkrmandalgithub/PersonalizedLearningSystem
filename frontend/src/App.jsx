import { useState } from "react";
import {
  Brain,
  BookOpen,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function App() {
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

    try {
      const response = await fetch(`${API_URL}/recommend`, {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate recommendations");
      }

      if (!data.recommendations?.length) {
        setError(data.message || "No recommendations found.");
        return;
      }

      setRecommendations(data.recommendations);
      setCandidateResources(data.candidate_resources);
      setSeenResources(data.seen_resources_removed);
    } catch (err) {
      setError(err.message || "Unable to connect to ML server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Brain size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                LearnAI
              </h1>
              <p className="text-xs text-slate-500">
                Personalized Learning System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ML Model Online
          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="bg-slate-950 px-5 py-20 text-white lg:px-8">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            <Sparkles size={15} />
            AI-Powered Recommendations
          </div>

          <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
            Learn Smarter.
            <br />
            <span className="text-indigo-400">
              Learn Personally.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Get personalized learning resources based on your
            learning behaviour, academic performance and
            interaction patterns.
          </p>

        </div>

      </section>


      {/* MAIN */}
      <main className="mx-auto -mt-8 max-w-6xl px-5 pb-16 lg:px-8">

        {/* PROFILE CARD */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">

          <div className="mb-7 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User size={20} />
            </div>

            <div>
              <h3 className="font-bold">
                Student Profile
              </h3>

              <p className="text-sm text-slate-500">
                Enter learner information to generate personalized recommendations.
              </p>
            </div>

          </div>


          {/* FORM */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* STUDENT ID */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Student ID
              </label>

              <div className="flex h-11 items-center rounded-lg border border-slate-200 px-3 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">

                <User size={17} className="mr-2 text-slate-400" />

                <input
                  type="number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Student ID"
                />

              </div>
            </div>


            {/* COURSE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Course
              </label>

              <div className="flex h-11 items-center rounded-lg border border-slate-200 px-3 focus-within:border-indigo-500">

                <BookOpen
                  size={17}
                  className="mr-2 text-slate-400"
                />

                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option>AAA</option>
                  <option>BBB</option>
                  <option>CCC</option>
                  <option>DDD</option>
                  <option>EEE</option>
                  <option>FFF</option>
                  <option>GGG</option>
                </select>

              </div>
            </div>


            {/* PRESENTATION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Presentation
              </label>

              <select
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option>2013B</option>
                <option>2013J</option>
                <option>2014B</option>
                <option>2014J</option>
              </select>
            </div>


            {/* TOP K */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Recommendations
              </label>

              <select
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value={3}>Top 3</option>
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
              </select>
            </div>

          </div>


          {/* BUTTON */}
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />
                Generating Recommendations...
              </>
            ) : (
              <>
                Get Personalized Recommendations
                <ArrowRight size={19} />
              </>
            )}
          </button>

        </section>


        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />
            {error}
          </div>
        )}


        {/* RESULTS */}
        {recommendations.length > 0 && (

          <section className="mt-12">

            {/* HEADER */}
            <div className="mb-6">

              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
                <Sparkles size={16} />
                Personalized For You
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Recommended Learning Resources
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                ML-ranked resources for Student {studentId}
                in {course} {presentation}.
              </p>

            </div>


            {/* STATS */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-500">
                  New Resources Analyzed
                </p>

                <p className="mt-2 text-3xl font-black">
                  {candidateResources}
                </p>
              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-500">
                  Previously Seen
                </p>

                <p className="mt-2 text-3xl font-black">
                  {seenResources}
                </p>
              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-500">
                  Top Recommendations
                </p>

                <p className="mt-2 text-3xl font-black">
                  {recommendations.length}
                </p>
              </div>

            </div>


            {/* RECOMMENDATIONS */}
            <div className="space-y-3">

              {recommendations.map((item, index) => {

                const score = (
                  item.recommendation_score * 100
                ).toFixed(2);

                return (
                  <div
                    key={item.resource_id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-900/5"
                  >

                    <div className="flex items-start gap-4">

                      {/* RANK */}
                      <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
                        #{index + 1}
                      </div>


                      {/* ICON */}
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:flex">
                        <BookOpen size={20} />
                      </div>


                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <div>
                            <h3 className="font-bold">
                              Resource {item.resource_id}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Activity Type:{" "}
                              <span className="font-semibold capitalize text-slate-700">
                                {item.activity_type}
                              </span>
                            </p>
                          </div>


                          {/* SCORE */}
                          <div className="text-right">

                            <div className="flex items-center gap-1 text-indigo-600">
                              <Trophy size={15} />
                              <span className="text-sm font-black">
                                {score}%
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400">
                              ML ranking score
                            </span>

                          </div>

                        </div>


                        {/* PROGRESS */}
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                            style={{
                              width: `${score}%`,
                            }}
                          />

                        </div>


                        {/* EXPLANATION */}
                        <p className="mt-3 text-xs leading-5 text-slate-400">
                          Ranked using the learner's observed
                          interaction behaviour and resource
                          characteristics.
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

      </main>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-7 text-center">

        <p className="text-sm font-semibold text-slate-700">
          Personalized Learning Recommendation System
        </p>

        <p className="mt-1 text-xs text-slate-400">
          React • FastAPI • Scikit-learn • OULAD
        </p>

      </footer>

    </div>
  );
}

export default App;
