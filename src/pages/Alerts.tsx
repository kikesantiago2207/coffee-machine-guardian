import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

const Alerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts((data as Alert[]) || []);
    } catch (error: any) {
      toast({
        title: "Error fetching alerts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved",
      });

      fetchAlerts();
    } catch (error: any) {
      toast({
        title: "Error resolving alert",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      info: "bg-primary",
      warning: "bg-warning",
      critical: "bg-destructive",
    };
    return colors[severity] || "bg-muted";
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Alerts & Notifications</h1>
        <p className="text-base text-muted-foreground">Monitor system alerts and respond to critical action items</p>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-primary rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">Active Alerts</h2>
            <Badge variant="destructive" className="ml-auto text-base px-3 py-1">
              {activeAlerts.length} Active
            </Badge>
          </div>
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className="bg-gradient-card shadow-lg border-2 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <AlertCircle className="w-6 h-6 text-destructive animate-pulse" />
                      <CardTitle className="text-xl font-bold">{alert.title}</CardTitle>
                      <Badge className={`${getSeverityColor(alert.severity)} text-sm font-bold px-3 py-1`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {alert.type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created: <span className="font-bold text-foreground">{new Date(alert.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                  <Button size="lg" onClick={() => resolveAlert(alert.id)} className="shadow-md hover:shadow-lg transition-shadow">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Resolve
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-base leading-relaxed"><span className="font-bold">Issue:</span> {alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeAlerts.length === 0 && (
        <Card className="bg-gradient-card shadow-lg border-2">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-6 drop-shadow-lg" />
            <p className="text-xl font-bold text-foreground mb-2">No Active Alerts</p>
            <p className="text-base text-muted-foreground">All systems are running normally — no action required</p>
          </CardContent>
        </Card>
      )}

      {resolvedAlerts.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-success rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">Resolved Alerts</h2>
            <Badge variant="secondary" className="ml-auto text-base px-3 py-1">
              {resolvedAlerts.length} Resolved
            </Badge>
          </div>
          {resolvedAlerts.map((alert) => (
            <Card key={alert.id} className="opacity-70 hover:opacity-85 transition-opacity shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                      <CardTitle className="text-xl font-bold line-through decoration-muted-foreground">{alert.title}</CardTitle>
                      <Badge variant="secondary" className="text-sm font-bold px-3 py-1">Resolved</Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created: <span className="font-bold">{new Date(alert.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-base text-muted-foreground">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;