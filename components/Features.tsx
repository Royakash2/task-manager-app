import { LayoutDashboard, Users, BarChart3, Shield } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const features = [
  {
    title: "Kanban Boards",
    description:
      "Drag and drop tasks across customizable columns to visualize your workflow",
    icon: LayoutDashboard,
  },
  {
    title: "Team Collaboration",
    description:
      "Assign tasks, leave comments, and keep your team aligned in real-time",
    icon: Users,
  },
  {
    title: "Project Dashboard",
    description:
      "Get instant insights with task distribution charts and activity feeds",
    icon: BarChart3,
  },
  {
    title: "Role-Based Access",
    description:
      "Control who sees what with workspace-level permissions and access levels",
    icon: Shield,
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="w-full py-24 md:py-32 bg-muted/30 dark:bg-muted/10 border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader
          title="Everything you need to manage projects"
          
          description="Simple, powerful tools that help your team stay organized and productive — all in one place."
        />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative h-full p-7 bg-white dark:bg-card rounded-xl border border-border/60 dark:border-border shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 flex flex-col hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400 transition-colors duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 tracking-tight text-foreground/90">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
