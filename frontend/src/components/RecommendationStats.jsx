function RecommendationStats({
  candidateResources,
  seenResources,
  recommendationCount,
}) {
  const stats = [
    {
      label: "Unseen Resources",
      value: candidateResources,
      description: "Available for recommendation",
    },
    {
      label: "Already Explored",
      value: seenResources,
      description: "Removed from recommendations",
    },
    {
      label: "Top Recommendations",
      value: recommendationCount,
      description: "Selected by the model",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">

      {stats.map((stat) => (

        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >

          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
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
  );
}

export default RecommendationStats;
