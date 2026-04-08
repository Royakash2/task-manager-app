'use client'

import { ChartConfig } from "../ui/chart";

interface TaskDistributionProps {
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        overdue: number;
    };
}

const chartConfig = {
    tasks: {
        label: "Tasks",
    },
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-1))",
    },
    inProgress: {
        label: "In Progress",
        color: "hsl(var(--chart-2))",
    },
    overdue: {
        label: "Overdue",
        color: "hsl(var(--chart-3))",
    },
    todo: {
        label: "Todo",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

const TaskDistributionChart = ({ tasks }: TaskDistributionProps) => {
    return (
        <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
           
        </div>
    );
};

export default TaskDistributionChart;
