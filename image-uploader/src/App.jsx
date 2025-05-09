import { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setEmotion('');
    setProcessedImage(null);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    
    const formData = new FormData();
    formData.append("file", image);

    const res = await axios.post("http://localhost:8001/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setEmotion(res.data.emotion);
    if (res.data.image) {
      setProcessedImage(`data:image/jpeg;base64,${res.data.image}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Emotion Detection</h1>

      <input type="file" onChange={handleImageChange} className="mb-4" />

      {previewUrl && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Uploaded Image:</h2>
          <img src={previewUrl} alt="Preview" className="w-48 h-auto rounded shadow" />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload and Process
      </button>

      {emotion && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Detected Emotion: {emotion}</h2>
        </div>
      )}

      {processedImage && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Cropped Face Image:</h3>
          <img src={processedImage} alt="Processed Face" className="w-48 h-auto rounded shadow" />
        </div>
      )}
    </div>
  );
}

export default App;
