export type Testimonial = {
  name: string;
  role: string;
  content: string;
  avatar: string;
  company?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Product Manager",
    content: "VelloX completely transformed how our team collaborates. The visual boards are incredibly intuitive, and we've cut our meeting times in half.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    company: "TechFlow",
  },
  {
    name: "Marcus Chen",
    role: "Lead Developer",
    content: "Finally, a task manager that doesn't feel like a chore to use. The task distribution charts give me exactly what I need to see where my team's focus is at a glance.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    company: "Nexus",
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    content: "The aesthetic of VelloX alone makes me want to use it. But beyond the beautiful interface, the real-time activity feed keeps everyone in the loop effortlessly.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    content: "We switched from Jira to VelloX and haven't looked back. It has all the power we need without the clunky, overwhelming interface.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Anna Smith",
    role: "Operations Lead",
    content: "The Kanban boards and Table views make it so easy to switch between high-level planning and detailed task tracking. I can see everything without jumping between tools.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "James Wilson",
    role: "Engineering Manager",
    content: "Role-based access actually works smoothly here. The onboarding was painless, and my team actually enjoys updating their tasks now.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];
