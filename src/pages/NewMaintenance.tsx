import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const NewMaintenance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Get the machine ID
      const { data: machine } = await supabase.from("machines").select("id").single();
      
      if (!machine) throw new Error("Machine not found");

      const maintenanceData = {
        machine_id: machine.id,
        type: formData.get("type") as string,
        failure_type: formData.get("failure_type") as string || null,
        date: new Date().toISOString(),
        start_time: formData.get("start_time") ? new Date(formData.get("start_time") as string).toISOString() : null,
        end_time: formData.get("end_time") ? new Date(formData.get("end_time") as string).toISOString() : null,
        duration_minutes: parseInt(formData.get("duration_minutes") as string) || 0,
        technician: formData.get("technician") as string,
        description: formData.get("description") as string,
        actions_taken: formData.get("actions_taken") as string || null,
        status: "completed",
        cost: parseFloat(formData.get("cost") as string) || 0,
        notes: formData.get("notes") as string || null,
      };

      const { error } = await supabase.from("maintenance_records").insert([maintenanceData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Maintenance record created successfully",
      });

      navigate("/maintenance");
    } catch (error: any) {
      toast({
        title: "Error creating maintenance record",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/maintenance")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Maintenance</h1>
          <p className="text-muted-foreground mt-1">Record a new maintenance event or failure</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Maintenance Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="corrective">Corrective (Failure)</SelectItem>
                    <SelectItem value="predictive">Predictive</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician">Technician Name *</Label>
                <Input id="technician" name="technician" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="failure_type">Failure Type (if applicable)</Label>
                <Input id="failure_type" name="failure_type" placeholder="e.g., Mechanical, Electrical" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
                <Input id="duration_minutes" name="duration_minutes" type="number" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input id="start_time" name="start_time" type="datetime-local" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input id="end_time" name="end_time" type="datetime-local" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input id="cost" name="cost" type="number" step="0.01" min="0" defaultValue="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the maintenance work or failure"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actions_taken">Actions Taken</Label>
              <Textarea
                id="actions_taken"
                name="actions_taken"
                placeholder="Describe the actions performed"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Any additional information" rows={2} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Maintenance Record"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/maintenance")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMaintenance;