const openai = require("openai");

const dotenv = require("dotenv");
dotenv.config();


function updateAPIKey() {
  // Check if the current API key is still valid
  openai.apiKey = process.env.API_KEY;
  openai.models
    .list()
    .then(response => {
      console.log("API key is valid");
    })
    .catch(error => {
      console.log("API key is invalid, regenerating...");
      // Regenerate the API key
      openai.apiKey = process.env.REGENERATION_API_KEY;
      openai.apiKeys
        .create({
          description: "API key for extension"
        })
        .then(response => {
          console.log("API key regenerated:", response.key);
          // Update the .env file with the new API key
          fs.writeFileSync(
            ".env",
            `API_KEY=${response.key}\nREGENERATION_API_KEY=${process.env.REGENERATION_API_KEY}`
          );
          console.log(".env file updated with new API key");
          // Reload the .env file
          dotenv.config();
          console.log("Process environment updated with new API key");
        });
    });
}

// Run the updateAPIKey function every hour
setInterval(updateAPIKey, 3600 * 1000);




const messageInput = document.querySelector("div[contenteditable]");
const sendButton = document.querySelector("button[data-icon='send']");

sendButton.addEventListener("click", function() {
  openai.completion
    .create({
      prompt: messageInput.textContent,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 1,
      engine: "text-davinci-002"
    })
    .then(response => {
      messageInput.textContent = response.choices[0].text;
    });
});
