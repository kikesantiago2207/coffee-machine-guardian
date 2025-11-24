import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const KPICard = ({ title, value, icon: Icon, description, trend, className }: KPICardProps) => {
  return (
    <Card className={cn("bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
        <Icon className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-foreground mb-1">{value}</div>
        {description && <p className="text-xs font-medium text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-3 pt-3 border-t border-border">
            <span
              className={cn(
                "text-sm font-bold",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs font-medium text-muted-foreground ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;