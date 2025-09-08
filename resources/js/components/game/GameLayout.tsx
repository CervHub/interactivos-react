// ...existing code...
import React, { useEffect, useRef, useState } from 'react';

const CANVAS_W =1920;
const CANVAS_H = 1080;

type ImgItem = { id: string; url: string };

const sampleImages = Array.from({ length: 8 }).map((_, i) => ({
    id: `img-${i + 1}`,
    url: `https://via.placeholder.com/80x120.png?text=${i + 1}`,
}));

type GameLayoutProps = {
    externalScale?: number;
    virtualWidth?: number;
    virtualHeight?: number;
};

const GameLayout: React.FC<GameLayoutProps> = ({ externalScale, virtualWidth, virtualHeight }) => {
    // estado: imágenes en la "pool" y en cada slot de los dos grupos
    const [pool, setPool] = useState<ImgItem[]>(sampleImages);
    const [leftSlots, setLeftSlots] = useState<Array<ImgItem | null>>(Array(4).fill(null));
    const [rightSlots, setRightSlots] = useState<Array<ImgItem | null>>(Array(4).fill(null));

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scale, setScale] = useState<number>(1);

    // allow overriding canvas size
    const W = virtualWidth ?? CANVAS_W;
    const H = virtualHeight ?? CANVAS_H;

    // recalcula scale para que el "canvas" de 600x400 quepa en la pantalla (o en su contenedor)
    // Only compute internal scale if externalScale isn't provided
    useEffect(() => {
        if (typeof externalScale === 'number') return;
        function updateScale() {
            const parent = containerRef.current?.parentElement;
            const pw = parent ? parent.clientWidth : window.innerWidth;
            const ph = parent ? parent.clientHeight : window.innerHeight;

            const availableW = Math.max(0, pw - 20);
            const availableH = Math.max(0, ph - 20);

            const s = Math.min(availableW / W, availableH / H, 1);
            setScale(Number((s * 0.98).toFixed(4)));
        }
        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('orientationchange', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, [externalScale, W, H]);

    // helpers para buscar y remover imagen por id de pool o de slots
    const findAndRemove = (id: string) => {
        // pool
        const pIdx = pool.findIndex((p) => p.id === id);
        if (pIdx >= 0) {
            const [img] = pool.splice(pIdx, 1);
            setPool([...pool]);
            return img;
        }
        // left slots
        for (let i = 0; i < leftSlots.length; i++) {
            if (leftSlots[i]?.id === id) {
                const img = leftSlots[i]!;
                const ns = [...leftSlots];
                ns[i] = null;
                setLeftSlots(ns);
                return img;
            }
        }
        // right slots
        for (let i = 0; i < rightSlots.length; i++) {
            if (rightSlots[i]?.id === id) {
                const img = rightSlots[i]!;
                const ns = [...rightSlots];
                ns[i] = null;
                setRightSlots(ns);
                return img;
            }
        }
        return null;
    };

    const onDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDropToSlot = (e: React.DragEvent, group: 'left' | 'right', idx: number) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (!id) return;
        const img = findAndRemove(id);
        if (!img) return;
        if (group === 'left') {
            const ns = [...leftSlots];
            ns[idx] = img;
            setLeftSlots(ns);
        } else {
            const ns = [...rightSlots];
            ns[idx] = img;
            setRightSlots(ns);
        }
    };

    const onDropToPool = (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (!id) return;
        const img = findAndRemove(id);
        if (!img) return;
        setPool((p) => [...p, img]);
    };

    const allowDrop = (e: React.DragEvent) => e.preventDefault();

    // tamaño fijo de cada slot (px) para que siempre ocupen el mismo espacio
    const SLOT_STYLE: React.CSSProperties = {
        width: 70,
        height: 110,
        borderRadius: 10,
        background: '#2d2d2d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };

    return (
        <div ref={containerRef} className="flex justify-center bg-[#EDF4FC] p-2">
            {/* wrapper con tamaño virtual fijo (CANVAS_W x CANVAS_H) y escalado centrado */}
            <div
                style={{
                    width: W,
                    height: H,
                    transform: `scale(${externalScale ?? scale})`,
                    transformOrigin: 'center center',
                }}
                className="justify-center relative box-border flex-none overflow-hidden rounded-lg border bg-[#2F88CA] p-6 pt-15 shadow-lg"
            >
                {/* Botón de status */}
                <div className="absolute top-2 left-2">
                    <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Status</button>
                </div>
                {/* Botón de timer */}
                <div className="absolute top-2 right-2">
                    <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">Timer</button>
                </div>
                {/* Top row: pool de imágenes (draggables) */}
                <div
                    className="bg-[#85A1D4] rounded-lg p-2 w-full"
                    onDragOver={allowDrop}
                    onDrop={onDropToPool}
                >
                    <div className="flex flex-wrap justify-between gap-4">
                        {pool.map((img) => (
                            <div
                                key={img.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, img.id)}
                                className="h-[200px] w-[110px] cursor-grab items-center justify-center overflow-hidden rounded-[20px] bg-[#E9E9E9]"
                            >
                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Middle: two groups with subtitles */}

                <div className="flex h-[310px] flex-wrap items-start justify-between gap-3 rounded-lg bg-[#2F88CA] p-5 pt-10">
                    {/* Left group */}
                    <div className="box-border flex min-w-[220px] flex-1 flex-col items-center gap-2 rounded-lg bg-[#FBC424] p-2">
                        <div className="rounded-lg bg-[#9DCCEB] px-3 py-1.5 font-bold text-white">Colocó</div>
                        <div className="box-border flex min-w-[220px] flex-1 flex-col items-center gap-2">
                            <div className="flex gap-2">
                                {leftSlots.map((s, i) => (
                                    <div
                                        key={i}
                                        onDragOver={allowDrop}
                                        onDrop={(e) => onDropToSlot(e, 'left', i)}
                                        className={`flex h-[200px] w-[110px] items-center justify-center overflow-hidden rounded-[10px] bg-[#5b4912] ${s ? '' : 'border-2 border-dashed border-white/20'}`}
                                    >
                                        {s ? (
                                            <img src={s.url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-white/60">Vacío</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right group */}
                    <div className="box-border flex min-w-[220px] flex-1 flex-col items-center gap-2 rounded-lg bg-[#E03441] p-2">
                        <div className="rounded-lg bg-[#9DCCEB] px-3 py-1.5 font-bold text-white">Colocó</div>
                        <div className="bg box-border flex min-w-[220px] flex-1 flex-col items-center gap-2">
                            <div className="flex gap-2">
                                {rightSlots.map((s, i) => (
                                    <div
                                        key={i}
                                        onDragOver={allowDrop}
                                        onDrop={(e) => onDropToSlot(e, 'right', i)}
                                        className={`flex h-[200px] w-[110px] items-center justify-center overflow-hidden rounded-[10px] bg-[#6b1f1f] ${s ? '' : 'border-2 border-dashed border-white/10'}`}
                                    >
                                        {s ? (
                                            <img src={s.url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-white/60">Vacío</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom centered button */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 transform">
                    <button className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white">Button</button>
                </div>
            </div>
        </div>
    );
};
export default GameLayout;
