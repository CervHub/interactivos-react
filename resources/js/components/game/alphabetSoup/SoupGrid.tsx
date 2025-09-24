import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SoupWord } from './mockData';

type Direction = [number, number];

interface Props {
    words: SoupWord[];
    onFound: (word: SoupWord) => void;
    foundIds: Set<number>;
    maxSize?: number; // max grid size limit
}

// Utility: random letter
const randLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

// Possible directions (8-way)
const DIRECTIONS: Direction[] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];

// Place words into grid with simple randomized attempts
function placeWords(words: string[], size: number) {
    const grid: (string | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    const placements: { word: string; positions: [number, number][] }[] = [];

    for (const w of words) {
        const len = w.length;
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
            attempts++;
            const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            const endRow = row + dir[0] * (len - 1);
            const endCol = col + dir[1] * (len - 1);
            if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;
            // Check collisions
            let ok = true;
            const pos: [number, number][] = [];
            for (let i = 0; i < len; i++) {
                const r = row + dir[0] * i;
                const c = col + dir[1] * i;
                const cell = grid[r][c];
                if (cell && cell !== w[i]) {
                    ok = false;
                    break;
                }
                pos.push([r, c]);
            }
            if (!ok) continue;
            // place
            for (let i = 0; i < len; i++) {
                const r = row + dir[0] * i;
                const c = col + dir[1] * i;
                grid[r][c] = w[i];
            }
            placements.push({ word: w, positions: pos });
            placed = true;
        }
        if (!placed) {
            return null; // no pudo colocarse
        }
    }

    // Fill nulls
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) grid[r][c] = randLetter();
        }
    }
    return { grid: grid as string[][], placements };
}

