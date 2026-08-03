/**
 * Ícone coerente por nicho, a partir do nome da categoria (texto livre,
 * cadastrado no admin). Heurística por palavra-chave — só existe pra dar um
 * toque de reconhecimento visual rápido; nunca é a única forma de
 * identificar a categoria, por isso um fallback genérico é seguro.
 */
const ICON_RULES: [RegExp, string][] = [
  [/cafe|confeitar|doce|padaria|bolo/i, "☕"],
  [/academia|fitness|treino|esporte|corrida/i, "🏋️"],
  [/beleza|moda|maquiagem|est[ée]tica|cabelo/i, "💄"],
  [/im[oó]v|corretor|casa|apartamento/i, "🏡"],
  [/venda|promo[cç][aã]o|black friday|desconto/i, "🏷️"],
  [/data|comemorat|natal|p[aá]scoa|festa|anivers[aá]rio/i, "🎉"],
  [/frase|cita[cç][aã]o|motivacional/i, "💬"],
  [/pet|animal|cachorro|gato/i, "🐾"],
  [/viagem|turismo/i, "✈️"],
  [/comida|gastronom|restaurante|culin[aá]ria/i, "🍽️"],
  [/m[uú]sica|show|festival/i, "🎵"],
  [/tecnologia|tech|digital/i, "💻"],
  [/sa[uú]de|bem-estar|wellness|yoga/i, "🧘"],
  [/infantil|crian[cç]a|kids|beb[eê]/i, "🧸"],
  [/casamento|noiv/i, "💍"],
  [/vinho|bebida|drink|bar/i, "🍷"],
];

export function categoryIcon(name: string): string {
  for (const [pattern, icon] of ICON_RULES) {
    if (pattern.test(name)) return icon;
  }
  return "✨";
}
