import { type ReactNode } from "react";
import { cx } from "../../lib/utils/cx";

interface ContainerProperties {
  children: ReactNode;
  className?: string;
  /** Size variant: sm, md, lg, xl */
  size?: "sm" | "md" | "lg" | "xl";
}

export const Container = ({
  children,
  className,
  size = "lg",
}: ContainerProperties) => {
  const sizes = {
    sm: "max-w-xs", // 320px
    md: "max-w-sm", // 343px (orqali rekomendatsiya)
    lg: "max-w-md", // 448px
    xl: "max-w-lg", // 512px
  };

  return (
    <div className={cx("w-full p-4 mx-auto", sizes[size], className)}>
      {children}
    </div>
  );
};
