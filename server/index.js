import express from 'express';
import bodyParser from 'body-parser';
import { encrypt } from 'node-qpdf2';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // Import the cors middleware

// Setup Express server
const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

app.use(bodyParser.raw({ type: 'application/pdf' }));

// Encrypt PDF endpoint
app.post('/encrypt-pdf', async (req, res) => {
  const inputPdfBuffer = req.body;

  // Save the uploaded PDF temporarily
  const inputFilePath = path.join(process.cwd(), 'input.pdf');
  const outputFilePath = path.join(process.cwd(), 'encrypted.pdf');
  fs.writeFileSync(inputFilePath, inputPdfBuffer);

  const options = {
    input: inputFilePath,
    output: outputFilePath,
    password: '1234',  // Replace with your password logic
    keyLength: 256,  // AES 256 encryption
  };

  try {
    await encrypt(options);
    const encryptedPdfBuffer = fs.readFileSync(outputFilePath);

    // Clean up temporary files
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputFilePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(encryptedPdfBuffer);
  } catch (error) {
    console.error('Error encrypting PDF:', error);
    res.status(500).send('Failed to encrypt PDF');
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
