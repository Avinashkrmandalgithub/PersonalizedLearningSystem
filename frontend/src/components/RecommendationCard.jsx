import { BookOpen, Trophy } from "lucide-react";

function RecommendationCard({ item, index }) {

  const score = Number(
    item.recommendation_score
  ).toFixed(4);

  const scorePercent = (
    item.recommendation_score * 100
  ).toFixed(2);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">

      <div className="flex items-start gap-4">

        {/* RANK */}
        <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
          #{index + 1}
        </div>


        {/* ICON */}
        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:flex">
          <BookOpen size={20} />
        </div>


        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Learning Resource {item.resource_id}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Resource type:{" "}
                <span className="font-semibold capitalize text-slate-700">
                  {item.activity_type}
                </span>
              </p>

            </div>


            {/* SCORE */}
            <div className="text-right">

              <div className="flex items-center justify-end gap-1 text-indigo-600">

                <Trophy size={15} />

                <span className="text-sm font-black">
                  {score}
                </span>

              </div>

              <span className="text-[10px] text-slate-400">
                ML ranking score
              </span>

            </div>

          </div>


          {/* SCORE BAR */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{
                width: `${scorePercent}%`,
              }}
            />

          </div>


          {/* SIMPLE EXPLANATION */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3">

            <p className="text-xs leading-5 text-slate-500">

              <span className="font-semibold text-slate-700">
                Why is this here?
              </span>{" "}

              This resource was ranked highly using the
              learner's observed interaction behaviour and
              resource characteristics.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecommendationCard;
