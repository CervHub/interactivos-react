// Datos simulados para el juego de clasificación
export type ImagenData = {
    id: number;
    url: string;
    descripcion: string;
    grupo: string;
};

export const mockImagenes: ImagenData[] = [
    { id: 1, url: '/img/img1.png', descripcion: 'No siguió procedimiento', grupo: 'A' },
    { id: 2, url: '/img/img2.png', descripcion: 'Fracturas', grupo: 'A' },
    { id: 3, url: '/img/img3.png', descripcion: 'Golpes', grupo: 'A' },
    { id: 4, url: '/img/img4.png', descripcion: 'Pala rota', grupo: 'A' },
    { id: 5, url: '/img/img5.png', descripcion: 'No usa EPP', grupo: 'B' },
    { id: 6, url: '/img/img6.png', descripcion: 'Pérdida de producción', grupo: 'B' },
    { id: 7, url: '/img/img7.png', descripcion: 'Usa herramientas hechizas', grupo: 'B' },
    { id: 8, url: '/img/img8.png', descripcion: 'Opera equipo sin autorización', grupo: 'B' },
    //{ id: 9, url: '/img/img9.png', descripcion: 'Otro', grupo: 'C' },
];

export const grupos = [
    { key: 'A', titulo: 'Grupo A', color: '#FFD34E' }, // amarillo
    { key: 'B', titulo: 'Grupo B', color: '#FF6B6B' }, // rojo
   // { key: 'C', titulo: 'Grupo C', color: '#73c742ff' } // verde
];
