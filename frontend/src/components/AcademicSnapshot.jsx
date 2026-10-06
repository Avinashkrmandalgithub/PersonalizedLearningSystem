function AcademicSnapshot({ academic }) {
  if (!academic) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <p className="text-sm font-bold text-indigo-600">
        ACADEMIC CONTEXT
      </p>

      <h3 className="mt-1 text-xl font-black">
        Assessment Snapshot
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Academic information available for this learner.
      </p>


      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            Average Score
          </p>

          <p className="mt-2 text-3xl font-black">
            {academic.average_score ?? "N/A"}
          </p>

        </div>


        <div className="rounded-xl bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            Assessments
          </p>

          <p className="mt-2 text-3xl font-black">
            {academic.assessment_count ?? "N/A"}
          </p>

        </div>

      </div>


      <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

        <p className="text-sm leading-6 text-indigo-900">
          Academic history is used as an additional learner
          signal when assessment data is available.
        </p>

      </div>

    </div>
  );
}

export default AcademicSnapshot;
