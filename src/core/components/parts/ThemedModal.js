// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React from 'react'
import { Modal } from 'antd'
import { useTheme } from '../../context/ThemeContext'
import {
  mergeModalStyles,
  getDefaultThemedModalStyles,
  defaultThemedMaskStyle
} from './themedModalStyles'

/**
 * Ant Design Modal with shared light/dark surface styles. Pass `styles` to shallow-merge per-section overrides.
 */
const ThemedModal = ({
  styles: stylesProp,
  className = '',
  maskStyle: maskStyleProp,
  maskBlur = false,
  children,
  ...modalProps
}) => {
  const { darkMode } = useTheme()
  const mergedStyles = mergeModalStyles(getDefaultThemedModalStyles(darkMode), stylesProp)
  const maskStyle = maskStyleProp ?? defaultThemedMaskStyle(darkMode, { blur: maskBlur })
  const modalClass = [darkMode ? 'ant-modal-dark' : '', className].filter(Boolean).join(' ')

  return (
    <Modal className={modalClass} styles={mergedStyles} maskStyle={maskStyle} {...modalProps}>
      {children}
    </Modal>
  )
}

export default React.memo(ThemedModal)
