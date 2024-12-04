# StreamTape API Wrapper

A production-grade TypeScript wrapper for the StreamTape API, providing a clean and type-safe interface for interacting with StreamTape's video hosting service.

## Features

- 🚀 Full TypeScript support with comprehensive type definitions
- 🔄 Automatic retry mechanism for failed requests
- 🛡️ Built-in error handling and custom error types
- 📝 Complete API coverage with well-documented methods
- 🎯 Progress tracking for uploads and downloads
- ⚡ Promise-based async/await interface
- 🔍 Detailed debugging information
- 🧪 Built with testability in mind

## Installation

```bash
bun add streamtape-api-wrapper
```

## Quick Start

```typescript
import { StreamTape } from 'streamtape-api-wrapper';

// Initialize the client
const client = new StreamTape({
  login: 'your-api-login',
  key: 'your-api-key'
});

// Example: Get account information
const accountInfo = await client.account.getAccountInfo();
console.log(accountInfo);
```

## Usage Examples

### Account Operations

```typescript
// Get account information
const accountInfo = await client.account.getAccountInfo();
```

### File Operations

```typescript
// List files in a folder
const files = await client.file.listFolder('folder-id');

// Get file information
const fileInfo = await client.file.getFileInfo('file-id');

// Create a new folder
const folderId = await client.file.createFolder('My Folder');

// Delete a file
await client.file.deleteFile('file-id');
```

### Download Operations

```typescript
// Get a download link in one step
const downloadLink = await client.download.getDirectDownloadLink('file-id');

// Or get a ticket first and then the download link
const ticket = await client.download.getDownloadTicket('file-id');
const link = await client.download.getDownloadLink('file-id', ticket.ticket);
```

### Upload Operations

```typescript
// Upload a local file with progress tracking
const fileId = await client.upload.uploadFile('/path/to/file.mp4', {
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress * 100}%`);
  }
});

// Add a remote upload
const remoteUpload = await client.upload.addRemoteUpload('https://example.com/video.mp4', {
  name: 'My Video'
});

// Wait for remote upload to complete with progress tracking
const status = await client.upload.waitForRemoteUpload(remoteUpload.id, {
  onProgress: (status) => {
    console.log(`Remote upload status: ${status.status}`);
  }
});
```

## Advanced Configuration

```typescript
const client = new StreamTape({
  login: 'your-api-login',
  key: 'your-api-key',
  baseUrl: 'https://api.streamtape.com', // Optional custom base URL
  timeout: 30000, // Request timeout in milliseconds
  retry: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    retryableStatusCodes: [429, 503]
  }
});
```

## Error Handling

The wrapper provides custom error types for better error handling:

```typescript
import {
  StreamTapeError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NotFoundError,
  ApiRequestError,
  NetworkError
} from 'streamtape-api-wrapper';

try {
  await client.file.getFileInfo('invalid-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('File not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Authentication failed');
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded');
  }
}
```

## TypeScript Support

The wrapper is written in TypeScript and provides comprehensive type definitions for all API responses and parameters:

```typescript
import { AccountInfo, FileInfo, DownloadLink } from 'streamtape-api-wrapper';

async function downloadFile(fileId: string): Promise<DownloadLink> {
  const fileInfo: FileInfo = await client.file.getFileInfo(fileId);
  return client.download.getDirectDownloadLink(fileId);
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
