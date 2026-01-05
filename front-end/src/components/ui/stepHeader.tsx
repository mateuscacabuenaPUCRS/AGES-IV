interface StepHeaderProps {
  stepNumber: string;
  title: string;
  value?: string;
  isActive: boolean;
  valueType?: "currency" | "text" | "status";
}

const StepHeader = ({
  stepNumber,
  title,
  value,
  isActive,
  valueType = "currency",
}: StepHeaderProps) => {
  const getStatusClasses = (statusValue?: string) => {
    switch (statusValue) {
      case "Confirmado":
        return "border-green-800 bg-green-100 text-green-800";
      case "Pendente":
        return "border-yellow-500 bg-yellow-100 text-yellow-600";
      case "Negado":
        return "border-red-600 bg-red-100 text-red-600";
      case "Cancelado":
        return "border-red-600 bg-red-100 text-red-600";
      default:
        return "border-gray-300 bg-white/50 text-gray-700";
    }
  };

  const formattedValue = (() => {
    if (!value) return "";
    if (valueType === "currency") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(value));
    }
    return value;
  })();

  return (
    <div className="flex items-center justify-between w-full mr-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 ${
            isActive
              ? "border-blue-800 bg-blue-800 text-white"
              : "border-gray-400 bg-transparent text-gray-400"
          }`}
        >
          {stepNumber}
        </div>
        <span className="font-semibold">{title}</span>
      </div>

      {value && (
        <span
          className={`ml-4 rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-300 ${
            valueType === "status"
              ? getStatusClasses(value)
              : "border-gray-300 bg-white/50 text-gray-700"
          }`}
        >
          {formattedValue}
        </span>
      )}
    </div>
  );
};

export default StepHeader;
