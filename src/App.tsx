import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Machine from "./pages/Machine";
import Parts from "./pages/Parts";
import Maintenance from "./pages/Maintenance";
import NewMaintenance from "./pages/NewMaintenance";
import Schedule from "./pages/Schedule";
import Vendors from "./pages/Vendors";
import Alerts from "./pages/Alerts";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/machine" element={<Layout><Machine /></Layout>} />
          <Route path="/parts" element={<Layout><Parts /></Layout>} />
          <Route path="/maintenance" element={<Layout><Maintenance /></Layout>} />
          <Route path="/maintenance/new" element={<Layout><NewMaintenance /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
          <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
          <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
