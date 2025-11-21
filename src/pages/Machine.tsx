import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Machine {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  installation_date: string;
  status: "operational" | "warning" | "down" | "maintenance";
  location: string;
  notes: string;
}

const Machine = () => {
  const { toast } = useToast();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachine();
  }, []);

  const fetchMachine = async () => {
    try {
      const { data, error } = await supabase
        .from("machines")
        .select("*")
        .single();

      if (error) throw error;
      setMachine(data as Machine);
    } catch (error: any) {
      toast({
        title: "Error fetching machine",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!machine) {
    return <div className="text-center py-8">No machine found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Machine Overview</h1>
        <p className="text-muted-foreground mt-1">Coffee roaster details and current status</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{machine.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{machine.model}</p>
            </div>
            <StatusBadge status={machine.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p className="text-lg font-mono text-foreground">{machine.serial_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Installation Date</p>
                <p className="text-lg text-foreground">
                  {new Date(machine.installation_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg text-foreground">{machine.location || "Not specified"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Status Details</p>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Status:</span>
                    <StatusBadge status={machine.status} />
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    Status is updated based on maintenance records and sensor readings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {machine.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="text-sm text-foreground">{machine.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p className="text-lg font-semibold text-foreground mt-1">{machine.model}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {Math.floor(
                  (Date.now() - new Date(machine.installation_date).getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                )}{" "}
                years
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-lg font-semibold text-foreground mt-1">{machine.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Machine;