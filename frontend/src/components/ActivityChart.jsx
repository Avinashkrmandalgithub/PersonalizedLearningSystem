function ActivityChart({ activities = [] }) {
  const visibleActivities = activities.slice(0, 7);

  if (!visibleActivities.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="mb-6">
        <p className="text-sm font-bold text-indigo-600">
          LEARNING BEHAVIOUR
        </p>

        <h3 className="mt-1 text-xl font-black">
          What did you interact with?
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Your observed interaction pattern across resource types.
        </p>
      </div>


      <div className="space-y-5">

        {visibleActivities.map((activity) => (

          <div key={activity.activity_type}>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-semibold capitalize">
                {activity.activity_type}
              </span>

              <span className="text-sm font-bold text-slate-600">
                {activity.share}%
              </span>

            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{
                  width: `${activity.share}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>


      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <p className="text-xs leading-5 text-slate-500">
          <span className="font-bold text-slate-700">
            What this means:
          </span>{" "}
          these percentages show where the learner's recorded
          interactions were concentrated. They represent
          observed behaviour, not explicit preferences.
        </p>

      </div>

    </div>
  );
}

export default ActivityChart;
