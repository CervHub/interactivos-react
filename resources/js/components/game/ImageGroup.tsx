import React from 'react';
import ImageSlot from './ImageSlot';
import { ImagenData } from './mockData';


interface ImageGroupProps {
  titulo: string;
  slots: (ImagenData | undefined)[];
  color?: string; // color de fondo personalizado
  onDropSlot?: (slotIdx: number) => void;
  onDragStartFromSlot?: (img: ImagenData) => void;
  draggedId?: number;
  slotResults?: boolean[]; // feedback visual: true=correcto, false=incorrecto
}

const ImageGroup: React.FC<ImageGroupProps> = ({ titulo, slots, color = '#FFD34E', onDropSlot, onDragStartFromSlot, draggedId, slotResults }) => (
  <div >
    {/* Contenedor con borde grueso y fondo blanco */}
    <div
      className="relative flex flex-col items-center w-full rounded-[32px] border-8 py-4 sm:py-6 px-1 sm:px-4 mb-2"
      style={{ borderColor: color, background: color }}
    >
      {/* Título flotante sobre el borde */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-base sm:text-xl text-center shadow"
        style={{ background: color, color: '#222' }}
      >
        {titulo}
      </div>
      {/* Slots alineados y responsivos */}
      <div className="w-full max-w-8xl mx-auto px-2">
        <div
          className={
            `flex gap-2 sm:gap-4 md:gap-6 w-full justify-center ` +
            (slots.length > 1
              ? `lg:grid lg:grid-cols-${slots.length} lg:gap-6 lg:justify-center`
              : '')
          }
        >
          {slots.map((img, idx) => (
            <ImageSlot
              key={idx}
              image={img}
              onDrop={() => onDropSlot && onDropSlot(idx)}
              onDragStart={img ? () => onDragStartFromSlot && onDragStartFromSlot(img) : undefined}
              isOver={draggedId !== undefined && !img}
              isCorrect={slotResults ? slotResults[idx] : undefined}
              borderStyle={!img ? 'dashed' : 'solid'}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ImageGroup;
