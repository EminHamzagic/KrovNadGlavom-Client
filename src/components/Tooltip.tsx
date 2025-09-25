import type { ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
}

function Tooltip({
  children,
  text,
  position = "top",
}: TooltipProps) {
  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative flex items-center group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} 
        hidden group-hover:inline-block
        bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap`}
      >
        {text}
      </div>
    </div>
  );
}

export default Tooltip;
