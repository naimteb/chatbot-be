const express = require("express"); //Loads the Express library — a tool for building servers in Node.js.
const { v4: uuidv4 } = require("uuid");
const app = express();

const PORT = 8080;
const cors = require("cors");
const pool = require("./db");
const chatLogs = {}; //{ "1": [ { request, response }, ... ] } the data base

app.use(cors({ origin: "http://localhost:5173" })); // middleware origin: allows the frront end
// loads cors middleware library  so your express server can handle and allow
// cross origin requests( origin = protocol + domain + port)  ex:http://localhost:3000
//By default, browsers block cross-origin requests for security.

app.use(express.json()); //middleware

app.post("/new-chat", async (req, res) => {
  // console.log("before try");
  try {
    const result = await pool.query(
      "INSERT INTO chat_sessions (created_at ,title ) VALUES (DEFAULT , NULL ) RETURNING chat_session_id"
    );

    if (result.rows.length === 0) {
      throw new Error("Insert failed - no rows returned");
    }

    const newId = result.rows[0].chat_session_id; //result is the data returnedto index.js

    res.status(201).json({ chatId: newId }); //HTTP Response:
  } catch (error) {
    console.error("Error creating new chat:", error);
    res.status(500).json({ error: "Could not create new chat session" }); //HTTP Response:
  }
});

app.post("/chat", async (req, res) => {
  console.log(" /chat POST route hit");
  console.log("Request body:", req.body);
  const { request, session_id } = req.body;
  console.log("request is :", request, "session is :", session_id);
  if (!request || !session_id) {
    console.log("Missing data");
    return res.status(400).json({ error: "Missing request or chat ID" });
  }

  // try {
  //   await pool.query(
  //     "INSERT INTO chat_sessions (chat_session_id,title) VALUES ($1,$2) ON CONFLICT DO NOTHING",
  //     [session_id, "untitled  chat"]
  //   );
  // } catch (error) {
  //   console.error("Error creating chat session:", error);
  //   return res.status(500).json({ error: "Failed to create chat session" });
  // }

  // const match = systemData.find((entry) => request === entry.requestIs);
  // const response = match ? match.responseIs : "I don't understand";

  const result = await pool.query(
    "SELECT response FROM bot_knowledge WHERE request = $1 LIMIT 1",
    [request]
  );

  const response =
    result.rows.length > 0 ? result.rows[0].response : "I don't understand";

  try {
    console.log("Inserting:", session_id, request, response);
    await pool.query(
      "INSERT INTO chats (session_id,request,response) VALUES ($1,$2,$3)", // parametrized values $..$..
      [session_id, request, response]
    );
    const titleCheck = await pool.query(
      "SELECT COUNT(*) FROM chats WHERE session_id=$1",
      [session_id]
    );

    if (parseInt(titleCheck.rows[0].count) === 1) {
      await pool.query(
        "UPDATE chat_sessions SET title=$1 where chat_session_id=$2",
        [request.slice(0, 50), session_id]
      );
    }
    res.status(201).json({ response });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.get("/chat/:sessionID", async (req, res) => {
  const { sessionID } = req.params;
  try {
    const result = await pool.query(
      "SELECT request,response,created_at  from chats where session_id=$1 ORDER BY created_at ",
      [sessionID]
    );
    return res.json(result.rows);
  } catch (error) {
    // const chatHistory = chatLogs[chatId] || [];}
    console.error("Database error:", error);
    return res.status(500).json({ error: "failed to fetch chat history " });
  }
});

app.delete("/chat/:sessionID", async (req, res) => {
  const { sessionID } = req.params;
  // delete chatLogs[chatId];

  try {
    console.log("deleting message ");
    await pool.query("DELETE  from chats where session_id=$1", [sessionID]);
    console.log("message deleted  ");
    return res.json({ success: true });
  } catch (error) {
    console.error("error deleting chat:", error);
    return res.status(500).json({ error: "failed to delete chat" });
  }
});
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/chat-title/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT title FROM chat_sessions WHERE chat_session_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ title: result.rows[0].title });
  } catch (error) {
    console.error("Error fetching chat title:", error);
    res.status(500).json({ error: "Failed to fetch chat title" });
  }
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT} `));
