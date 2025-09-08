import GameLayout from '@/components/game/GameLayout';
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
                        <GameLayout virtualWidth={1200} virtualHeight={600} />
                    </div>
        </AppLayout>
    );
}
