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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
        <p className="text-muted-foreground mt-1">System alerts and action items</p>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Active Alerts</h2>
          {activeAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <CardTitle>{alert.title}</CardTitle>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{alert.message}</p>
                <Badge variant="outline" className="mt-2">
                  {alert.type.replace("_", " ").toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeAlerts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-4" />
            <p className="text-foreground font-medium">No active alerts</p>
            <p className="text-muted-foreground text-sm">All systems are running normally</p>
          </CardContent>
        </Card>
      )}

      {resolvedAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Resolved Alerts</h2>
          {resolvedAlerts.map((alert) => (
            <Card key={alert.id} className="opacity-60">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <CardTitle>{alert.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Resolved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;