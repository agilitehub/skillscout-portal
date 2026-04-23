// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { NavLink } from 'react-router-dom'
import { AUTHENTICATED_HEADER_NAV_ITEMS } from '../../../config/navigation'

/**
 * Generic Navigation component that can be used for both mobile and desktop
 * Accepts custom classNames, link styles, and click handlers
 */
const Navigation = ({ containerClassName = '', navLinkClassName, getNavLinkStyle, onLinkClick = () => {} }) => {
  const items = AUTHENTICATED_HEADER_NAV_ITEMS

  return (
    <div className={containerClassName}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={navLinkClassName}
          style={getNavLinkStyle && getNavLinkStyle}
          onClick={() => onLinkClick(item)}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default Navigation
