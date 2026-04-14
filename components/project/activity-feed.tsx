import { ProfileAvatar } from "../profile-avatar";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "@/utils/types";

interface ActivityFeedProps {
    activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
    return (
        <div className="space-y-5">
            {activities?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                    <ProfileAvatar 
                        url={activity.user.image || undefined}
                        name={activity.user.name}
                        numOfChars={1}
                        size="md"
                    />

                    <div className="flex flex-col gap-0.5">
                        <p className="text-xs 2xl:text-sm text-foreground/90 leading-tight">
                            <span className="font-semibold text-foreground">{activity.user.name}</span> {""}
                            {activity.description.slice(0, 35)}{activity.description.length > 35 ? ".." : ""}
                        </p>
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
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
