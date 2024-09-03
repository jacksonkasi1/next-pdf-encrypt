'use client';

// components/EncryptPdf.js
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import 'jspdf-encrypt'; // Import the encryption plugin

const EncryptPdf = () => {
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) {
      setErrorMessage('Please select a file.');
      return;
    }
    if (uploadedFile.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }
    setFile(uploadedFile);
    setErrorMessage('');
  };

  const encryptPdf = async () => {
    if (!file) {
      setErrorMessage('Please upload a PDF file.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);

      const pdfBytes = await pdfDoc.save(); // Save the modified PDF

      // Create a jsPDF instance
      const jsPDFDoc = new jsPDF({
        encryption: {
          userPassword: password,
          ownerPassword: password,
          userPermissions: ['print'], // Specify any permissions you want
        },
      });

      // Add the encrypted PDF content to jsPDF instance
      jsPDFDoc.addFileToVFS('encrypted.pdf', pdfBytes);
      jsPDFDoc.addPage('encrypted.pdf');

      // Save the encrypted PDF
      jsPDFDoc.save(`encrypted_${file.name}`);

      // Clean up
      setErrorMessage('');
    } catch (error) {
      console.error("Error details:", error);
      setErrorMessage('Error encrypting the PDF file. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Encrypt PDF</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={encryptPdf}>Encrypt and Download PDF</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default EncryptPdf;
