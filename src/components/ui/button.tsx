import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display uppercase tracking-wider cursor-pointer active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-gold-ultra shadow-gold/20 gold-ripple border border-gold-base/30 hover:border-gold-base gold-glow-pulse",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-white/20 bg-transparent text-foreground hover:bg-gold-base/10 hover:border-gold-base/50 hover:shadow-[0_0_15px_rgba(212,163,89,0.2)] hover:text-gold-base",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-gold-base/10 hover:text-gold-base hover:shadow-[0_0_15px_rgba(212,163,89,0.15)] hover:border-gold-base/20 border border-transparent",
        link: "text-gold-base underline-offset-4 hover:underline",
        gold: "bg-gold-gradient text-void hover:shadow-gold-ultra shadow-gold/20 gold-ripple hover:scale-[1.02] shimmer",
        glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-foreground hover:bg-white/10 hover:border-gold-base/30",
        hero: "bg-transparent border border-gold-base/30 text-gold-light hover:bg-gold-base hover:text-void hover:border-gold-base",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-full px-8",
        xl: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      window.dispatchEvent(new CustomEvent("play-audio-click"));
      if (onClick) {
        onClick(e);
      }
    };

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} onClick={handleClick} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
