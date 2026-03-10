import { FDA_DISCLAIMER } from "@/utils/constants";

export default function FDADisclaimer({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  return (
    <p
      className={`text-xs leading-relaxed text-center ${
        variant === "dark" ? "text-white/40" : "text-muted"
      }`}
    >
      {FDA_DISCLAIMER}
    </p>
  );
}
