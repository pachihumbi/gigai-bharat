import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n/context";
import { RequireAuth } from "./components/RequireAuth";
import { RouteLoader } from "./components/RouteLoader";
import Splash from "./pages/Splash.tsx";
import Auth from "./pages/Auth.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import OAuthInitiate from "./pages/OAuthInitiate.tsx";
import NotFound from "./pages/NotFound.tsx";
import { DriverAppEntry } from "./components/DriverAppEntry";
import { DemoWorkspaceEntry } from "./components/DemoWorkspaceEntry";
import {
  PwaProvider,
} from "@/components/pwa";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProductionAnalytics } from "@/components/ProductionAnalytics";

const PwaShell = lazy(() =>
  import("@/components/pwa/PwaShell").then((m) => ({ default: m.PwaShell })),
);

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Dispatch = lazy(() => import("./pages/Dispatch.tsx"));
const Credit = lazy(() => import("./pages/Credit.tsx"));
const Gurukul = lazy(() => import("./pages/Gurukul.tsx"));
const EvCommand = lazy(() => import("./pages/EvCommand.tsx"));
const CoLivingHub = lazy(() => import("./pages/CoLivingHub.tsx"));
const DignityHub = lazy(() => import("./pages/DignityHub.tsx"));
const SecurityMobility = lazy(() => import("./pages/SecurityMobility.tsx"));
const GigPay = lazy(() => import("./pages/GigPay.tsx"));
const Welfare = lazy(() => import("./pages/Welfare.tsx"));
const OCR = lazy(() => import("./pages/OCR.tsx"));
const Ledger = lazy(() => import("./pages/Ledger.tsx"));
const Pitch = lazy(() => import("./pages/Pitch.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const SmartHub = lazy(() => import("./pages/SmartHub.tsx"));
const MapPage = lazy(() => import("./pages/MapPage.tsx"));
const Offline = lazy(() => import("./pages/Offline.tsx"));
const Community = lazy(() => import("./pages/Community.tsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.tsx"));
const Insurance = lazy(() => import("./pages/Insurance.tsx"));
const FleetHub = lazy(() => import("./pages/FleetHub.tsx"));

const queryClient = new QueryClient();

const withAuth = (element: React.ReactNode) => (
  <RequireAuth>
    <Suspense fallback={<RouteLoader />}>{element}</Suspense>
  </RequireAuth>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <PwaProvider>
            <ErrorBoundary fallback={null} label="pwa-shell">
              <Suspense fallback={null}>
                <PwaShell />
              </Suspense>
            </ErrorBoundary>
            <BrowserRouter>
            <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/welcome" element={<Splash />} />
            <Route path="/driver-app" element={<DriverAppEntry />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/demo" element={<DemoWorkspaceEntry />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/oauth/callback" element={<AuthCallback />} />
            <Route path="/oauth/initiate" element={<OAuthInitiate />} />
            <Route path="/~oauth/initiate" element={<OAuthInitiate />} />
            <Route path="/onboarding" element={withAuth(<Onboarding />)} />
            <Route path="/dashboard" element={withAuth(<Dashboard />)} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/gurukul" element={withAuth(<Gurukul />)} />
            <Route path="/dispatch" element={withAuth(<Dispatch />)} />
            <Route path="/ev-command" element={withAuth(<EvCommand />)} />
            <Route path="/co-living" element={withAuth(<CoLivingHub />)} />
            <Route path="/dignity" element={withAuth(<DignityHub />)} />
            <Route path="/smart-hub" element={<Navigate to="/co-living" replace />} />
            <Route path="/security" element={withAuth(<SecurityMobility />)} />
            <Route path="/credit" element={withAuth(<Credit />)} />
            <Route path="/ledger" element={withAuth(<Ledger />)} />
            <Route path="/hub" element={withAuth(<SmartHub />)} />
            <Route path="/heatmap" element={<Navigate to="/dispatch" replace />} />
            <Route path="/map" element={withAuth(<MapPage />)} />
            <Route path="/gigpay" element={withAuth(<GigPay />)} />
            <Route path="/welfare" element={withAuth(<Welfare />)} />
            <Route path="/shramsetu" element={withAuth(<Welfare />)} />
            <Route path="/ocr" element={withAuth(<OCR />)} />
            <Route path="/pitch" element={withAuth(<Pitch />)} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/community" element={withAuth(<Community />)} />
            <Route path="/leaderboard" element={withAuth(<Leaderboard />)} />
            <Route path="/insurance" element={withAuth(<Insurance />)} />
            <Route path="/fleet" element={withAuth(<FleetHub />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
            <Toaster />
            <Sonner />
            <ProductionAnalytics />
          </BrowserRouter>
          </PwaProvider>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
