declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};

// Global declarations to bypass missing type definitions and stabilize the build
declare module "clsx" {
  export type ClassValue = any;
  export function clsx(...inputs: ClassValue[]): string;
}

declare module "tailwind-merge" {
  export function twMerge(...inputs: any[]): string;
}

declare module "@barba/core";

declare module "next/server" {
  export type NextRequest = any;
  export type NextResponse = any;
  export const NextResponse: any;
  export const NextRequest: any;
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
  export type HTMLMotionProps<T> = any;
  export type AnimationProps = any;
  export type Variants = any;
  export function useScroll(options?: any): any;
  export function useTransform(value: any, from: any[], to: any[], options?: any): any;
  export function useSpring(value: any, options?: any): any;
}

declare module "lucide-react";
declare module "sonner";
