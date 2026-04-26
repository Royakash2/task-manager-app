import { LayoutDashboard, Users, BarChart3, Shield } from "lucide-react";

const features = [
  {
    title: "Kanban Boards",
    description: "Drag and drop tasks across customizable columns to visualize your workflow",
    icon: LayoutDashboard,
  },
  {
    title: "Team Collaboration",
    description: "Assign tasks, leave comments, and keep your team aligned in real-time",
    icon: Users,
  },
  {
    title: "Project Dashboard",
    description: "Get instant insights with task distribution charts and activity feeds",
    icon: BarChart3,
  },
  {
    title: "Role-Based Access",
    description: "Control who sees what with workspace-level permissions and access levels",
    icon: Shield,
  },
];

export const Features = () => {
  return (
    <section id="features" className="w-full py-24 bg-slate-50/50 dark:bg-background/50 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to manage projects
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple tools that help your team stay organized and productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="h-full p-6 bg-background rounded-xl border border-border/60 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
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
