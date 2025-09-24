import React from 'react';
import { SoupWord } from './mockData';

interface Props {
    word: SoupWord;
    found: boolean;
}

const WordItem: React.FC<Props> = ({ word, found }) => (
    <div
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${found ? 'scale-105 bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-800'} `}
    >
        {found ? '✅' : '🔍'} {word.palabra}
    </div>
);

export default WordItem;
