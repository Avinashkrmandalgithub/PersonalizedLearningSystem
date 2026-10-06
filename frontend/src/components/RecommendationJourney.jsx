import {
  UserRound,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function RecommendationJourney({
  dashboard,
  recommendationCount,
}) {
  if (!dashboard) return null;

  const steps = [
    {
      number: "01",
      icon: UserRound,
      title: "Understand Activity",
      description:
        "We look at how the learner interacted with resources.",
    },
    {
      number: "02",
      icon: BookOpen,
      title: "Find New Resources",
      description:
        "Resources already explored are removed from the candidate pool.",
    },
    {
      number: "03",
      icon: Brain,
      title: "ML Ranks Them",
      description:
        "The recommendation model gives each candidate a ranking score.",
    },
    {
      number: "04",
      icon: Sparkles,
      title: "Show Top Picks",
      description:
        "The highest-ranked resources become the final recommendations.",
    },
  ];

  return (
    <section className="mb-10">

      <div className="mb-6">
        <p className="mb-2 text-sm font-bold text-indigo-600">
          THE RECOMMENDATION JOURNEY
        </p>

        <h2 className="text-3xl font-black tracking-tight">
          From learning activity to recommendations
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Here's the simple process happening behind the scenes.
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-4">

        {steps.map((step) => {

          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={21} />
                </div>

                <span className="text-xs font-black text-slate-300">
                  {step.number}
                </span>

              </div>

              <h3 className="font-bold">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>

            </div>
          );
        })}

      </div>


      {/* DATA FLOW */}
      <div className="mt-5 rounded-2xl bg-slate-950 p-6 text-white">

        <div className="grid gap-6 text-center sm:grid-cols-4">

          <FlowStat
            value={dashboard.resources.total_course_resources}
            label="Course Resources"
          />

          <FlowStat
            value={dashboard.resources.already_explored}
            label="Already Explored"
          />

          <FlowStat
            value={dashboard.resources.new_resources}
            label="New Resources"
            highlight
          />

          <FlowStat
            value={recommendationCount}
            label="Top Recommendations"
            success
          />

        </div>


        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">

          <span>Course resources</span>
          <ArrowRight size={14} />
          <span>Remove explored</span>
          <ArrowRight size={14} />
          <span>ML ranking</span>
          <ArrowRight size={14} />
          <span className="font-bold text-white">
            Top picks
          </span>

        </div>

      </div>

    </section>
  );
}


function FlowStat({
  value,
  label,
  highlight,
  success,
}) {
  return (
    <div>

      <p
        className={`text-3xl font-black ${
          highlight
            ? "text-indigo-400"
            : success
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  );
}

export default RecommendationJourney;
