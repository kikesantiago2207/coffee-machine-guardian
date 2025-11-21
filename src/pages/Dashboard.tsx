import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [kpis, setKpis] = useState({
    mtbf: "0h",
    mttr: "0h",
    availability: "0%",
    totalCost: "$0",
    activeAlerts: 0,
  });

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      // Fetch maintenance records
      const { data: maintenanceRecords, error: maintenanceError } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("status", "completed");

      if (maintenanceError) throw maintenanceError;

      // Fetch alerts
      const { data: alerts, error: alertsError } = await supabase
        .from("alerts")
        .select("*")
        .eq("resolved", false);

      if (alertsError) throw alertsError;

      // Calculate KPIs
      if (maintenanceRecords && maintenanceRecords.length > 0) {
        const failures = maintenanceRecords.filter((r) => r.type === "corrective");
        const totalDuration = maintenanceRecords.reduce(
          (sum, r) => sum + (r.duration_minutes || 0),
          0
        );
        const totalCost = maintenanceRecords.reduce((sum, r) => sum + Number(r.cost || 0), 0);

        // MTBF calculation (simplified)
        const mtbf = failures.length > 0 ? Math.round((30 * 24 * 60) / failures.length) : 0;
        
        // MTTR calculation
        const mttr = failures.length > 0 ? Math.round(totalDuration / failures.length) : 0;
        
        // Availability calculation (simplified: uptime / total time)
        const downtime = totalDuration;
        const totalTime = 30 * 24 * 60; // 30 days
        const availability = ((totalTime - downtime) / totalTime) * 100;

        setKpis({
          mtbf: `${Math.round(mtbf / 60)}h`,
          mttr: `${mttr}m`,
          availability: `${availability.toFixed(1)}%`,
          totalCost: `$${totalCost.toFixed(2)}`,
          activeAlerts: alerts?.length || 0,
        });
      } else {
        setKpis({
          ...kpis,
          activeAlerts: alerts?.length || 0,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching KPIs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of maintenance operations and key performance indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="MTBF"
          value={kpis.mtbf}
          icon={TrendingUp}
          description="Mean Time Between Failures"
        />
        <KPICard
          title="MTTR"
          value={kpis.mttr}
          icon={Clock}
          description="Mean Time To Repair"
        />
        <KPICard
          title="Availability"
          value={kpis.availability}
          icon={Activity}
          description="System uptime percentage"
        />
        <KPICard
          title="Total Cost"
          value={kpis.totalCost}
          icon={DollarSign}
          description="Maintenance costs (30 days)"
        />
        <KPICard
          title="Active Alerts"
          value={kpis.activeAlerts}
          icon={AlertTriangle}
          description="Requires attention"
        />
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The dashboard displays real-time KPIs based on maintenance data entered in the system.
              As you record maintenance events, failures, and parts usage, these metrics will
              automatically update to provide insights into machine performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2 text-sm">
              <p>• Record maintenance events to track MTBF and MTTR</p>
              <p>• Monitor parts inventory to prevent stockouts</p>
              <p>• Schedule preventive maintenance tasks</p>
              <p>• Review alerts for immediate action items</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;