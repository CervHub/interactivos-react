import React from 'react';
import ImageCard from './ImageCard';
import { ImagenData } from './mockData';

import { DragEventHandler } from 'react';

interface ImageSlotProps {
    image?: ImagenData;
    onDrop?: DragEventHandler<HTMLDivElement>;
    onDragStart?: DragEventHandler<HTMLDivElement>;
    isOver?: boolean;
    isCorrect?: boolean; // feedback visual
    borderStyle?: 'solid' | 'dashed';
}

const ImageSlot: React.FC<ImageSlotProps> = ({ image, onDrop, onDragStart, isOver, isCorrect, borderStyle = 'solid' }) => (
    <div
        className={
            'flex items-center justify-center overflow-hidden rounded-xl border-2 bg-white shadow transition ' +
            'w-[16vw] h-[24vw] sm:w-[12vw] sm:h-[18vw] md:w-[10vw] md:h-[15vw] lg:w-full lg:h-auto lg:aspect-[2/3] xl:w-full xl:h-auto xl:aspect-[2/3] 2xl:w-full 2xl:h-auto 2xl:aspect-[2/3] p-1 ' +
            (image
                ? isCorrect === true
                    ? 'border-green-500 bg-green-50'
                    : isCorrect === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                : 'border-gray-300 bg-gray-100') +
            (isOver ? ' ring-4 ring-blue-400' : '')
        }

        style={{ aspectRatio: '2/3', borderStyle }}
        onDragOver={(e) => {
            e.preventDefault();
        }}
        onDrop={onDrop}
    >
        {image ? (
            <div draggable onDragStart={onDragStart} className="flex h-full w-full cursor-pointer items-center justify-center">
                <ImageCard url={image.url} descripcion="" />
            </div>
        ) : (
            <span className="text-xs text-gray-400 sm:text-sm">Vacío</span>
        )}
    </div>
);

export default ImageSlot;
