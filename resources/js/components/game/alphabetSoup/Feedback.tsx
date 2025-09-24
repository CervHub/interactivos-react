import React from 'react';

interface Props {
  message?: string;
  score: number;
  total: number;
}

const Feedback: React.FC<Props> = ({ message, score, total }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
    {message && (
      <div className="rounded shadow-lg bg-white px-6 py-3 text-center text-sm font-semibold text-gray-800">
        {message}
      </div>
    )}
    <div className="rounded-full bg-white/90 px-4 py-2 font-bold shadow">Puntaje: {score} / {total}</div>
  </div>
);

export default Feedback;
