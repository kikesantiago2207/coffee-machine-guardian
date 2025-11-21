import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus } from "lucide-react";

interface Schedule {
  id: string;
  task_name: string;
  description: string;
  frequency_days: number;
  last_performed: string;
  next_due: string;
  assigned_to: string;
  estimated_duration_minutes: number;
  active: boolean;
}

const Schedule = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("preventive_schedules")
        .select("*")
        .eq("active", true)
        .order("next_due");

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching schedules",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (date: string) => new Date(date) < new Date();
  const isDueSoon = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Schedule</h1>
          <p className="text-muted-foreground mt-1">Preventive maintenance calendar and tasks</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No scheduled maintenance tasks. Add preventive maintenance schedules.
              </p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {schedule.task_name}
                      {isOverdue(schedule.next_due) && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      {isDueSoon(schedule.next_due) && !isOverdue(schedule.next_due) && (
                        <Badge className="bg-warning">Due Soon</Badge>
                      )}
                    </CardTitle>
                    {schedule.description && (
                      <p className="text-sm text-muted-foreground">{schedule.description}</p>
                    )}
                  </div>
                  <Badge variant="outline">Every {schedule.frequency_days} days</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Due</p>
                    <p className="text-foreground font-medium">
                      {new Date(schedule.next_due).toLocaleDateString()}
                    </p>
                  </div>
                  {schedule.last_performed && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Performed</p>
                      <p className="text-foreground">
                        {new Date(schedule.last_performed).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {schedule.assigned_to && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                      <p className="text-foreground">{schedule.assigned_to}</p>
                    </div>
                  )}
                  {schedule.estimated_duration_minutes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Est. Duration</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <p className="text-foreground">{schedule.estimated_duration_minutes} min</p>
                      </div>
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

export default Schedule;