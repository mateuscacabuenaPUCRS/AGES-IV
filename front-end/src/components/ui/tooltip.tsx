import cn from "@/utils/cn";
import React, { useState } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
  disabled?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap",
            "transition-opacity duration-200",
            positionClasses[position],
            className
          )}
        >
          {content}
          {/* Arrow/pontinha da tooltip */}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              position === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
              position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
              position === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
              position === "right" && "right-full top-1/2 -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
