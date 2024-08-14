import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = 8000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async (req, res) => {
    try {
      const model =  genAI.getGenerativeModel({ model: "gemini-pro" });
  
      const chat =  model.startChat({
        history: req.body.history
      });
  
      const msg = req.body.message;
      const result = await chat.sendMessage(msg);
  
      // Extract the text from the response function
      const responseText =  result.response.text();
  
      // Log the response text for verification
      console.log('Response Text:', responseText);
  
      // Send the text response to the frontend
      res.json({ response: responseText });
    } catch (error) {
      console.error("Error during AI response generation:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
