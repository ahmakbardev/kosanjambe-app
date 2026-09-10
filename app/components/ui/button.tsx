import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline";
type Size = "md" | "sm";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

/**
 * Satu-satunya tempat ukuran tombol ditentukan. Ini layar HP, jadi ukurannya
 * ditahan kecil — tapi tingginya nggak boleh turun di bawah 44px, target
 * sentuh minimum buat jempol.
 */
const UKURAN: Record<Size, string> = {
  md: "h-11 gap-2 px-4 text-sm",
  sm: "h-9 gap-1.5 px-3 text-[13px]",
};

const VARIAN: Record<Variant, string> = {
  primary:
    "bg-accent text-ink hover:bg-accent-hover disabled:bg-neutral-100 disabled:text-neutral-400",
  outline:
    "border border-neutral-200 bg-white text-ink hover:bg-neutral-50 disabled:text-neutral-300",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors disabled:cursor-not-allowed",
        UKURAN[size],
        VARIAN[variant],
        className,
      )}
      {...props}
    />
  );
}
