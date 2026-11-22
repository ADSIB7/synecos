import type { DragEvent, MouseEvent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const preserveNativeContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest(
        'input, textarea, select, [contenteditable="true"], [role="textbox"]'
      )
    ) {
      return;
    }

    event.preventDefault();
  };

  const preventImageDrag = (event: DragEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  };

  return (
    <div
      className="app-root"
      onContextMenu={preserveNativeContextMenu}
      onDragStart={preventImageDrag}
    >
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
