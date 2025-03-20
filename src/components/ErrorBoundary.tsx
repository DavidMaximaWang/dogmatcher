import React, { ReactNode } from "react";

type FallbackRenderer = (props: { error: Error | null }) => React.ReactElement;
// https://github.com/bvaughn/react-error-boundary
//simple error boundary, replacement for the above
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallbackRender: FallbackRenderer },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}