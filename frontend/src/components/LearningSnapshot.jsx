function LearningSnapshot({ dashboard }) {
  if (!dashboard) return null;

  const stats = [
    {
      label: "Learning Interactions",
      value: dashboard.snapshot.total_clicks,
      description: "Total recorded interactions",
    },
    {
      label: "Resources Explored",
      value: dashboard.snapshot.unique_resources,
      description: "Different resources explored",
    },
    {
      label: "Active Learning Days",
      value: dashboard.snapshot.active_days,
      description: "Days with learning activity",
    },
    {
      label: "Learning Span",
      value: `${dashboard.snapshot.learning_span_days} days`,
      description: "From first to last activity",
    },
  ];

  return (
    <section className="mb-10">

      <div className="mb-6">
        <p className="mb-2 text-sm font-bold text-indigo-600">
          YOUR LEARNING SNAPSHOT
        </p>

        <h2 className="text-3xl font-black tracking-tight">
          Here's what we learned from your activity
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          A simple summary of how you interacted with learning
          resources in this course.
        </p>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <p className="text-sm font-semibold text-slate-500">
              {stat.label}
            </p>

            <p className="mt-2 text-3xl font-black">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {stat.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default LearningSnapshot;
