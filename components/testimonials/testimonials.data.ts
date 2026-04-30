export type Testimonial = {
  name: string;
  role: string;
  content: string;
  avatar: string;
  color: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Product Manager at TechFlow",
    content: "VelloX completely transformed how our team collaborates. The visual boards are incredibly intuitive, and we've cut our meeting times in half.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "Marcus Chen",
    role: "Lead Developer at Nexus",
    content: "Finally, a task manager that doesn't feel like a chore to use. The velocity charts give me exactly what I need to track my team's sprint progress.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    content: "The aesthetic of VelloX alone makes me want to use it. But beyond the beautiful interface, the real-time activity feed keeps everyone in the loop effortlessly.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    content: "We switched from Jira to VelloX and haven't looked back. It has all the power we need without the clunky, overwhelming interface.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    color: "from-rose-500 to-orange-500"
  },
  {
    name: "Anna Smith",
    role: "Operations Lead",
    content: "The bento box dashboard is genius. Seeing my calendar, kanban, and team activity in one unified view saves me hours of context switching every week.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "James Wilson",
    role: "Engineering Manager",
    content: "Role-based access actually works smoothly here. The onboarding was painless, and my team actually enjoys updating their tasks now.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    color: "from-cyan-500 to-blue-500"
  }
];

// Duplicate arrays for the seamless loop (we double it inside the render)
export const firstRow = [...testimonials, ...testimonials];
export const secondRow = [...[...testimonials].reverse(), ...[...testimonials].reverse()];
