import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n/context";
import Splash from "./pages/Splash.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Heatmap from "./pages/Heatmap.tsx";
import GigPay from "./pages/GigPay.tsx";
import Welfare from "./pages/Welfare.tsx";
import OCR from "./pages/OCR.tsx";
import Ledger from "./pages/Ledger.tsx";
import Pitch from "./pages/Pitch.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import SmartHub from "./pages/SmartHub.tsx";
import MapPage from "./pages/MapPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import { RequireAuth } from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/ledger" element={<RequireAuth><Ledger /></RequireAuth>} />
            <Route path="/hub" element={<RequireAuth><SmartHub /></RequireAuth>} />
            <Route path="/heatmap" element={<RequireAuth><Heatmap /></RequireAuth>} />
            <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
            <Route path="/gigpay" element={<RequireAuth><GigPay /></RequireAuth>} />
            <Route path="/welfare" element={<RequireAuth><Welfare /></RequireAuth>} />
            <Route path="/ocr" element={<RequireAuth><OCR /></RequireAuth>} />
            <Route path="/pitch" element={<RequireAuth><Pitch /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
