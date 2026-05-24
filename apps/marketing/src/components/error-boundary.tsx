import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("[GigAI Marketing ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[60vh] items-center justify-center bg-black px-5 text-white">
          <div className="max-w-md text-center">
            <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--saffron)]">
              Runtime fault
            </p>
            <h1 className="mt-6 font-serif text-4xl italic">This view didn&apos;t load</h1>
            <p className="mt-4 text-sm text-muted-foreground">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 border-b border-[color:var(--neon)] pb-1 font-mono text-label uppercase tracking-[0.2em] text-[color:var(--neon)]"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
