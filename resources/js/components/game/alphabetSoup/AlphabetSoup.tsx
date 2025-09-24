import React, { useMemo, useState } from 'react';
import soupData, { SoupWord } from './mockData';
import SoupGrid from './SoupGrid';
import WordItem from './WordItem';
import Feedback from './Feedback';
import WordModal from './WordModal';

const AlphabetSoup: React.FC = () => {
  const { titulo, descripcion, palabras } = soupData;
  const [foundIds, setFoundIds] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<string | undefined>(undefined);

  const total = palabras.length;

  const handleFound = (w: SoupWord) => {
    setFoundIds(prev => new Set(prev).add(w.id));
    setMessage(`${w.palabra}: ${w.significado}`);
    setModal({ open: true, word: w.palabra, meaning: w.significado });
  };

  const [modal, setModal] = useState<{ open: boolean; word?: string; meaning?: string }>({ open: false });

  const closeModal = () => {
    setModal({ open: false });
    setMessage(undefined);
  };

  const score = foundIds.size;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{titulo}</h2>
      <p className="mb-4 text-gray-700">{descripcion}</p>

      <div className="mb-6 relative">
        <SoupGrid words={palabras} onFound={handleFound} foundIds={foundIds} />
        <WordModal open={modal.open} word={modal.word} meaning={modal.meaning} onClose={closeModal} />
      </div>

      <div className="flex gap-3 items-center flex-wrap mb-8">
        {palabras.map(w => (
          <WordItem key={w.id} word={w} found={foundIds.has(w.id)} />
        ))}
      </div>

  <Feedback message={message} score={score} total={total} />
    </div>
  );
};

export default AlphabetSoup;
