import React, { Component, ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", color: "#e11d48", backgroundColor: "#0f172a", fontFamily: "monospace", minHeight: "100vh" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>🚨 Runtime Error Detected</h1>
          <p style={{ color: "#94a3b8" }}>The application crashed during render. Below is the error detail:</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155", color: "#f1f5f9" }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: "pre-wrap", background: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155", color: "#94a3b8", fontSize: "12px", marginTop: "16px" }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

