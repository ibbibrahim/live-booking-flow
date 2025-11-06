import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RequestForm from "./pages/RequestForm";
import RequestDetail from "./pages/RequestDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import NOC from "./pages/NOC";
import Ingest from "./pages/Ingest";
import CallSheetDashboard from "./callsheet_workflow/CallSheetDashboard";
import CallSheetForm from "./callsheet_workflow/CallSheetForm";
import CallSheetDetail from "./callsheet_workflow/CallSheetDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/requests" element={<Dashboard />} />
        <Route path="/request/new" element={<RequestForm />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/noc" element={<NOC />} />
        <Route path="/ingest" element={<Ingest />} />
          <Route path="/callsheet" element={<CallSheetDashboard />} />
          <Route path="/callsheet/new" element={<CallSheetForm />} />
          <Route path="/callsheet/:id" element={<CallSheetDetail />} />
          <Route path="/callsheet/:id/edit" element={<CallSheetForm />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