const SoupGrid: React.FC<Props> = ({ words, onFound, foundIds, maxSize = 13 }) => {
    // Normalize words to uppercase without spaces
    const cleanWords = useMemo(() => words.map((w) => w.palabra.replace(/\s+/g, '').toUpperCase()), [words]);
    const totalChars = useMemo(() => cleanWords.reduce((s, w) => s + w.length, 0), [cleanWords]);

    // Determine initial size
    const initialSize = Math.min(maxSize, Math.max(6, Math.ceil(Math.sqrt(totalChars) + 2)));

    const [size, setSize] = useState(initialSize);
    const [grid, setGrid] = useState<string[][]>([]);
    const [placements, setPlacements] = useState<{ word: string; positions: [number, number][] }[]>([]);

    // Selected path state
    const [selected, setSelected] = useState<[number, number][]>([]);
    const [wrongFlash, setWrongFlash] = useState<Record<string, boolean>>({});
    const selecting = useRef(false);
    const expectedDir = useRef<Direction | null>(null);

    useEffect(() => {
        // Attempt to place words, if fail increase size until max
        let s = initialSize;
        let result = null;
        while (s <= maxSize && !result) {
            result = placeWords(cleanWords, s);
            if (!result) s++;
        }
        if (!result) {
            // fallback deterministic placement
            const maxWordLen = Math.max(...cleanWords.map((w) => w.length), 3);
            const neededSize = Math.max(maxWordLen + 2, cleanWords.length, maxSize);
            const sizeFb = Math.min(Math.max(neededSize, s), 20); // cap fallback at 20
            const gridFb: string[][] = Array.from({ length: sizeFb }, () => Array.from({ length: sizeFb }, () => randLetter()));
            const placementsFb: { word: string; positions: [number, number][] }[] = [];
            for (let i = 0; i < cleanWords.length; i++) {
                const w = cleanWords[i];
                const row = i % sizeFb;
                const colStart = 0;
                const pos: [number, number][] = [];
                for (let j = 0; j < w.length; j++) {
                    gridFb[row][colStart + j] = w[j];
                    pos.push([row, colStart + j]);
                }
                placementsFb.push({ word: w, positions: pos });
            }
            setGrid(gridFb);
            setPlacements(placementsFb);
            setSize(sizeFb);
        } else {
            setGrid(result.grid);
            setPlacements(result.placements);
            setSize(s);
        }
    }, [cleanWords, initialSize, maxSize]);

    // Check if selection matches any word
    const checkSelected = (sel: [number, number][]) => {
        if (sel.length === 0) return null;

        for (const p of placements) {
            if (p.positions.length !== sel.length) continue;

            // normal
            const normal = p.positions.every(([pr, pc], i) => {
                const [sr, sc] = sel[i];
                return sr === pr && sc === pc;
            });
            if (normal) return p.word;

            // reversed
            const reversed = p.positions.every(([pr, pc], i) => {
                const [sr, sc] = sel[sel.length - 1 - i];
                return sr === pr && sc === pc;
            });
            if (reversed) return p.word;
        }

        return null;
    };

    // On mouse/touch events
    const handleStart = (r: number, c: number) => {
        selecting.current = true;
        setSelected([[r, c]]);
        expectedDir.current = null;
    };

    const handleEnter = (r: number, c: number) => {
        if (!selecting.current) return;
        setSelected((prev) => {
            const last = prev[prev.length - 1];
            if (last && last[0] === r && last[1] === c) return prev;
            if (!last) return [[r, c]];

            const dr = Math.sign(r - last[0]) as number;
            const dc = Math.sign(c - last[1]) as number;

            // must be adjacent
            if (Math.abs(r - last[0]) > 1 || Math.abs(c - last[1]) > 1) return prev;

            // validar dirección permitida
            if (!DIRECTIONS.some(([dR, dC]) => dR === dr && dC === dc)) {
                return prev;
            }

            // si no había dirección definida, fijarla
            if (!expectedDir.current && prev.length >= 1) {
                expectedDir.current = [dr, dc];
            }

            // si ya hay dirección definida, respetarla
            if (expectedDir.current) {
                if (expectedDir.current[0] !== dr || expectedDir.current[1] !== dc) return prev;
            }

            return [...prev, [r, c]];
        });
    };

    const handleEnd = () => {
        selecting.current = false;
        const found = checkSelected(selected);

        if (found) {
            const wordObj = words.find((w) => w.palabra.replace(/\s+/g, '').toUpperCase() === found);
            if (wordObj && !foundIds.has(wordObj.id)) {
                onFound(wordObj);
            }
        } else {
            // flash rojo
            const toFlash: Record<string, boolean> = {};
            selected.forEach(([r, c]) => {
                toFlash[`${r},${c}`] = true;
            });
            setWrongFlash((prev) => ({ ...prev, ...toFlash }));
            setTimeout(() => {
                setWrongFlash((prev) => {
                    const copy = { ...prev };
                    selected.forEach(([r, c]) => {
                        delete copy[`${r},${c}`];
                    });
                    return copy;
                });
            }, 300);
        }
        setSelected([]);
    };

    // Mouse/touch end listener
    useEffect(() => {
        const up = () => {
            if (selecting.current) handleEnd();
        };
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchend', up);
        };
    }, [selected]);

    // Lookup for found words
    const foundPositions = React.useMemo(() => {
        const s = new Set<string>();
        placements.forEach((pl) => {
            const wObj = words.find((w) => w.palabra.replace(/\s+/g, '').toUpperCase() === pl.word);
            if (wObj && foundIds.has(wObj.id)) {
                pl.positions.forEach(([r, c]) => s.add(`${r},${c}`));
            }
        });
        return s;
    }, [placements, words, foundIds]);

    if (grid.length === 0) return <div>Cargando sopa...</div>;

    return (
        <div className="mx-auto w-full max-w-screen-md">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: 8 }}>
                {grid.map((row, r) =>
                    row.map((ch, c) => {
                        const key = `${r},${c}`;
                        const isFound = foundPositions.has(key);
                        const inSelected = selected.some(([sr, sc]) => sr === r && sc === c);
                        const isWrong = !!wrongFlash[key];

                        return (
                            <div
                                key={key}
                                onMouseDown={() => handleStart(r, c)}
                                onMouseEnter={() => handleEnter(r, c)}
                                onTouchStart={() => handleStart(r, c)}
                                onTouchMove={(e) => {
                                    const target = e.touches[0];
                                    const el = document.elementFromPoint(target.clientX, target.clientY) as HTMLElement | null;
                                    if (!el) return;
                                    const idx = el.dataset['pos'];
                                    if (!idx) return;
                                    const [rr, cc] = idx.split(',').map(Number);
                                    handleEnter(rr, cc);
                                }}
                                data-pos={key}
                                className={`flex h-12 transform cursor-pointer items-center justify-center rounded-lg font-mono text-lg font-bold transition-all duration-200 select-none ${
                                    isFound
                                        ? 'scale-110 animate-pulse bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl ring-4 ring-green-300'
                                        : isWrong
                                          ? 'animate-shake bg-red-500 text-white'
                                          : inSelected
                                            ? 'scale-105 bg-blue-400 text-white shadow-lg'
                                            : 'bg-white/80 text-gray-800 hover:scale-105 hover:bg-blue-100'
                                }`}
                                style={{ border: '2px solid rgba(0,0,0,0.1)' }}
                            >
                                {ch}
                            </div>
                        );
                    }),
                )}
            </div>
        </div>
    );
};

export default SoupGrid;
