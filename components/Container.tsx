import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative mx-auto w-full mt-24 rounded-sm bg-background from-green-950 via-emerald-900 to-green-950", className)}>
      {children}
    </div>
  );
};
