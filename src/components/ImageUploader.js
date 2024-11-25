import React, { useCallback } from 'react';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
      {currentImage ? (
        <div style={{ position: 'relative', height: '100%' }}>
          <img
            src={currentImage}
            alt="Área"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <p style={{ marginBottom: '10px' }}>Clique para adicionar uma foto</p>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;