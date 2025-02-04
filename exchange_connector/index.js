import express from 'express';
import axios from 'axios';
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors({
   allowedHeaders: ["*"],
   origin: "*"
}));
app.use(express.json());

// Route to register a webhook URL on Server 1
app.post('/register-webhook', async (req, res) => {
   try {
       // Make a POST request to Server 1's /register-webhook endpoint
       const response = await axios.post('http://localhost:4000/register-webhook', {
           url: 'http://localhost:3000/trigger-webhook-url'
       });

       // Respond with the response from Server 1
       res.status(response.status).json(response.data);
   } catch (error) {
       // Handle errors
       console.error('Error registering webhook', error.message);
       res.status(500).json({ message: 'Error registering webhook' });
   }
});

// Route to trigger the webhook on Server 1
app.post('/trigger-webhook-url', async (req, res) => {
   try {
       console.log('Webhook URL is triggered')
       res.status(200).json({message: 'Webhook URL is triggered.Exchange told me that order got executed, now i am going to inform client'});
   } catch (error) {
       // Handle errors
       console.error('Error triggering webhook ', error.message);
       res.status(500).json({ message: 'Error triggering webhook' });
   }
});

// Start the server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
