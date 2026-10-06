import { Brain } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Brain size={21} />
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

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          ML Model Online
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
