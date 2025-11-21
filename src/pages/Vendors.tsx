import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Mail, Phone } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  active: boolean;
}

const Vendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("name");

      if (error) throw error;
      setVendors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching vendors",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage suppliers and purchasing contacts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vendors.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-8 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No vendors found. Add suppliers for parts and services.
              </p>
            </CardContent>
          </Card>
        ) : (
          vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {vendor.name}
                  </CardTitle>
                  <Badge variant={vendor.active ? "default" : "secondary"}>
                    {vendor.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {vendor.contact_person && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="text-foreground">{vendor.contact_person}</p>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${vendor.email}`} className="text-sm text-primary hover:underline">
                      {vendor.email}
                    </a>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${vendor.phone}`} className="text-sm text-primary hover:underline">
                      {vendor.phone}
                    </a>
                  </div>
                )}
                {vendor.address && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-sm text-foreground">{vendor.address}</p>
                  </div>
                )}
                {vendor.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm text-foreground">{vendor.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Vendors;