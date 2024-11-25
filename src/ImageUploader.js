import React, { useState } from 'react';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="image-upload" />
      <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
        {preview ? (
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            Clique para adicionar imagem
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;