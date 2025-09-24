import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import { ImagenData } from './mockData';


interface ImagePoolProps {
  images: ImagenData[];
  onDragStart?: (img: ImagenData) => void;
  onDrop?: () => void;
  isOver?: boolean;
}


const ImagePool: React.FC<ImagePoolProps> = ({ images, onDragStart, onDrop, isOver }) => {
  return (
    <div
      className={
        'overflow-x-auto flex justify-center items-end p-2 sm:p-4 md:p-6 bg-white/80 rounded-2xl border-4 border-white transition shadow-lg ' +
        (isOver ? 'ring-4 ring-blue-400' : '')
      }
      style={{ minHeight: 180 }}
      onDragOver={e => { e.preventDefault(); }}
      onDrop={onDrop}
    >
      <div
        className="flex flex-nowrap gap-4 justify-center items-end transition-all duration-300"
      >
        {images.map((img) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => onDragStart && onDragStart(img)}
            className="cursor-pointer flex-shrink-0 w-20 h-32 sm:w-24 sm:h-40 md:w-28 md:h-48 lg:w-32 lg:h-56"
          >
            <ImageCard url={img.url} descripcion={img.descripcion} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePool;
