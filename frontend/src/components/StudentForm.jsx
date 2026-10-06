import {
  User,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";

function StudentForm({
  studentId,
  setStudentId,
  course,
  setCourse,
  presentation,
  setPresentation,
  topK,
  setTopK,
  loading,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">

      <div className="mb-7 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <User size={20} />
        </div>

        <div>
          <h3 className="font-bold">
            Start Your Learning Analysis
          </h3>

          <p className="text-sm text-slate-500">
            Enter learner details to generate personalized recommendations.
          </p>
        </div>

      </div>


      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* STUDENT */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Student ID
          </label>

          <div className="flex h-11 items-center rounded-lg border border-slate-200 px-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">

            <User
              size={17}
              className="mr-2 text-slate-400"
            />

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
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
            Number of Recommendations
          </label>

          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>

      </div>


      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={19}
              className="animate-spin"
            />
            Analyzing Learning Activity...
          </>
        ) : (
          <>
            Analyze & Get Recommendations
            <ArrowRight size={19} />
          </>
        )}
      </button>

    </section>
  );
}

export default StudentForm;
