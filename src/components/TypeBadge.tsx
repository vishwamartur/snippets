import React from "react"
import { cn } from "@/lib/utils"

type BadgeType = "BOARD" | "PACKAGE" | "FOOTPRINT" | "MODEL"

interface TypeBadgeProps {
  type: BadgeType
  className?: string
}

const typeColors: Record<BadgeType, string> = {
  BOARD: "bg-blue-500",
  PACKAGE: "bg-green-500",
  FOOTPRINT: "bg-purple-500",
  MODEL: "bg-indigo-500",
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className }) => {
  return (
    <span
      className={cn(
        "text-white px-2 py-1 rounded text-xs font-semibold",
        typeColors[type],
        className,
      )}
    >
      {type}
    </span>
  )
}
