import React, { useState } from 'react';

const ImageUploader = ({ onImageUpload, currentImages = [] }) => {
  const [previews, setPreviews] = useState(currentImages);

  const handleFileChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result;
        setPreviews(newPreviews);
        onImageUpload(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} style={{ width: 'calc(50% - 10px)', position: 'relative', marginBottom: '10px' }}>
          {previews[index] ? (
            <img
              src={previews[index]}
              alt={`Área ${index + 1}`}
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
            />
          ) : (
            <div style={{ border: '2px dashed #ccc', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              Área {index + 1}
            </div>
          )}
          <label htmlFor={`image-upload-${index}`} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>
            Trocar imagem
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange(index)}
            style={{ display: 'none' }}
            id={`image-upload-${index}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;