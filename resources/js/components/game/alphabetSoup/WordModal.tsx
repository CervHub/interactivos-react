import React from 'react';

interface Props {
    open: boolean;
    word?: string;
    meaning?: string;
    onClose: () => void;
}

const WordModal: React.FC<Props> = ({ open, word, meaning, onClose }) => {
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;
    // Compact modal without full-screen dark backdrop; designed to sit inside a relative container
    return (
        <div className="absolute top-6 left-1/2 z-50 w-full max-w-lg -translate-x-1/2">
            <div className="animate-zoomIn rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-green-600">
                        🎉 ¡Correcto! <span>{word}</span>
                    </h3>
                    <button className="text-gray-500 transition hover:text-gray-800" onClick={onClose}>
                        ✖
                    </button>
                </div>
                <p className="mt-3 text-gray-700">{meaning}</p>
                <div className="mt-5 flex justify-end">
                    <button onClick={onClose} className="rounded-lg bg-green-600 px-5 py-2 text-white shadow-md transition hover:bg-green-700">
                        Seguir jugando 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WordModal;
