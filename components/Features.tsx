"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { LayoutDashboard, Users, BarChart3, Shield } from "lucide-react";
import { SectionHeader } from "./ui/section-header";


// Animation variants for the container and items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

export const Features = () => {
  const featureData = {
    title: "Features you need",
    subtitle: "Simple, powerful tools that help your team stay organized and productive — all in one place.",
    features: [
      {
        icon: <LayoutDashboard className="h-6 w-6" />,
        title: "Kanban Boards",
        description: "Drag and drop tasks across customizable columns to visualize your workflow.",
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Team Collaboration",
        description: "Assign tasks, leave comments, and keep your team aligned in real-time.",
      },
      {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Project Dashboard",
        description: "Get instant insights with task distribution charts and activity feeds.",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Role-Based Access",
        description: "Control who sees what with workspace-level permissions and access levels.",
      },
    ],
    
  }

  return (
    <section id="features" className="w-full py-24 md:py-32 bg-muted/30 dark:bg-muted/10 border-t border-border/40 overflow-hidden">
      <motion.div
        className="container mx-auto max-w-7xl px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <SectionHeader
            title={featureData.title}
            description={featureData.subtitle}

          />
        </motion.div>

        {/* Features Grid */}
        <div className="mx-auto  grid max-w-2xl grid-cols-1 gap-8 text-left  lg:max-w-none lg:grid-cols-2">
          {featureData.features.map((feature, index) => (
            <motion.div variants={itemVariants} key={index} className="flex gap-x-6">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold leading-7 text-foreground">{feature.title}</h3>
                <p className="mt-1 text-base leading-7 text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
