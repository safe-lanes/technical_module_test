import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { ChangeRequestProvider } from "@/contexts/ChangeRequestContext";
import { TechnicalModule } from "./pages/TechnicalModule";
import WorkOrders from "./pages/pms/WorkOrders";
import RunningHours from "./pages/pms/RunningHours";
import Spares from "./pages/spares/Spares";
import ModifyPMS from "./pages/modify-pms/ModifyPMS";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChangeRequestProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Switch>
              <Route path="/" component={TechnicalModule} />
              <Route path="/pms/work-orders" component={WorkOrders} />
              <Route path="/pms/running-hours" component={RunningHours} />
              <Route path="/spares" component={Spares} />
              <Route path="/modify-pms" component={ModifyPMS} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </ChangeRequestProvider>
    </QueryClientProvider>
  );
}

export default App;