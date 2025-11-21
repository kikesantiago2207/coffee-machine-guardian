import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertTriangle } from "lucide-react";

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

  useEffect(() => {
    fetchParts();
  }, []);

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
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Add Part
        </Button>
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