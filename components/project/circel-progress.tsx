import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

type variantType = "default" | "warning" | "inProgress" | "success";

interface CircleProgressProps {
    value: number;
    title: string;
    subTitle: string;
    variant?: variantType;
}

const variantStyles = {
    default: "text-blue-600",
    warning: "text-yellow-600",
    inProgress: "text-red-600",
    success: "text-green-600",
}

export const CircleProgress = ({
    value,
    title,
    subTitle,
    variant = "default",
}: CircleProgressProps) => {
    return (
        <div className="flex flex-col items-center p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {title}
            </h3>

            <div className="relative w-20 h-20">
                <Progress
                    value={value}
                    className={cn(
                        `h-20 w-20 -rotate-90deg ${variantStyles[variant as variantType]}`
                    )}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span>{`${Math.round(value || 0)}%`}</span> 
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center whitespace-nowrap">
                {subTitle}
            </p>
        </div>
    )
}