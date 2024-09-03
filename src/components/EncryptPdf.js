'use client'

import React, { useState } from 'react';

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
      const response = await fetch('https://5000-jacksonkasi-nextpdfencr-r7ye71p1zyi.ws-us115.gitpod.io/encrypt-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: fileArrayBuffer,
      });

      if (!response.ok) {
        throw new Error('Failed to encrypt PDF');
      }

      const encryptedPdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(encryptedPdfBlob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `encrypted_${file.name}`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error details:', error);
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
