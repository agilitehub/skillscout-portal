// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import React, { useState, useCallback } from 'react'
import { Form, Input, Button, message, Alert } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../ui/ThemeContext'

/**
 * Magic Link Login Component
 * Provides passwordless email authentication using Supabase Magic Links
 * Implements comprehensive error handling and user feedback
 * Follows accessibility best practices with proper ARIA labels
 */
const MagicLinkLogin = React.memo(({ onLogin, loading }) => {
  const [form] = Form.useForm()
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const { darkMode } = useTheme()

  // Color palette - Skill Scout blue-to-green balance
  const colors = {
    darkBlue: '#1E3A52',
    shakespeare: '#4A90A4',
    pictonBlue: '#5BA3D4',
    toreaBay: '#2E5984',
    seaGreen: '#16A085',
    emeraldPrimary: '#059669',
    emeraldBright: '#34D399',
    tealGreen: '#14B8A6',
    mintGreen: '#00D8A3',
    forestGreen: '#065F46'
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      try {
        if (!values.email || typeof values.email !== 'string') {
          setError('Please enter a valid email address')
          return
        }

        setError(null)
        setEmail(values.email)

        // Call the login function from parent component
        const result = await onLogin(values.email)

        if (result.success) {
          setEmailSent(true)
          message.success(result.message || 'Magic link sent successfully!')
        } else {
          setError(result.error || 'Failed to send magic link')
          message.error(result.error || 'Failed to send magic link')
        }
      } catch (error) {
        console.error('MagicLinkLogin: Error submitting form:', error)
        const errorMessage = 'An unexpected error occurred'
        setError(errorMessage)
        message.error(errorMessage)
      }
    },
    [onLogin]
  )

  // Handle resend magic link
  const handleResend = useCallback(async () => {
    try {
      if (!email) {
        setError('No email address available for resend')
        return
      }

      setError(null)
      const result = await onLogin(email)

      if (result.success) {
        message.success('Magic link resent successfully!')
      } else {
        setError(result.error || 'Failed to resend magic link')
        message.error(result.error || 'Failed to resend magic link')
      }
    } catch (error) {
      console.error('MagicLinkLogin: Error resending magic link:', error)
      const errorMessage = 'An unexpected error occurred while resending'
      setError(errorMessage)
      message.error(errorMessage)
    }
  }, [email, onLogin])

  // Reset form state
  const handleReset = useCallback(() => {
    setEmailSent(false)
    setError(null)
    setEmail('')
    form.resetFields()
  }, [form])

  // Email validation rules
  const emailRules = [
    {
      required: true,
      message: 'Please enter your email address'
    },
    {
      type: 'email',
      message: 'Please enter a valid email address'
    }
  ]

  if (emailSent) {
    return (
      <div className='w-full max-w-md mx-auto mt-6 mb-4 z-20 relative'>
        <div
          className={`p-6 rounded-lg border ${
            darkMode ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white shadow-lg border-gray-200'
          }`}
        >
          <div className='text-center'>
            <FontAwesomeIcon icon={faCheckCircle} className='text-4xl mb-4' style={{ color: colors.emeraldPrimary }} />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Check Your Email
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className={`text-xs mb-6 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
              Click the link in your email to sign in. The link will expire in 1 hour.
            </p>

            <div className='space-y-3'>
              <Button
                type='primary'
                onClick={handleResend}
                disabled={loading}
                className='w-full'
                style={{
                  background: `linear-gradient(135deg, ${colors.pictonBlue}, ${colors.seaGreen})`,
                  border: 'none'
                }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
                    Resending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
                    Resend Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleReset}
                className='w-full'
                style={{
                  border: darkMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid #d9d9d9',
                  color: darkMode ? 'white' : 'inherit',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'white'
                }}
              >
                Use Different Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-md mx-auto mt-6 mb-4 z-20 relative'>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout='vertical'
        className={`p-6 rounded-lg border ${
          darkMode ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white shadow-lg border-gray-200'
        }`}
      >
        <div className='text-center mb-6'>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Sign In with Email
          </h3>
          <p className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
            Enter your email address and we'll send you a secure link to sign in
          </p>
        </div>

        {error && (
          <Alert message={error} type='error' showIcon className='mb-4' closable onClose={() => setError(null)} />
        )}

        <Form.Item
          name='email'
          label={<span className={darkMode ? 'text-white/90' : 'text-gray-700'}>Email Address</span>}
          rules={emailRules}
          className='mb-6'
        >
          <Input
            size='large'
            placeholder='Enter your email address'
            prefix={<FontAwesomeIcon icon={faEnvelope} className='text-gray-400' />}
            className={darkMode ? 'bg-white/20 border-white/30 text-white placeholder-white/50' : ''}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item className='mb-0'>
          <Button
            type='primary'
            htmlType='submit'
            size='large'
            loading={loading}
            block
            className='h-12 font-medium text-white transition-all duration-300 hover:shadow-lg border-0 hover:scale-105 transform'
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.shakespeare} 35%, ${colors.emeraldPrimary} 70%, ${colors.forestGreen} 100%)`
                : `linear-gradient(135deg, ${colors.pictonBlue} 0%, ${colors.shakespeare} 25%, ${colors.seaGreen} 60%, ${colors.emeraldPrimary} 100%)`,
              boxShadow: darkMode
                ? `0 6px 20px 0 ${colors.shakespeare}40, 0 2px 6px 0 ${colors.emeraldPrimary}30`
                : `0 6px 20px 0 ${colors.pictonBlue}40, 0 2px 6px 0 ${colors.seaGreen}20`
            }}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
                Sending Email...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
                Send Email
              </>
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
})

MagicLinkLogin.displayName = 'MagicLinkLogin'

export default MagicLinkLogin
