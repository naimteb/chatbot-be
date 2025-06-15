const express = require("express"); //Loads the Express library — a tool for building servers in Node.js.
const app = express();

const PORT = 8080;
const cors = require("cors");
// chats in db { "1": [ { request, response }, ... ] }

//index.js :
// Create the Express app

// Set up middlewares (like express.json() or cors)

// Mount your routes

app.use(cors({ origin: "http://localhost:5173" })); // allow the fe to communicate with the backend
app.use(express.json()); //middleware

const authRoute = require("./routes/auth");
app.use("/", authRoute);

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

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT} `));
