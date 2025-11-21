import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "operational" | "warning" | "down" | "maintenance";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    operational: {
      label: "Operational",
      className: "bg-status-operational text-success-foreground",
    },
    warning: {
      label: "Warning",
      className: "bg-status-warning text-warning-foreground",
    },
    down: {
      label: "Down",
      className: "bg-status-down text-destructive-foreground",
    },
    maintenance: {
      label: "Maintenance",
      className: "bg-status-maintenance text-accent-foreground",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)} variant="secondary">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;