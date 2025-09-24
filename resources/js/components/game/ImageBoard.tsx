import React, { useState } from 'react';
import ImageGroup from './ImageGroup';
import ImagePool from './ImagePool';
import { grupos, ImagenData, mockImagenes } from './mockData';

// Utilidad para inicializar los slots vacíos por grupo según la cantidad de imágenes de ese grupo
const getEmptySlots = (groupKey: string) => {
    const count = mockImagenes.filter(img => img.grupo === groupKey).length;
    return Array(count).fill(undefined);
};

type SlotsState = Record<string, (ImagenData | undefined)[]>;

const ImageBoard: React.FC = () => {
    // Estado: imágenes en pool y slots por grupo
    const [pool, setPool] = useState<ImagenData[]>(mockImagenes);
    const [slots, setSlots] = useState<SlotsState>(() => {
        const obj: SlotsState = {};
        grupos.forEach((g) => {
            obj[g.key] = getEmptySlots(g.key);
        });
        return obj;
    });
    // Estado drag
    const [dragged, setDragged] = useState<ImagenData | null>(null);
    // Estado de puntaje y envío
    const [score, setScore] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Para feedback visual: slots correctos/incorrectos
    const [slotResults, setSlotResults] = useState<Record<string, boolean[]>>({});

    // Drag handlers para pool
    const handleDragStartFromPool = (img: ImagenData) => setDragged(img);
    const handleDropToPool = () => {
        if (!dragged) return;
        // Quitar de slots si estaba en slot
        setSlots((prev) => {
            const newSlots: SlotsState = {};
            for (const key in prev) {
                newSlots[key] = prev[key].map((slotImg) => (slotImg && slotImg.id === dragged.id ? undefined : slotImg));
            }
            return newSlots;
        });
        // Agregar a pool si no está
        setPool((prev) => (prev.some((img) => img.id === dragged.id) ? prev : [...prev, dragged]));
        setDragged(null);
    };

    // Drag handlers para slots
    const handleDropToSlot = (groupKey: string, slotIdx: number) => {
        if (!dragged) return;
        // Si la imagen ya está en ese slot, no hacer nada
        if (slots[groupKey][slotIdx]?.id === dragged.id) return;
        // Quitar de pool y de cualquier slot anterior
        setPool((prev) => prev.filter((img) => img.id !== dragged.id));
        setSlots((prev) => {
            const newSlots: SlotsState = {};
            for (const key in prev) {
                newSlots[key] = prev[key].map((slotImg) => (slotImg && slotImg.id === dragged.id ? undefined : slotImg));
            }
            // Si el slot destino ya tiene una imagen, la regresamos al pool
            const prevImg = newSlots[groupKey][slotIdx];
            if (prevImg) {
                setPool((poolPrev) => (poolPrev.some((img) => img.id === prevImg.id) ? poolPrev : [...poolPrev, prevImg]));
            }
            // Poner en el slot destino
            newSlots[groupKey] = [...newSlots[groupKey]];
            newSlots[groupKey][slotIdx] = dragged;
            return newSlots;
        });
        setDragged(null);
    };

    // Drag start desde slot
    const handleDragStartFromSlot = (img: ImagenData) => setDragged(img);

    // Calcular puntaje
    const handleSubmit = () => {
        let puntos = 0;
        const results: Record<string, boolean[]> = {};
        grupos.forEach((g) => {
            results[g.key] = slots[g.key].map((img) => {
                const ok = !!img && img.grupo === g.key;
                if (ok) puntos++;
                return ok;
            });
        });
        setScore(puntos);
        setSlotResults(results);
        setSubmitted(true);
    };

    // Reiniciar juego
    const handleReset = () => {
        setPool(mockImagenes);
        setSlots(() => {
            const obj: SlotsState = {};
            grupos.forEach((g) => {
                obj[g.key] = getEmptySlots(g.key);
            });
            return obj;
        });
        setScore(null);
        setSlotResults({});
        setSubmitted(false);
        setDragged(null);
    };

    return (
        <div
            className="relative flex h-screen flex-col items-center justify-center overflow-y-auto"
            style={{
                background: 'linear-gradient(135deg, #0a2540 0%, #2563eb 60%, #38bdf8 100%)',
                
            }}
        >
            {/* Contenido del juego */}
            <div className="flex w-full max-w-6.5xl flex-col gap-10 p-2 sm:p-8 md:p-8">
                <ImagePool
                    images={pool}

                    onDragStart={handleDragStartFromPool}
                    onDrop={handleDropToPool}
                    isOver={!!dragged && !pool.some((img) => img.id === dragged.id)}
                />
                <div className="flex min-h-0 w-full flex-1 flex-col gap-4 lg:flex-row lg:justify-center lg:gap-12">
                    {grupos.map((g, idx) => (
                        <div className="mb-8 min-h-0 flex-1 last:mb-0">
                            <ImageGroup
                                key={g.key}
                                titulo={g.titulo}
                                color={g.color}
                                slots={slots[g.key]}
                                onDropSlot={(slotIdx: number) => handleDropToSlot(g.key, slotIdx)}
                                onDragStartFromSlot={handleDragStartFromSlot}
                                draggedId={dragged?.id}
                                slotResults={submitted ? slotResults[g.key] : undefined}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-2 mb-8">
                    <button
                        className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
                        onClick={handleSubmit}
                        disabled={submitted}
                    >
                        Enviar
                    </button>
                    <button
                        className="rounded bg-gray-500 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-gray-700"
                        onClick={handleReset}
                        disabled={!submitted}
                    >
                        Reiniciar
                    </button>
                </div>
                {submitted && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="rounded-lg bg-white px-8 py-6 shadow-lg text-center">
                            <div className="mb-4 text-xl font-bold text-gray-800">
                                ¡Resultados!
                            </div>
                            <div className="mb-6 text-lg text-gray-700">
                                Puntaje obtenido: <span className="font-semibold">{score}</span> / {Object.values(slots).reduce((acc, arr) => acc + arr.length, 0)}
                            </div>
                            <button
                                className="rounded bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700"
                                onClick={handleReset}
                            >
                                Jugar de nuevo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageBoard;
