import { Component } from 'react'

/**
 * ErrorBoundary — catches render-time errors and shows a friendly fallback.
 *
 * Important: "Try again" must give children a fresh state, otherwise the same
 * broken render will be retried. We bump a `resetKey` that the parent can
 * observe via `key`, but the simplest correct fix here is to wrap children in
 * an element whose `key` changes on reset, forcing React to unmount/remount.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, resetCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  componentDidUpdate(prevProps) {
    // Allow parent to programmatically reset by changing the `resetKey` prop.
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null, resetCount: this.state.resetCount + 1 })
    }
  }

  handleReset = () => {
    this.setState((s) => ({ error: null, resetCount: s.resetCount + 1 }))
    if (typeof this.props.onReset === 'function') this.props.onReset()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container-page">
          <div className="state" role="alert">
            <div className="state-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="state-title">Something went wrong</h2>
            <p className="state-desc">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="state-actions">
              <button className="btn btn-primary" onClick={this.handleReset}>Try again</button>
              <a className="btn btn-secondary" href="/">Go home</a>
            </div>
          </div>
        </div>
      )
    }
    // Re-key children so a reset truly re-mounts them.
    return <div key={this.state.resetCount}>{this.props.children}</div>
  }
}