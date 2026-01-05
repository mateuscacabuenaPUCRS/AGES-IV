interface Step {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      {steps.map((step, index) => (
        <>
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.isActive
                  ? "bg-[var(--color-components)] text-white"
                  : step.isCompleted
                    ? "bg-sky-300 text-sky-700"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-sm font-medium ${
                step.isActive
                  ? "text-[var(--color-components)]"
                  : step.isCompleted
                    ? "text-sky-500"
                    : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${step.isCompleted ? "bg-sky-400" : "bg-gray-300"}`} />
          )}
        </>
      ))}
    </div>
  );
}
