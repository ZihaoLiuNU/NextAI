import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import chat from "./chat.js";

dotenv.config();

const app = express();
app.use(cors());

// Configure multer. The stored filename is prefixed with the client's
// sessionId so two clients uploading a file with the same original name
// can't clobber each other's file on disk.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const prefix = req.body.sessionId || Date.now();
    cb(null, `${prefix}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const PORT = 5001;

// Per-session state (uploaded file path + cached vector store), keyed by a
// sessionId the client generates and sends with every request. This
// replaces a single shared `filePath` variable, which meant any second
// user (or a second tab) uploading a file would silently overwrite the
// file/context every other concurrent user was querying against.
const sessions = new Map();

app.post("/upload", upload.single("file"), async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).send("Missing sessionId.");
  }
  // A new upload invalidates any vector store cached for this session.
  sessions.set(sessionId, { filePath: req.file.path, vectorStore: null });
  res.send(req.file.path + " upload successfully.");
});

app.get("/chat", async (req, res) => {
  const { question, sessionId } = req.query;
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(400).send("No file uploaded for this session yet.");
  }
  try {
    const resp = await chat(session, question);
    res.send(resp.text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to process the question.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
