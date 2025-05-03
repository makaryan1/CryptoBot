import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import BotsPage from "@/pages/bots-page";
import WalletPage from "@/pages/wallet-page";
import KycPage from "@/pages/kyc-page";
import TransactionsPage from "@/pages/transactions-page";
import ReferralsPage from "@/pages/referrals-page";
import ProfilePage from "@/pages/profile-page";
import SupportPage from "@/pages/support-page";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import BotManagement from "@/pages/admin/bot-management";
import UserManagement from "@/pages/admin/user-management";
import KycManagement from "@/pages/admin/kyc-management";
import CommissionSettings from "@/pages/admin/commission-settings";
import { ProtectedRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/admin-route";
import { AuthProvider } from "@/hooks/use-auth";
import { NotificationModalProvider } from "@/components/common/notification-modal";

const BotDetailsPage = lazy(() => import("@/pages/bot-details-page"));

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/bots" component={BotsPage} />
      <ProtectedRoute path="/bots/:id" component={() => (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <BotDetailsPage />
        </Suspense>
      )} />
      <ProtectedRoute path="/wallet" component={WalletPage} />
      <ProtectedRoute path="/kyc" component={KycPage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/referrals" component={ReferralsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      
      {/* Admin Routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/bots" component={BotManagement} />
      <AdminRoute path="/admin/users" component={UserManagement} />
      <AdminRoute path="/admin/kyc" component={KycManagement} />
      <AdminRoute path="/admin/commissions" component={CommissionSettings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationModalProvider>
            <Toaster />
            <Router />
          </NotificationModalProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
