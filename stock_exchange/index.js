import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import axios from "axios"

const app = express();
const port = 4000;

app.use(cors({
   allowedHeaders: ["*"],
   origin: "*"
}));
app.use(express.json());

// Simple in-memory storage for webhook URLs
const webhookURLs = [];

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route to handle POST requests to register a webhook
app.post('/register-webhook', (req, res) => {
   // Extract webhook URL from request body
   const webhookURL = req.body.url;

   // Store the webhook URL
   webhookURLs.push(webhookURL);

   // Send a response
   res.status(200).json({ message: 'Webhook registered successfully' });
});



// Route to handle triggering the webhook
app.post('/trigger-event', async (req, res) => {
   // Check if there are any webhook URLs registered
   if (webhookURLs.length === 0) {
       return res.status(400).json({ message: 'No webhook URL registered' });
   } else {

       // For simplicity, let's just trigger the first registered webhook URL
       const webhookURL = webhookURLs[0];
       console.log(webhookURL);

       try {
           console.log('Triggering Webhook URL');
           // Make a POST request to Server 1's /register-webhook endpoint
           const response = await axios.post(webhookURL);
           // Respond with the response from Server 1
           res.status(response.status).json(response.data);
       } catch (error) {
           // Handle errors
           console.error('Error triggering webhook url', error.message);
           res.status(500).json({ message: 'Error triggering webhook url' });
       }
   }
});

// Start the server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
