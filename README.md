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

- **server.js**: Sets up endpoints for file uploads (`/upload`) and chat interactions (`/chat`), and keeps each client's uploaded file and vector store isolated in an in-memory session map keyed by a client-generated `sessionId`.
- **chat.js**: Handles processing of uploaded PDFs and answering user queries using LangChain components.

#### Workflow:

1. The client generates a `sessionId` on load and sends it with every request.
2. The user uploads a PDF via the frontend (**PdfUploader**), which is sent to the server using Multer for file handling and stored under that session.
3. Upon a query, the server looks up the session's file and, the first time a question is asked about it, processes the PDF by:
   - Loading the document with **PDFLoader**.
   - Splitting text into chunks using **RecursiveCharacterTextSplitter**.
   - Generating embeddings via **OpenAIEmbeddings**.
   - Storing embeddings in **MemoryVectorStore** (cached on the session so later questions about the same file skip this step).
   - Retrieving relevant context with **RetrievalQAChain** and answering using **ChatOpenAI**.
4. The server returns the response, which is displayed to the user in the frontend UI.

---

## Performance Metrics

### Response Time:

- Query processing time varies based on PDF size and complexity.
- Typical response time is under 5 seconds for a 10-page document.

### Accuracy:

- Depends on the quality of embeddings and LangChain's retrieval mechanism.
- Uses OpenAI's **gpt-4o** for answering and **text-embedding-3-small** for embeddings.

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

### Challenge: Concurrent users overwrote each other's uploaded document and chat context.

**Solution**: The server originally tracked the "current" uploaded file in a single global variable, so a second user (or a second browser tab) uploading a file silently replaced the file/context every other user was querying against. Fixed by keying server-side state (file path + cached vector store) off a `sessionId` the client generates and sends with every request, and namespacing uploaded filenames by `sessionId` to avoid collisions on disk. This also let the vector store be cached per session instead of being rebuilt (re-load, re-split, re-embed) on every single question.

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
