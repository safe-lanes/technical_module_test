import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { TechnicalModule } from "./pages/TechnicalModule";
import WorkOrders from "./pages/pms/WorkOrders";
import Components from "./pages/pms/Components";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={TechnicalModule} />
          <Route path="/technical" component={TechnicalModule} />
          <Route path="/technical/pms/work-orders" component={WorkOrders} />
          <Route path="/technical/pms/components" component={Components} />
          <Route path="/pms/work-orders" component={WorkOrders} />
          <Route path="/pms/components" component={Components} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;