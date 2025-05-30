const express = require("express"); //Loads the Express library — a tool for building servers in Node.js.

const app = express();

const PORT = 8080;
const cors = require("cors");

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT} `));

app.use(cors({ origin: "http://localhost:5173" })); // middleware origin: allows the frront end
// loads cors middleware library  so your express server can handle and allow
// cross origin requests( origin = protocol + domain + port)  ex:http://localhost:3000
//By default, browsers block cross-origin requests for security.

app.use(express.json()); //middleware

const systemData = [
  { requestIs: "how are you", responseIs: "Fine and you" },
  { requestIs: "Fine", responseIs: "great!" },
  { requestIs: "hello", responseIs: "Hi there!" },
  { requestIs: "hi", responseIs: "Hello!" },
  { requestIs: "what is your name", responseIs: "I'm a chatbot!" },
  { requestIs: "who made you", responseIs: "A kind developer built me." },
  { requestIs: "what can you do", responseIs: "I can chat with you!" },
  {
    requestIs: "tell me a joke",
    responseIs:
      "Why don’t scientists trust atoms? Because they make up everything!",
  },
  { requestIs: "bye", responseIs: "Goodbye! Have a great day!" },
  { requestIs: "thanks", responseIs: "You're welcome!" },
  { requestIs: "thank you", responseIs: "Glad to help!" },
  {
    requestIs: "what is the weather",
    responseIs: "I can't check weather right now, but I hope it's sunny!",
  },
  { requestIs: "do you like music", responseIs: "Yes! Music is wonderful." },
  {
    requestIs: "can you help me",
    responseIs: "Sure! What do you need help with?",
  },
  {
    requestIs: "i'm bored",
    responseIs: "Maybe try reading, drawing, or going for a walk!",
  },
];

app.post("/chat", (req, res) => {
  const userRequest = req.body.request;
  const match = systemData.find((entry) => userRequest === entry.requestIs);
  const response = match ? match.responseIs : "I don't understand";
  res.json({ response });
});
