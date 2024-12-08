import React, { useState, ChangeEvent, FormEvent } from 'react';

interface TranscriptionResponse {
  transcript: string;
  error?: string;
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      console.log('Selected file:', selectedFile); // Log file information
      console.log('File type:', selectedFile.type); // Log file MIME type

      // Check if the file is an MP3 (based on MIME type and extension)
      if (selectedFile.type === 'audio/mp3' || selectedFile.name.endsWith('.mp3')) {
        setFile(selectedFile);
        setError(''); // Reset any previous error
      } else {
        setFile(null);
        setError('Please select a valid MP3 file');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/transcribe/', {
        method: 'POST',
        body: formData,
      });

      const result: TranscriptionResponse = await response.json();

      if (response.ok) {
        setTranscript(result.transcript); // Set the transcript
        setError(''); // Clear any previous error
      } else {
        setError(result.error || 'An error occurred');
        setTranscript(''); // Clear transcript if there's an error
      }
    } catch (err) {
      setError('An error occurred while transcribing the file');
      setTranscript('');
    }
  };

  return (
    <div className="App">
      <h1>Upload an MP3 file for Transcription</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {transcript && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default App;
