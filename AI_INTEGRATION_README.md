# AI Controller Integration Guide

This guide explains how to set up and use the OpenAI Threads integration (v2 API) in your React application.

## Overview

The AI controller provides a complete solution for integrating OpenAI Threads v2 API with your chat interface. It includes:

- **AIController Class**: Core functionality for managing threads and messages
- **useAIController Hook**: React hook for easy integration
- **useChat Hook**: Higher-level hook with chat-specific features
- **Configuration Management**: Centralized settings and validation
- **Error Handling**: Comprehensive error management
- **File Upload Support**: Document handling for career assessments

## Setup

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_ASSISTANT_ID=your_assistant_id_here

# Development Settings
REACT_APP_MOCK_AI=false
```

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env` file

### 3. Create OpenAI Assistant

1. Go to [OpenAI Assistants](https://platform.openai.com/assistants)
2. Click "Create" to create a new assistant
3. Configure your assistant with:
   - **Name**: "Skill Scout"
   - **Instructions**: Use the instructions from `ai-config.js`
   - **Model**: GPT-4 Turbo
   - **Tools**: Enable "Retrieval" for file processing
4. Copy the Assistant ID to your `.env` file

## Usage

### Basic Usage with useChat Hook

```jsx
import React from 'react'
import useChat from './hooks/useChat'

const ChatComponent = ({ user }) => {
  const { messages, isTyping, sendMessage, handleFileUpload, uploadedFiles, isChatReady } = useChat(user)

  const handleSend = (content) => {
    sendMessage(content)
  }

  return (
    <div>
      {/* Chat Messages */}
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.type}:</strong> {message.content}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <input
        type='text'
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend(e.target.value)
            e.target.value = ''
          }
        }}
        disabled={!isChatReady}
      />
    </div>
  )
}
```

### Advanced Usage with AIController

```jsx
import React from 'react'
import { useAIController } from './lib/ai-controller'

const AdvancedChatComponent = () => {
  const { messages, isLoading, error, sendMessage, initializeThread, clearMessages, controller } = useAIController(
    process.env.REACT_APP_OPENAI_API_KEY,
    process.env.REACT_APP_OPENAI_ASSISTANT_ID
  )

  // Manual thread management
  const handleNewConversation = async () => {
    await initializeThread()
  }

  // Resume existing conversation
  const handleResumeConversation = (threadId) => {
    controller.setThreadId(threadId)
  }

  return <div>{/* Your chat UI */}</div>
}
```

## Components

### ChatInput Component

Enhanced input component with file upload support:

```jsx
<ChatInput
  onSendMessage={handleSendMessage}
  onFileUpload={handleFileUpload}
  disabled={!isChatReady}
  isTyping={isTyping}
  maxLength={4000}
/>
```

### ChatMessages Component

Displays messages with proper styling and file attachments:

```jsx
<ChatMessages messages={messages} isTyping={isTyping} user={user} uploadedFiles={uploadedFiles} showFileInfo={true} />
```

## Features

### File Upload Support

The system supports various file types for career assessments:

- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Size Limit**: 10MB per file
- **Drag & Drop**: Full drag and drop support

### Message Types

- **user**: User messages
- **assistant**: AI responses
- **system**: System notifications (file uploads, etc.)

### Error Handling

Comprehensive error handling for common scenarios:

- Invalid API keys
- Rate limiting
- Network errors
- Timeout handling
- API version errors

### Development Mode

Enable mock responses for development:

```env
REACT_APP_MOCK_AI=true
```

This provides realistic responses without using the OpenAI API.

## Configuration

### AI Configuration (`src/lib/ai-config.js`)

```javascript
const config = {
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    timeout: 60000,
    maxRetries: 3,
    apiVersion: 'v2' // Updated to v2
  },
  assistant: {
    id: process.env.REACT_APP_OPENAI_ASSISTANT_ID,
    name: 'Skill Scout',
    instructions: '...',
    model: 'gpt-4-turbo-preview'
  },
  thread: {
    maxMessages: 100,
    autoArchive: true,
    retentionDays: 30
  }
}
```

### Customization

You can customize the assistant instructions, model, and other settings in `ai-config.js`.

## API Reference

### AIController Class

```javascript
class AIController {
  constructor(apiKey, assistantId)

  // Thread Management
  async createThread()
  async addMessage(content, role)
  async getMessages(limit)

  // Assistant Operations
  async runAssistant(assistantId)
  async checkRunStatus()
  async waitForRunCompletion(maxWaitTime)

  // Utility Methods
  getThreadId()
  setThreadId(threadId)
  getIsProcessing()
}
```

### useAIController Hook

```javascript
const {
  // State
  isLoading,
  error,
  messages,
  threadId,
  isProcessing,

  // Actions
  initializeThread,
  sendMessage,
  loadMessages,
  resumeThread,
  clearMessages,

  // Utilities
  getState,
  controller
} = useAIController(apiKey, assistantId)
```

### useChat Hook

```javascript
const {
  // State
  messages,
  isTyping,
  isLoading,
  error,
  uploadedFiles,
  isInitialized,
  isChatReady,

  // Actions
  sendMessage,
  handleFileUpload,
  handleFileRemove,
  clearChat,
  resumeConversation,

  // Utilities
  getChatStats,
  config
} = useChat(user)
```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**

   - Check your `REACT_APP_OPENAI_API_KEY` environment variable
   - Ensure the API key is valid and has sufficient credits

2. **"No assistant ID provided" error**

   - Verify your `REACT_APP_OPENAI_ASSISTANT_ID` environment variable
   - Make sure the assistant exists in your OpenAI account

3. **"The v1 Assistants API has been deprecated" error**

   - This error occurs when using the old v1 API
   - The controller has been updated to use v2 API automatically
   - Ensure you're using the latest version of the AI controller

4. **Rate limiting errors**

   - The system automatically handles rate limiting
   - Consider upgrading your OpenAI plan for higher limits

5. **File upload issues**
   - Check file size (max 10MB)
   - Verify file type is supported
   - Ensure proper file permissions

### Debug Mode

Enable debug logging in development:

```javascript
// In ai-config.js
development: {
  debugMode: true,
  logLevel: 'debug'
}
```

### API Version Migration

If you're migrating from v1 to v2:

1. **No code changes required**: The controller automatically uses v2 API
2. **Headers updated**: All requests now use `'OpenAI-Beta': 'assistants=v2'`
3. **Backward compatibility**: The API interface remains the same
4. **Enhanced features**: v2 API provides better performance and features

## Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **Error Handling**: Always handle errors gracefully in your UI
3. **Rate Limiting**: Implement proper rate limiting for production
4. **File Validation**: Validate files on both client and server
5. **Thread Management**: Consider thread cleanup for long-running applications
6. **API Version**: Always use the latest API version for best performance

## Security Considerations

1. **API Key Security**: Keep API keys secure and rotate regularly
2. **File Upload**: Validate and sanitize uploaded files
3. **User Data**: Be mindful of data privacy and GDPR compliance
4. **Rate Limiting**: Implement proper rate limiting to prevent abuse

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review OpenAI's [v2 API documentation](https://platform.openai.com/docs/assistants/migration)
3. Check the console for detailed error messages
4. Enable debug mode for more information
5. Ensure you're using the latest version of the AI controller
