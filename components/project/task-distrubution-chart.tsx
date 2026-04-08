'use client'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pie, PieChart } from "recharts";

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
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default TaskDistributionChart;
