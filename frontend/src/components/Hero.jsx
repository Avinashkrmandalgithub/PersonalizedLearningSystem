import { Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="bg-slate-950 px-5 py-20 text-white lg:px-8">

      <div className="mx-auto max-w-4xl text-center">

        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          <Sparkles size={15} />
          Personalized Learning Recommendations
        </div>

        <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
          Learn Smarter.
          <br />

          <span className="text-indigo-400">
            Learn Personally.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Understand your learning activity and discover
          new resources ranked specifically for your learning journey.
        </p>

      </div>

    </section>
  );
}

export default Hero;
