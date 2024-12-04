import React, { useRef, useState } from 'react';

const ImageUploader = ({ initialImage, onUpload, label, disabled }) => {
  const [preview, setPreview] = useState(initialImage);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setPreview(imageData);
      onUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label className="mb-2 font-medium">{label}</label>
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={disabled}
      >
        {preview ? 'Trocar Imagem' : 'Adicionar Imagem'}
      </button>
    </div>
  );
};

export default ImageUploader;