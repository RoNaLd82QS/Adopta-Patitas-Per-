import { Animal } from "@/lib/types";

export const animals: Animal[] = [
  {
    id: "1",
    slug: "luna",
    nombre: "Luna",
    especie: "perro",
    sexo: "hembra",
    edadMeses: 18,
    tamanio: "mediano",
    actividad: "media",
    ciudad: "Lima",
    fotos: ["https://placedog.net/800/520?id=101"],
    historia: "Rescatada, muy cariñosa y sociable con otros perritos.",
    esterilizado: true,
    vacunado: true,
  },
  {
    id: "2",
    slug: "max",
    nombre: "Max",
    especie: "perro",
    sexo: "macho",
    edadMeses: 8,
    tamanio: "pequeño",
    actividad: "alta",
    ciudad: "Lima",
    fotos: ["https://placedog.net/800/520?id=102"],
    historia: "Cachorro juguetón; ideal para familia activa.",
    vacunado: true,
  },
  {
    id: "3",
    slug: "mishi",
    nombre: "Mishi",
    especie: "gato",
    sexo: "hembra",
    edadMeses: 24,
    tamanio: "pequeño",
    actividad: "baja",
    ciudad: "Callao",
    fotos: ["https://placekitten.com/800/520"],
    historia: "Gatita tranquila, le encantan las siestas al sol.",
    esterilizado: true,
  },
];

export function edadHumana(edadMeses: number) {
  const años = Math.floor(edadMeses / 12);
  const meses = edadMeses % 12;
  if (años === 0) return `${meses} mes(es)`;
  if (meses === 0) return `${años} año(s)`;
  return `${años} año(s) ${meses} mes(es)`;
}
