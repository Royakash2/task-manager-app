'use client'

interface TaskDistributionProps {
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        overdue: number;
    };
}

const TaskDistributionChart = ({ tasks }: TaskDistributionProps) => {
    return (
        <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
           
        </div>
    );
};

export default TaskDistributionChart;
