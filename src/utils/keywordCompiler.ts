import { GenreType } from '../types';

export interface CompiledKeywords {
  allKeywords: string[];
  identityKeywords: string[];
  physicalKeywords: string[];
  costumesKeywords: string[];
  propsKeywords: string[];
  environmentKeywords: string[];
  cameraLightingKeywords: string[];
  physicalTraitsCommaSeparated: string;
  costumesCommaSeparated: string;
  propsAttireCommaSeparated: string;
  masterPrompt: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  sdxlPositivePrompt: string;
  sdxlNegativePrompt: string;
  rawCommaSeparated: string;
}

export interface CompilerInputs {
  characterName: string;
  genre: GenreType;
  role: string;
  selectedProps: string[];
  selectedCostumes?: string[];
  selectedTraits: Record<string, string[]>;
  customTraits: Record<string, string[]>;
  style: string;
  lighting: string;
  cameraFraming: string;
  aspectRatio: string;
  mood: string;
  environment: string;
}

export function compileKeywords(inputs: CompilerInputs): CompiledKeywords {
  const {
    characterName,
    genre,
    role,
    selectedProps,
    selectedCostumes = [],
    selectedTraits,
    customTraits,
    style,
    lighting,
    cameraFraming,
    aspectRatio,
    mood,
    environment,
  } = inputs;

  // 1. Identity Keywords
  const identityKeywords: string[] = [
    `cinematic portrait of ${characterName || 'a character'}`,
    `${genre} genre aesthetic`,
    `${role} archetype`,
    `${mood} atmosphere`,
  ];

  // 2. Physical & Anatomical Keywords
  const physicalKeywords: string[] = [];
  Object.entries(selectedTraits).forEach(([_, traits]) => {
    if (Array.isArray(traits)) {
      traits.forEach((t) => {
        if (t && t.trim()) physicalKeywords.push(t.trim());
      });
    }
  });
  Object.entries(customTraits).forEach(([_, traits]) => {
    if (Array.isArray(traits)) {
      traits.forEach((t) => {
        if (t && t.trim()) physicalKeywords.push(t.trim());
      });
    }
  });

  // 3. Costumes & Wardrobe Keywords
  const costumesKeywords: string[] = selectedCostumes.map((c) => c.trim()).filter(Boolean);

  // 4. Props & Equipment Keywords
  const propsKeywords: string[] = selectedProps.map((p) => p.trim()).filter(Boolean);

  // 5. Environment & Setting Keywords
  const environmentKeywords: string[] = environment
    ? [environment.trim()]
    : [`detailed ${genre.toLowerCase()} environment background`];

  // 6. Optics, Lighting, and Camera Framing
  const cameraLightingKeywords: string[] = [
    cameraFraming,
    lighting,
    `${style} rendering aesthetic`,
    'photorealistic depth of field',
    'volumetric atmosphere',
    'hyper-detailed textures',
    'subsurface scattering',
    '35mm film photography grain',
    '8k resolution',
    'masterpiece',
  ].filter(Boolean);

  // Combine into All Keywords list
  const allKeywords: string[] = [
    ...identityKeywords,
    ...physicalKeywords,
    ...costumesKeywords,
    ...propsKeywords,
    ...environmentKeywords,
    ...cameraLightingKeywords,
  ];

  const rawCommaSeparated = allKeywords.join(', ');
  const physicalTraitsCommaSeparated = physicalKeywords.join(', ');
  const costumesCommaSeparated = costumesKeywords.join(', ');
  const propsAttireCommaSeparated = propsKeywords.join(', ');

  // Master Prompt
  const masterPrompt = [
    `A cinematic ${style} character portrait of ${characterName ? `"${characterName}", ` : ''}a ${role} in a ${genre} universe.`,
    physicalKeywords.length > 0 ? `Physical appearance: ${physicalKeywords.join(', ')}.` : '',
    costumesKeywords.length > 0 ? `Wardrobe and attire: wearing ${costumesKeywords.join(', ')}.` : '',
    propsKeywords.length > 0 ? `Equipped weapons and gear: carrying ${propsKeywords.join(', ')}.` : '',
    `Environment and setting: ${environmentKeywords.join(', ')}.`,
    `Atmosphere and optics: ${mood} mood, ${lighting}, ${cameraFraming}, shot on 35mm cinematic lens, high dynamic range, intricate details, photorealistic lighting.`,
  ]
    .filter(Boolean)
    .join(' ');

  // Midjourney Prompt
  const cleanAspect = aspectRatio ? aspectRatio.replace(/^--ar\s+/, '') : '16:9';
  const midjourneyKeywords = [
    `cinematic shot of a ${role}`,
    `${genre} aesthetic`,
    ...physicalKeywords,
    costumesKeywords.length > 0 ? `wearing ${costumesKeywords.join(', ')}` : '',
    propsKeywords.length > 0 ? `equipped with ${propsKeywords.join(', ')}` : '',
    environmentKeywords.join(', '),
    lighting,
    cameraFraming,
    `${mood} mood`,
    '35mm photography',
    'cinestill 800t',
    'hyperrealistic',
    'detailed skin texture',
    'octane render',
    'unreal engine 5',
  ]
    .filter(Boolean)
    .join(', ');
  const midjourneyPrompt = `/imagine prompt: ${midjourneyKeywords} --ar ${cleanAspect} --v 6.1 --style raw`;

  // Flux.1 Prompt
  const fluxPrompt = [
    `A high-fidelity photograph of ${characterName || `a ${role}`}, a ${genre} character.`,
    physicalKeywords.length > 0 ? `The subject has ${physicalKeywords.join(', ')}.` : '',
    costumesKeywords.length > 0 ? `They are dressed in ${costumesKeywords.join(', ')}.` : '',
    propsKeywords.length > 0 ? `They are equipped with ${propsKeywords.join(', ')}.` : '',
    `Set in ${environmentKeywords.join(', ')}.`,
    `Atmosphere: ${mood} mood, ${lighting}, ${cameraFraming}. Extremely crisp details, lifelike eyes and skin, natural shadows, volumetric depth, professional cinema grading.`,
  ]
    .filter(Boolean)
    .join(' ');

  // SDXL Positive Prompt
  const sdxlPositivePrompt = [
    `score_9, score_8_up, score_7_up`,
    `1person, solo, ${role.toLowerCase()}, ${genre.toLowerCase()}`,
    ...physicalKeywords.map((t) => t.toLowerCase()),
    ...costumesKeywords.map((c) => c.toLowerCase()),
    ...propsKeywords.map((p) => p.toLowerCase()),
    environmentKeywords.join(', ').toLowerCase(),
    lighting.toLowerCase(),
    cameraFraming.toLowerCase(),
    `masterpiece, highly detailed, photorealistic, 8k uhd, sharp focus, volumetric lighting, dslr quality`,
  ]
    .filter(Boolean)
    .join(', ');

  // SDXL Negative Prompt
  const sdxlNegativePrompt =
    'score_4, score_5, score_6, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, mutated hands, poorly drawn face, disfigured, deformed, cloned face';

  return {
    allKeywords,
    identityKeywords,
    physicalKeywords,
    costumesKeywords,
    propsKeywords,
    environmentKeywords,
    cameraLightingKeywords,
    physicalTraitsCommaSeparated,
    costumesCommaSeparated,
    propsAttireCommaSeparated,
    masterPrompt,
    midjourneyPrompt,
    fluxPrompt,
    sdxlPositivePrompt,
    sdxlNegativePrompt,
    rawCommaSeparated,
  };
}
