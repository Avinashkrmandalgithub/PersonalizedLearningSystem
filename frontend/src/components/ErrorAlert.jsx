import { AlertCircle } from "lucide-react";

function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

      <AlertCircle
        size={19}
        className="mt-0.5 shrink-0"
      />

      <div>
        <p className="font-semibold">
          We couldn't generate recommendations
        </p>

        <p className="mt-1">
          {message}
        </p>
      </div>

    </div>
  );
}

export default ErrorAlert;
