import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const ShimmerButton = ({
  children,
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ skewX: -12, x: "-150%" }}
        animate={{ skewX: -12, x: "150%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex h-full w-full justify-center"
      >
        <div className="relative h-full w-12 bg-white/30 blur-[2px]" />
      </motion.div>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
