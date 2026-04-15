import { cn } from "@/lib/utils";
import { CheckCircle2, Activity, Clock, Users } from "lucide-react";

type variantType = "default" | "warning" | "inProgress" | "success";

interface CircleProgressProps {
    value: number;
    title: string;
    subTitle: string;
    variant?: variantType;
}


const variantIcons = {
    success: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    inProgress: <Activity className="h-4 w-4 text-orange-500" />,
    warning: <Clock className="h-4 w-4 text-yellow-600" />,
    default: <Users className="h-4 w-4 text-blue-600" />,
};

const strokeColors = {
    default: "text-blue-600",
    warning: "text-yellow-600",
    inProgress: "text-orange-500",
    success: "text-green-600",
};

// Precomputed static SVG scaling constants
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CircleProgress = ({
    value,
    title,
    subTitle,
    variant = "default",
    showPercentage = true,
}: CircleProgressProps & { showPercentage?: boolean }) => {
    // Math logic hoisted/memoized to prevent redundant calculations per render
    const safeValue = Number.isFinite(value) ? value : 0;
    const displayValue = Math.round(safeValue);
    const strokeDashoffset = showPercentage 
        ? CIRCUMFERENCE - (safeValue / 100) * CIRCUMFERENCE 
        : 0; 
    return (
        <div className="flex flex-col p-6 w-full">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                {variantIcons[variant]}
            </div>

            <div className="mt-2 flex items-end justify-between gap-2">
                <div className="flex flex-col">
                    <div className="text-3xl font-bold text-foreground">
                        {showPercentage ? `${displayValue}%` : displayValue}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                        {subTitle}
                    </p>
                </div>
                
                {showPercentage && (
                    <div className="shrink-0 relative flex items-center justify-center">
                        <svg className="w-12 h-12 transform -rotate-90">
                            {/* Background Track */}
                            <circle
                                className="text-secondary"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="transparent"
                                r={RADIUS}
                                cx="24"
                                cy="24"
                            />
                            {/* Progress Ring */}
                            <circle
                                className={cn("transition-all duration-1000 ease-out", strokeColors[variant])}
                                strokeWidth="5"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r={RADIUS}
                                cx="24"
                                cy="24"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};