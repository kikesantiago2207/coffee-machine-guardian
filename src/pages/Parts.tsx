import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  part_number: z.string().min(1, "Part number is required"),
  description: z.string().optional(),
  current_stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  reorder_point: z.coerce.number().min(0, "Reorder point must be 0 or greater"),
  unit_cost: z.coerce.number().min(0, "Cost must be 0 or greater"),
  location: z.string().optional(),
});

interface Part {
  id: string;
  name: string;
  part_number: string;
  description: string;
  current_stock: number;
  reorder_point: number;
  unit_cost: number;
  location: string;
}

const Parts = () => {
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [machineId, setMachineId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      part_number: "",
      description: "",
      current_stock: 0,
      reorder_point: 5,
      unit_cost: 0,
      location: "",
    },
  });

  useEffect(() => {
    fetchMachineAndParts();
  }, []);

  const fetchMachineAndParts = async () => {
    try {
      const { data: machineData, error: machineError } = await supabase
        .from("machines")
        .select("id")
        .single();

      if (machineError) throw machineError;
      setMachineId(machineData.id);

      await fetchParts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase.from("parts").select("*").order("name");

      if (error) throw error;
      setParts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching parts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isLowStock = (part: Part) => part.current_stock <= part.reorder_point;

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
      const { error } = await supabase.from("parts").insert([{
        name: values.name,
        part_number: values.part_number,
        description: values.description || null,
        current_stock: values.current_stock,
        reorder_point: values.reorder_point,
        unit_cost: values.unit_cost,
        location: values.location || null,
        machine_id: machineId,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Part added successfully",
      });

      form.reset();
      setOpen(false);
      fetchParts();
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
          <h1 className="text-3xl font-bold text-foreground">Parts Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage spare parts and inventory levels</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Package className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Part</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="part_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="current_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reorder_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Point</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Part</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {parts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No parts in inventory. Add parts to track stock levels.
              </p>
            </CardContent>
          </Card>
        ) : (
          parts.map((part) => (
            <Card key={part.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {part.name}
                      {isLowStock(part) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Part #: {part.part_number}
                    </p>
                  </div>
                  <Badge variant="outline">${part.unit_cost.toFixed(2)}/unit</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                    <p className="text-2xl font-bold text-foreground">{part.current_stock}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reorder Point</p>
                    <p className="text-2xl font-bold text-foreground">{part.reorder_point}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-lg text-foreground">{part.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Value</p>
                    <p className="text-lg text-foreground">
                      ${(part.current_stock * part.unit_cost).toFixed(2)}
                    </p>
                  </div>
                </div>
                {part.description && (
                  <p className="text-sm text-muted-foreground mt-4">{part.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Parts;