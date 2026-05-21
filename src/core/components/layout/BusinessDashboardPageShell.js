// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'

/**
 * Top padding wrapper for Business Dashboard pages.
 * Background gradient is painted once on {@link DashboardLayout}'s &lt;main&gt; rerunning
 * the same gradient here caused a visible horizontal seam when this wrapper was shorter than
 * the viewport (nested gradients use different reference boxes).
 * Pass className="min-h-full" on pages that should fill the viewport (e.g. dashboard home, list pages).
 */
const BusinessDashboardPageShell = ({ children, className = '' }) => {
  return <div className={`pt-2 ${className}`.trim()}>{children}</div>
}

export default React.memo(BusinessDashboardPageShell)
