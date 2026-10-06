import { Sparkles } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

function RecommendationList({
  recommendations,
  studentId,
  course,
  presentation,
}) {
  if (!recommendations.length) return null;

  return (
    <section className="mt-12">

      <div className="mb-7">

        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
          <Sparkles size={16} />
          PERSONALIZED FOR YOU
        </p>

        <h2 className="text-3xl font-black tracking-tight">
          Your Recommended Learning Resources
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Top resources ranked for Student{" "}
          <span className="font-semibold text-slate-700">
            {studentId}
          </span>{" "}
          in{" "}
          <span className="font-semibold text-slate-700">
            {course} {presentation}
          </span>.
        </p>

      </div>


      <div className="space-y-3">

        {recommendations.map((item, index) => (
          <RecommendationCard
            key={item.resource_id}
            item={item}
            index={index}
          />
        ))}

      </div>

    </section>
  );
}

export default RecommendationList;
