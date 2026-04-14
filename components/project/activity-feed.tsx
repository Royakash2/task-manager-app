import { ProfileAvatar } from "../profile-avatar";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "@/utils/types";

interface ActivityFeedProps {
    activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
    return (
        <div className="space-y-4">
            {activities?.map((activity) => (
                <div key={activity.id} className="flex items-center gap-2">
                    <ProfileAvatar 
                        url={activity.user.image || undefined}
                        name={activity.user.name}
                        numOfChars={1}
                        size="md"
                    />

                    <div className="flex flex-col">
                        <p className="text-xs 2xl:text-sm">
                            <span className="font-medium">{activity.user.name}</span> {""}
                            {activity.description.slice(0, 25)}..
                        </p>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
