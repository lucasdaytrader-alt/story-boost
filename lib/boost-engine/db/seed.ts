/**
 * Boost Engine — Seed de dados fictícios
 *
 * Popula o banco com um catálogo realista para o produto Story Boost®,
 * permitindo navegar por toda a experiência (Home, Busca, Categorias, Packs,
 * Favoritos, Relacionados) como se fosse produção.
 */

import { runMigrations } from "./migrate";
import { db } from "./client";
import { hashPassword } from "../services/password";
import {
  products,
  categories,
  tags,
  digitalAssets,
  assetTags,
  packs,
  packAssets,
  packRelations,
  users,
  devices,
  entitlements,
  favorites,
  analyticsEvents,
} from "./schema";

const now = Date.now();
const uid = () => crypto.randomUUID();

// Placeholder de imagem determinístico por "seed" (serviço público de imagens).
const preview = (seedName: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seedName)}/600/720`;
const cover = (seedName: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seedName)}/800/400`;

async function seed() {
  runMigrations();

  console.log("🌱 Iniciando seed...");

  // ---- Product ------------------------------------------------------------
  const storyBoostId = uid();
  await db.insert(products).values({
    id: storyBoostId,
    slug: "story-boost",
    name: "Story Boost",
    createdAt: now,
  });

  // ---- Categories -----------------------------------------------------------
  const categoryDefs = [
    { key: "cafeteria", name: "Cafeteria e confeitaria" },
    { key: "datas", name: "Datas comemorativas" },
    { key: "vendas", name: "Vendas e promoções" },
    { key: "frases", name: "Frases e citações" },
    { key: "moda", name: "Moda e beleza" },
    { key: "imoveis", name: "Corretores de imóveis" },
    { key: "fitness", name: "Fitness e academia" },
    { key: "estetica", name: "Clínicas e estética" },
  ];
  const categoryIds: Record<string, string> = {};
  for (const [i, c] of categoryDefs.entries()) {
    const id = uid();
    categoryIds[c.key] = id;
    await db.insert(categories).values({
      id,
      productId: storyBoostId,
      name: c.name,
      slug: c.key,
      sortOrder: i,
    });
  }

  // ---- Tags -------------------------------------------------------------
  const tagNames = [
    "cafeteria", "doce", "manha", "aconchegante", "promocao", "blackfriday",
    "natal", "pascoa", "moda", "autoestima", "frase", "motivacional",
    "restaurante", "delivery", "padaria", "sextou", "vendas", "fimdesemana",
    "imoveis", "corretor", "fitness", "academia", "saude", "estetica",
  ];
  const tagIds: Record<string, string> = {};
  for (const name of tagNames) {
    const id = uid();
    tagIds[name] = id;
    await db.insert(tags).values({ id, name });
  }

  // ---- Helper: cria um asset já vinculado a tags -------------------------
  async function createAsset(opts: {
    name: string;
    categoryKey: string;
    tagNames: string[];
    isNew?: boolean;
    usageCount?: number;
  }) {
    const id = uid();
    await db.insert(digitalAssets).values({
      id,
      productId: storyBoostId,
      categoryId: categoryIds[opts.categoryKey],
      type: "sticker",
      name: opts.name,
      previewUrl: preview(opts.name),
      fileUrl: preview(opts.name),
      isNew: opts.isNew ?? false,
      usageCount: opts.usageCount ?? Math.floor(Math.random() * 500),
      createdAt: now,
    });
    for (const t of opts.tagNames) {
      if (!tagIds[t]) continue;
      await db.insert(assetTags).values({ assetId: id, tagId: tagIds[t] });
    }
    return id;
  }

  // ---- Helper: cria um pack completo com assets --------------------------
  async function createPack(opts: {
    name: string;
    categoryKey: string;
    description: string;
    isPremium?: boolean;
    isFeatured?: boolean;
    priceCents?: number;
    assetSpecs: { name: string; tagNames: string[]; isNew?: boolean }[];
  }) {
    const packId = uid();
    await db.insert(packs).values({
      id: packId,
      productId: storyBoostId,
      categoryId: categoryIds[opts.categoryKey],
      slug: opts.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos (á, ã, ç, etc.)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      name: opts.name,
      description: opts.description,
      coverUrl: cover(opts.name),
      isPremium: opts.isPremium ?? false,
      isFeatured: opts.isFeatured ?? false,
      priceCents: opts.priceCents,
      createdAt: now,
      updatedAt: now,
    });

    let order = 0;
    const assetIds: string[] = [];
    for (const spec of opts.assetSpecs) {
      const assetId = await createAsset({
        name: spec.name,
        categoryKey: opts.categoryKey,
        tagNames: spec.tagNames,
        isNew: spec.isNew,
      });
      await db
        .insert(packAssets)
        .values({ packId, assetId, sortOrder: order++ });
      assetIds.push(assetId);
    }
    return { packId, assetIds };
  }

  // ---- Packs --------------------------------------------------------------
  const cafeteria = await createPack({
    name: "Cafeteria e confeitaria",
    categoryKey: "cafeteria",
    description: "Adesivos para quem vive do café e do doce.",
    isFeatured: true,
    assetSpecs: [
      { name: "Xícara de café fumegante", tagNames: ["cafeteria", "manha", "aconchegante"], isNew: true },
      { name: "Bolo de chocolate fatiado", tagNames: ["doce", "cafeteria"] },
      { name: "Grãos de café espalhados", tagNames: ["cafeteria"] },
      { name: "Croissant amanteigado", tagNames: ["cafeteria", "manha"], isNew: true },
      { name: "Latte art coração", tagNames: ["cafeteria", "aconchegante"] },
      { name: "Cupcake com cobertura rosa", tagNames: ["doce", "cafeteria"] },
      { name: "Placa 'aberto' de cafeteria", tagNames: ["cafeteria", "restaurante"] },
      { name: "Pão de mel artesanal", tagNames: ["doce", "cafeteria"] },
    ],
  });

  const cafeManha = await createPack({
    name: "Café da manhã",
    categoryKey: "cafeteria",
    description: "Comece o dia com Stories aconchegantes.",
    assetSpecs: [
      { name: "Mesa de café da manhã completa", tagNames: ["manha", "aconchegante"] },
      { name: "Suco de laranja natural", tagNames: ["manha"] },
      { name: "Pão na chapa", tagNames: ["manha", "cafeteria"] },
      { name: "Frase bom dia manuscrita", tagNames: ["manha", "frase"] },
      { name: "Ovos mexidos no prato", tagNames: ["manha"] },
      { name: "Panqueca com mel escorrendo", tagNames: ["doce", "manha"], isNew: true },
    ],
  });

  const blackFriday = await createPack({
    name: "Black Friday 2026",
    categoryKey: "vendas",
    description: "Pacote sazonal para a maior campanha de vendas do ano.",
    isFeatured: true,
    assetSpecs: [
      { name: "Selo 50% OFF explosivo", tagNames: ["promocao", "blackfriday", "vendas"], isNew: true },
      { name: "Contagem regressiva Black Friday", tagNames: ["blackfriday", "promocao"], isNew: true },
      { name: "Sacola de compras estourando", tagNames: ["vendas", "promocao"] },
      { name: "Selo 'últimas unidades'", tagNames: ["vendas", "promocao"] },
      { name: "Faixa 'frete grátis'", tagNames: ["vendas", "delivery"] },
    ],
  });

  const promoRelampago = await createPack({
    name: "Promoções relâmpago",
    categoryKey: "vendas",
    description: "Para ofertas rápidas de fim de semana.",
    assetSpecs: [
      { name: "Relâmpago amarelo de oferta", tagNames: ["promocao", "vendas"] },
      { name: "Selo 'só hoje'", tagNames: ["promocao", "fimdesemana"] },
      { name: "Banner sextou com desconto", tagNames: ["sextou", "promocao", "fimdesemana"], isNew: true },
      { name: "Cronômetro de oferta expirando", tagNames: ["promocao", "vendas"] },
    ],
  });

  const frasesMotivacionais = await createPack({
    name: "Frases motivacionais",
    categoryKey: "frases",
    description: "Textos prontos para inspirar sua audiência.",
    isFeatured: true,
    assetSpecs: [
      { name: "Frase 'confie no processo'", tagNames: ["frase", "motivacional"] },
      { name: "Frase 'faça acontecer'", tagNames: ["frase", "motivacional"] },
      { name: "Citação sobre recomeços", tagNames: ["frase", "motivacional"] },
      { name: "Frase 'acredite em você'", tagNames: ["frase", "motivacional", "autoestima"] },
    ],
  });

  const natal = await createPack({
    name: "Natal",
    categoryKey: "datas",
    description: "Clima natalino para encantar seus clientes.",
    assetSpecs: [
      { name: "Guirlanda natalina dourada", tagNames: ["natal"], isNew: true },
      { name: "Papai Noel simpático", tagNames: ["natal"] },
      { name: "Presente embrulhado com laço", tagNames: ["natal"] },
      { name: "Frase 'feliz natal' manuscrita", tagNames: ["natal", "frase"] },
      { name: "Pinheirinho decorado", tagNames: ["natal"] },
    ],
  });

  const modaBeleza = await createPack({
    name: "Moda e beleza essentials",
    categoryKey: "moda",
    description: "Pack premium para lojas de moda e clínicas de estética.",
    isPremium: true,
    priceCents: 990,
    assetSpecs: [
      { name: "Batom vermelho elegante", tagNames: ["moda", "autoestima"] },
      { name: "Vitrine de loja de roupas", tagNames: ["moda"] },
      { name: "Frase 'se cuide hoje'", tagNames: ["autoestima", "frase"] },
      { name: "Paleta de maquiagem aberta", tagNames: ["moda"] },
    ],
  });

  const padariasDelivery = await createPack({
    name: "Padarias e delivery",
    categoryKey: "cafeteria",
    description: "Para quem vende comida e entrega em domicílio.",
    assetSpecs: [
      { name: "Moto de entrega a caminho", tagNames: ["delivery", "restaurante"] },
      { name: "Caixa de delivery fechada", tagNames: ["delivery"] },
      { name: "Pão francês fresquinho", tagNames: ["padaria", "cafeteria"] },
      { name: "Selo 'peça já' delivery", tagNames: ["delivery", "promocao"], isNew: true },
    ],
  });

  const imoveis = await createPack({
    name: "Corretores de imóveis",
    categoryKey: "imoveis",
    description: "Anuncie e feche negócios com Stories profissionais.",
    isFeatured: true,
    assetSpecs: [
      { name: "Selo 'imóvel disponível'", tagNames: ["imoveis", "corretor"], isNew: true },
      { name: "Chave dourada de casa nova", tagNames: ["imoveis"] },
      { name: "Planta baixa estilizada", tagNames: ["imoveis", "corretor"] },
      { name: "Selo 'agende sua visita'", tagNames: ["imoveis", "vendas"] },
      { name: "Fachada de casa moderna", tagNames: ["imoveis"] },
    ],
  });

  const fitnessAcademia = await createPack({
    name: "Fitness e academia",
    categoryKey: "fitness",
    description: "Motive seus alunos e divulgue resultados.",
    assetSpecs: [
      { name: "Halteres cruzados", tagNames: ["fitness", "academia"] },
      { name: "Selo 'aula experimental grátis'", tagNames: ["fitness", "promocao"], isNew: true },
      { name: "Frase 'foco e disciplina'", tagNames: ["fitness", "motivacional", "frase"] },
      { name: "Tênis de treino", tagNames: ["fitness"] },
      { name: "Cronômetro de treino", tagNames: ["fitness", "academia"] },
    ],
  });

  const clinicasEstetica = await createPack({
    name: "Clínicas e estética",
    categoryKey: "estetica",
    description: "Para clínicas de estética e profissionais da beleza.",
    isPremium: true,
    priceCents: 1290,
    assetSpecs: [
      { name: "Selo 'agende sua avaliação'", tagNames: ["estetica", "saude"], isNew: true },
      { name: "Frase 'sua pele merece cuidado'", tagNames: ["estetica", "autoestima", "frase"] },
      { name: "Ícone de skincare com folhas", tagNames: ["estetica", "saude"] },
      { name: "Selo 'antes e depois'", tagNames: ["estetica"] },
    ],
  });


  const relate = async (a: string, b: string) => {
    await db.insert(packRelations).values({ packId: a, relatedPackId: b, source: "manual", sortOrder: 0 });
    await db.insert(packRelations).values({ packId: b, relatedPackId: a, source: "manual", sortOrder: 0 });
  };
  await relate(cafeteria.packId, cafeManha.packId);
  await relate(cafeteria.packId, padariasDelivery.packId);
  await relate(cafeteria.packId, promoRelampago.packId);
  await relate(blackFriday.packId, promoRelampago.packId);
  await relate(natal.packId, frasesMotivacionais.packId);
  await relate(fitnessAcademia.packId, clinicasEstetica.packId);
  await relate(imoveis.packId, modaBeleza.packId);

  // ---- Usuários de teste ----------------------------------------------------
  const ana = uid();
  const joao = uid();
  await db.insert(users).values([
    {
      id: ana,
      email: "ana@teste.com",
      name: "Ana Ribeiro",
      authProvider: "email",
      passwordHash: hashPassword("ana123456"),
      isAdmin: true,
      createdAt: now,
    },
    {
      id: joao,
      email: "joao@teste.com",
      name: "João Pereira",
      authProvider: "email",
      passwordHash: hashPassword("joao123456"),
      isAdmin: false,
      createdAt: now,
    },
  ]);

  // ---- Devices (para telas de Perfil/Configurações) --------------------------
  await db.insert(devices).values([
    { id: uid(), userId: ana, sessionToken: uid(), deviceModel: "iPhone 15", os: "iOS 18", approxLocation: "Joinville, BR", lastAccessAt: now, createdAt: now },
  ]);

  // ---- Entitlements (ADR-003: sempre ativo, sem gateway ainda) -------------
  await db.insert(entitlements).values([
    { id: uid(), userId: ana, productId: storyBoostId, status: "active", source: "stub", grantedAt: now },
    { id: uid(), userId: joao, productId: storyBoostId, status: "active", source: "stub", grantedAt: now },
  ]);

  // ---- Favorites ------------------------------------------------------------
  const favAssets = [
    cafeteria.assetIds[0],
    cafeteria.assetIds[3],
    blackFriday.assetIds[0],
    frasesMotivacionais.assetIds[1],
  ];
  for (const assetId of favAssets) {
    await db.insert(favorites).values({ userId: ana, assetId, createdAt: now });
  }

  // ---- Analytics de exemplo (inclui uma busca sem resultado) ----------------
  await db.insert(analyticsEvents).values([
    { id: uid(), userId: ana, productId: storyBoostId, eventType: "search", query: "cafeteria", createdAt: now },
    { id: uid(), userId: ana, productId: storyBoostId, eventType: "search", query: "sextou", createdAt: now },
    { id: uid(), userId: joao, productId: storyBoostId, eventType: "search", query: "halloween assombrado", createdAt: now },
    { id: uid(), userId: ana, productId: storyBoostId, eventType: "use_in_story", entityType: "asset", entityId: cafeteria.assetIds[0], createdAt: now },
  ]);

  console.log("✅ Seed concluído:");
  console.log(`   - 1 produto (Story Boost)`);
  console.log(`   - ${categoryDefs.length} categorias`);
  console.log(`   - ${tagNames.length} tags`);
  console.log(`   - 11 packs`);
  console.log(`   - 2 usuários de teste (ana@teste.com, joao@teste.com)`);
  console.log(`   - favoritos e relacionados configurados`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  });
