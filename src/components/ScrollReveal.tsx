import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  className?: string;
  threshold?: number;
}

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  className,
  threshold,
}: ScrollRevealProps) => {
  const ref = useScrollReveal<HTMLDivElement>({ threshold });

  const dirClass = {
    up: "reveal-up",
    left: "reveal-left",
    right: "reveal-right",
    none: "",
  }[direction];

  return (
    <div
      ref={ref}
      className={cn("reveal", dirClass, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
