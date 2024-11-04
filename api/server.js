import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SALESMATE_API_KEY = process.env.SALESMATE_API_KEY;
const SALESMATE_DOMAIN = process.env.SALESMATE_DOMAIN;

app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, company, email, message, services } = req.body;

    // Format data for Salesmate
    const salesmateData = {
      firstName,
      lastName,
      companyName: company,
      emails: [{ type: 'work', value: email }],
      description: `Message: ${message}\n\nServices of Interest:\n${services.join('\n')}`,
      source: 'Website Contact Form'
    };

    // Send to Salesmate API
    const response = await fetch(`https://${SALESMATE_DOMAIN}/api/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SALESMATE_API_KEY
      },
      body: JSON.stringify(salesmateData)
    });

    if (!response.ok) {
      throw new Error('Failed to create lead in Salesmate');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Salesmate API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process contact form' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});