import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useSafeMotion } from "@/hooks/use-safe-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function CinematicSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const skipMotion = useSafeMotion();

  if (skipMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const skipMotion = useSafeMotion();

  if (skipMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const skipMotion = useSafeMotion();

  if (skipMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
