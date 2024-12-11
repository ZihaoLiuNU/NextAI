# Next AI: Full-Stack Web-Based Q&A AI Resume Tailor for PDF Document Queries

## Author

**Zihao Liu**

---

## System Architecture Diagram

The application follows a client-server architecture. Below is the high-level architecture of the system:

```
Client (React Application)
    |
    | HTTP Requests (axios)
    |
    v
Server (Node.js + Express)
    |
    | Communication with LangChain (chat.js)
    |
    v
    Backend Services
        - PDF Processing (PDFLoader)
        - Text Splitting (RecursiveCharacterTextSplitter)
        - Embedding Creation (OpenAIEmbeddings)
        - Vector Storage (MemoryVectorStore)
        - Retrieval QA Chain (RetrievalQAChain)
        - OpenAI Chat Models
```

---

## Implementation Details

### Frontend:

Developed using React and Ant Design.

#### Components:

- **App.js**: Main layout and integration point for components.
- **PdfUploader.js**: Enables file uploads to the server using drag-and-drop.
- **ChatComponent.js**: Handles user input, speech recognition, and API calls to the server.
- **RenderQA.js**: Displays a conversation UI with user questions and responses.

### Backend:

Implemented in Node.js with Express.

#### Key Files:

- **server.js**: Sets up endpoints for file uploads (`/upload`) and chat interactions (`/chat`).
- **chat.js**: Handles processing of uploaded PDFs and answering user queries using LangChain components.

#### Workflow:

1. The user uploads a PDF via the frontend (**PdfUploader**), which is sent to the server using Multer for file handling.
2. Upon a query, the server processes the uploaded PDF by:
   - Loading the document with **PDFLoader**.
   - Splitting text into chunks using **RecursiveCharacterTextSplitter**.
   - Generating embeddings via **OpenAIEmbeddings**.
   - Storing embeddings in **MemoryVectorStore**.
   - Retrieving relevant context with **RetrievalQAChain** and answering using **ChatOpenAI**.
3. The server returns the response, which is displayed to the user in the frontend UI.

---

## Performance Metrics

### Response Time:

- Query processing time varies based on PDF size and complexity.
- Typical response time is under 5 seconds for a 10-page document.

### Accuracy:

- Depends on the quality of embeddings and LangChain's retrieval mechanism.
- OpenAI GPT-3.5-turbo provides reliable and concise answers.

### Scalability:

- Limited by in-memory storage (**MemoryVectorStore**), which may not handle large-scale datasets effectively.

---

## Challenges and Solutions

### Challenge: Handling large PDF files that could exceed memory limits.

**Solution**: Implement chunking with **RecursiveCharacterTextSplitter** to process documents in manageable parts.

### Challenge: Managing API key security for OpenAI.

**Solution**: Used environment variables to securely store and access sensitive keys.

### Challenge: Real-time updates in the conversation UI.

**Solution**: Utilized React's state management (**useState**) to dynamically update the UI.

### Challenge: Ensuring smooth file upload and error handling.

**Solution**: Leveraged Ant Design's **Upload** component and Multer for robust file handling.

---

## Future Improvements

### Performance Enhancements:

- Integrate a more scalable vector database (e.g., Pinecone or Weaviate) to replace **MemoryVectorStore**.
- Optimize chunking and retrieval mechanisms for faster response times.

### Feature Additions:

- Add support for multiple document types (e.g., Word, text files).
- Enhance speech recognition with additional languages.
- Allow users to save and manage conversations.

### UI/UX Improvements:

- Improve the design of the conversation UI for better readability.
- Add progress indicators for PDF processing and query responses.

### Security Enhancements:

- Implement authentication and role-based access control for sensitive operations.
- Encrypt uploaded files during storage and transmission.

---

## Features

- Users can upload a PDF.
- Users can ask questions about the content of the PDF.
- Users will receive answers to the questions asked.
- Users can ask questions about the PDF using speech.
- Users can hear the answers in speech.
