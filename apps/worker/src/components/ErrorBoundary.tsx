import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[GigAI ErrorBoundary${this.props.label ? `: ${this.props.label}` : ""}]`, error, info);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#020810] px-6">
          <div className="glass-card max-w-md space-y-4 p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-[#00F5D4]" />
            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              GigAI Bharat hit an unexpected error. Your session is safe — reload to continue.
            </p>
            <Button
              className="w-full bg-[#00F5D4] text-[#020810] hover:bg-[#00F5D4]/90"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload app
            </Button>
            <Button variant="ghost" className="w-full" onClick={this.reset}>
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
