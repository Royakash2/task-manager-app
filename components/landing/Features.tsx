"use client";

import * as React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { SectionHeader } from "../ui/section-header";
import { Card, CardContent } from "@/components/ui/card";

// Animation variants for the container and items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
};

export const Features = () => {
  const featureData = {
    title: "Everything you need to hit the ground running",
    features: [
      {
        title: "Visual Project Management",
        description:
          "Track tasks across Kanban boards, table views, and dashboards. Drag and drop to update status, filter by priority, and see progress at a glance.",
        image: "/visual.png",
      },
      {
        title: "Real-Time Collaboration",
        description:
          "Comment on tasks, get instant notifications when things change, attach files, and document your work with a rich text editor — all in real-time.",
        image: "/realtime.png",
      },
      {
        title: "Workspace & Access Control",
        description:
          "Invite your team, assign roles, and control who sees what — from workspace-level permissions down to individual projects.",
        image: "/workcpace-access.png",
      },
    ],
  };

  return (
    <section id="features" className="w-full py-24 md:py-32 bg-background overflow-hidden relative">
      <motion.div
        className="mx-auto max-w-7xl px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <SectionHeader badge="Features" title={featureData.title} />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full items-stretch">
          {featureData.features.map((feature, index) => (
            <motion.div variants={itemVariants} key={index} className="group h-full">
              <Card className="h-full py-0 flex flex-col border-foreground/30 overflow-hidden bg-background hover:border-border transition-colors duration-300 rounded-none shadow-none">
                <div className="h-64 sm:h-72 w-full bg-muted/10 relative p-4 sm:p-5 border-b border-border/50 overflow-hidden">
                  {/* Subtle grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                  {/* Screenshot */}
                  <div className="relative z-10 w-full h-full rounded-lg border border-border/50 overflow-hidden shadow-sm bg-background opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-medium tracking-tight text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
