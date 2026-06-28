import { Link } from 'react-router-dom'

export function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="state" role="status">
      <div className="state-icon" aria-hidden="true">{icon}</div>
      <h2 className="state-title">{title}</h2>
      {description && <p className="state-desc">{description}</p>}
      {actionLabel && (actionTo || onAction) && (
        <div className="state-actions">
          {actionTo ? (
            <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
          ) : (
            <button onClick={onAction} className="btn btn-primary">{actionLabel}</button>
          )}
        </div>
      )}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state" role="alert">
      <div className="state-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="state-title">We hit a snag</h2>
      <p className="state-desc">{message || "We couldn't load this content. Please try again."}</p>
      {onRetry && (
        <div className="state-actions">
          <button onClick={onRetry} className="btn btn-primary">Try again</button>
        </div>
      )}
    </div>
  )
}