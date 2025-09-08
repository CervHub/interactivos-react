import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { games } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Games',
        href: games().url,
    },
];

export default function Games() {
    const gameList = [
        { id: 1, name: 'Slot', description: 'Descripción de Slot' },
        { id: 2, name: 'Juego', description: 'Descripción del Juego' },
        { id: 3, name: 'Juego', description: 'Descripción del Juego' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Games" />

            <div>
                <h1 className="text-2xl font-bold mb-4">Lista de Juegos</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {gameList.map((game) => (
                        <div
                            key={game.id}
                            className="p-4 border rounded shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold">{game.name}</h2>
                            <p className="text-gray-600">{game.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
