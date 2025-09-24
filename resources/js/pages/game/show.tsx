import AlphabetSoup from '@/components/game/alphabetSoup/AlphabetSoup';
import GameLayout from '@/components/game/GameLayout';
import ImageBoard from '@/components/game/ImageBoard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Slots',
        href: '/games/slots',
    },
];

export default function Slots() {
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Slots" />

                    {/* Contenido principal: GameLayout maneja el canvas y UI del juego */}
                    <div>
                        {/* <ImageBoard /> */}
                        <AlphabetSoup />
                    </div>
        </AppLayout>
    );
}
