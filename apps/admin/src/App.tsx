import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAdmin } from "./components/RequireAdmin";
import { Layout } from "./components/Layout";
import { AuditPage } from "./pages/AuditPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { WorkersPage } from "./pages/WorkersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <Layout />
            </RequireAdmin>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/audit" element={<AuditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
