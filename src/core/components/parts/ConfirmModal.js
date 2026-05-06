// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { BRAND_COLORS, DARK_THEME } from '../../theme/colors'
import { useTheme } from '../../context/ThemeContext'
import ThemedModal from './ThemedModal'

/**
 * Confirm-style modal with themed chrome and default OK/Cancel styling for light/dark.
 */
const ConfirmModal = ({ okButtonProps, cancelButtonProps, okText = 'OK', cancelText = 'Cancel', children, ...modalProps }) => {
  const { darkMode } = useTheme()

  const themedOk = {
    style: {
      backgroundColor: darkMode ? BRAND_COLORS.emeraldAccent : BRAND_COLORS.seaGreen,
      borderColor: darkMode ? BRAND_COLORS.emeraldAccent : BRAND_COLORS.seaGreen,
      color: BRAND_COLORS.white,
      ...(okButtonProps?.style || {})
    },
    ...okButtonProps
  }

  const themedCancel = {
    style: {
      backgroundColor: darkMode ? DARK_THEME.background.tertiary : BRAND_COLORS.white,
      borderColor: darkMode ? DARK_THEME.border.tertiary : BRAND_COLORS.borderGray,
      color: darkMode ? BRAND_COLORS.white : BRAND_COLORS.darkGray,
      ...(cancelButtonProps?.style || {})
    },
    ...cancelButtonProps
  }

  return (
    <ThemedModal
      okText={okText}
      cancelText={cancelText}
      okButtonProps={themedOk}
      cancelButtonProps={themedCancel}
      {...modalProps}
    >
      {children}
    </ThemedModal>
  )
}

export default React.memo(ConfirmModal)
