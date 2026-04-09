export interface Activity {
    id: string;
    type: string;
    description: string;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
    };
}

interface ActivityFeedProps {
    activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
    return <div>

    </div>;
};
