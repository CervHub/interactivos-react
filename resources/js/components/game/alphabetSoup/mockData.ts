export type SoupWord = {
  id: number;
  palabra: string;
  significado: string;
};

export const soupData = {
  titulo: 'Sopa de Letras - Animales',
  descripcion:
    'Encuentra todas las palabras escondidas en la sopa de letras. Cada vez que descubras una, aprenderás su significado.',
  palabras: [
    { id: 1, palabra: 'ELEFANTE', significado: 'Mamífero terrestre de gran tamaño con trompa.' },
    { id: 2, palabra: 'LEON', significado: 'Felino carnívoro conocido como el rey de la selva.' },
    { id: 3, palabra: 'DELFIN', significado: 'Mamífero marino muy inteligente que vive en grupos sociales.' },
  ] as SoupWord[],
};

export default soupData;
