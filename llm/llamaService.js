// Import necessary components from the node-llama-cpp package
// const { getLlama, LlamaChatSession } = require("node-llama-cpp");

// Node.js path module, used to build platform-independent file paths
const path = require("path");

// Declare a session variable to hold the active chat session
let session;

/**
 * Initializes the LLaMA model by:
 * - Loading the GGUF model using llama.cpp bindings
 * - Creating a context and a chat session for interaction
 */
async function initLlama() {
  // Load the engine (llama.cpp compiled backend, already bundled)

  // // Load the TinyLLaMA GGUF model from local path
  // const model = await llama.loadModel({
  //   modelPath: path.resolve(
  //     __dirname,
  //     "./TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf"
  //   ),
  // });

  // // Create a new context (token memory, computation buffer, etc.)
  // const context = await model.createContext();

  // // Create a chat session that uses the above context
  // session = new LlamaChatSession({
  //   contextSequence: context.getSequence(), // this manages tokens and state
  // });

  // // Log to confirm model is fully initialized
  // console.log(
  //   "🦙 TinyLLaMA model (GGUF) successfully loaded using node-llama-cpp."
  // );
  const { getLlama, LlamaChatSession } = await import("node-llama-cpp");
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.resolve(
      __dirname,
      "./tinyllama-1.1b-chat-v1.0.Q4_K_S.gguf"
    ),
  });

  const context = await model.createContext();
  session = new LlamaChatSession({ contextSequence: context.getSequence() });

  console.log("🦙 TinyLLaMA model loaded.");
}

/**
 * Generates a response to a user's text prompt using the active session
 * @param {string} promptText - Input text from the user
 * @returns {Promise<string>} - Model's generated response
 */
async function generateReply(promptText) {
  // Ensure the session is ready
  if (!session) {
    throw new Error(
      "LLaMA session is not initialized. Did you forget to call initLlama()?"
    );
  }

  // Pass the prompt to the chat session and await the model's response
  // const response = await session.prompt(promptText);

  // Return the full generated response text
  //   return response;
  const messages = `
<|system|>
You are a helpful assistant.<|user|>${promptText}<|assistant|>`.trim();
  return await session.prompt(messages, {
    maxTokens: 256,
    temperature: 0.2,
    topP: 0.2,
  }); // temp Controls the creativity or randomness of the output.
} //topP Limits the model to choosing from the top X% most likely tokens.

// Export both the init and reply functions for external use (e.g., in Express routes)
module.exports = {
  initLlama,
  generateReply,
};
