import React from 'react';

export function ImageGallery({ images, className = '' }) {
  return (
    <div className={`image-grid ${className}`}>
      {images.map((url, index) => (
        <div key={index} className="image-card">
          <img src={url} alt={`Gallery image ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}