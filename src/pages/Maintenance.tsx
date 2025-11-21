import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaintenanceRecord {
  id: string;
  type: string;
  failure_type: string;
  date: string;
  duration_minutes: number;
  technician: string;
  description: string;
  status: string;
  cost: number;
}

const Maintenance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching maintenance records",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      preventive: "bg-primary",
      corrective: "bg-destructive",
      predictive: "bg-accent",
      inspection: "bg-secondary",
    };
    return colors[type] || "bg-muted";
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance History</h1>
          <p className="text-muted-foreground mt-1">All maintenance events and repairs</p>
        </div>
        <Button onClick={() => navigate("/maintenance/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Maintenance
        </Button>
      </div>

      <div className="grid gap-4">
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No maintenance records found. Start by recording your first maintenance event.
              </p>
              <Button onClick={() => navigate("/maintenance/new")}>
                <Plus className="w-4 h-4 mr-2" />
                New Maintenance
              </Button>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {record.description}
                      <Badge className={getTypeColor(record.type)}>
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">${record.cost?.toFixed(2) || "0.00"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Technician</p>
                    <p className="text-foreground">{record.technician}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <p className="text-foreground">{record.duration_minutes || 0} min</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="secondary">
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                  {record.failure_type && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Failure Type</p>
                      <p className="text-foreground">{record.failure_type}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Maintenance;