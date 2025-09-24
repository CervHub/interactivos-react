import React from 'react';

export interface ImageCardProps {
  url: string;
  descripcion: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ url, descripcion }) => (
  <div className="flex flex-col items-center w-full h-full w-full h-full object-contain">
    <img
      src={url}
      alt=""
      className="object-contain rounded shadow bg-white w-full h-full max-w-full max-h-full"
      style={{ aspectRatio: '2/3' }}
    />
  </div>
);

export default ImageCard;
