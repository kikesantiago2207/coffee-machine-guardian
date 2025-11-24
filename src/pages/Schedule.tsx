import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  frequency_days: z.coerce.number().min(1, "Frequency must be at least 1 day"),
  next_due: z.string().min(1, "Next due date is required"),
  assigned_to: z.string().optional(),
  estimated_duration_minutes: z.coerce.number().min(0).optional(),
});

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
  const [open, setOpen] = useState(false);
  const [machineId, setMachineId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_name: "",
      description: "",
      frequency_days: 30,
      next_due: "",
      assigned_to: "",
      estimated_duration_minutes: 60,
    },
  });

  useEffect(() => {
    fetchMachineAndSchedules();
  }, []);

  const fetchMachineAndSchedules = async () => {
    try {
      const { data: machineData, error: machineError } = await supabase
        .from("machines")
        .select("id")
        .single();

      if (machineError) throw machineError;
      setMachineId(machineData.id);

      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!machineId) {
      toast({
        title: "Error",
        description: "Machine not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("preventive_schedules").insert([{
        task_name: values.task_name,
        description: values.description || null,
        frequency_days: values.frequency_days,
        next_due: values.next_due,
        assigned_to: values.assigned_to || null,
        estimated_duration_minutes: values.estimated_duration_minutes || null,
        machine_id: machineId,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule added successfully",
      });

      form.reset();
      setOpen(false);
      fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Preventive Maintenance Schedule</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="task_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="next_due"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assigned_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimated_duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Est. Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Schedule</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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