const express = require("express"); //Loads the Express library — a tool for building servers in Node.js.
const app = express();
const uploadRoutes = require("./middleware/upload");
const PORT = 8080;
const cors = require("cors");
const path = require("path");
////
const { initLlama, generateReply } = require("./llm/llamaService");

// chats in db { "1": [ { request, response }, ... ] }

//index.js :
// Create the Express app

// Set up middlewares (like express.json() or cors)

// Mount your routes

app.use(cors({ origin: "http://localhost:5173" })); // allow the fe to communicate with the backend
app.use(express.json()); //middleware

// app.use("/upload", express.static(path.join(__dirname, "./uploads"))); this is static serving // no access control // no custom logic
// implemented the dynamic serving below

const fileRoutes = require("./routes/fileRoute");
app.use("/", fileRoutes);

const authRoute = require("./routes/auth");
app.use("/", authRoute);
// app.use("/api", uploadRoutes);
//mounting all the routes in chat-title.js under the /chat path

const chatTitleRoute = require("./routes/chat-title");
app.use("/chat-title", chatTitleRoute);

const chatRoute = require("./routes/chat");
app.use("/chat", chatRoute);

const newChatRoute = require("./routes/new-chat");
app.use("/new-chat", newChatRoute);

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });
// testing
app.post("/llama", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await generateReply(message);
    res.json({ reply: response });
  } catch (err) {
    console.error("🛑 Error in chat generation:", err.message);
    res.status(500).send("Failed to generate reply");
  }
});
app.listen(PORT, async () => {
  await initLlama();
  console.log(`it's alive on http://localhost:${PORT} `);
});
