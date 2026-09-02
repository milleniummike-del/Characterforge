export type GenreType =
  | 'Action'
  | 'Sci-Fi'
  | 'Fantasy'
  | 'Horror'
  | 'Noir'
  | 'Western'
  | 'Cyberpunk'
  | 'Steampunk'
  | 'Space Opera'
  | 'Post-Apoc'
  | 'Adventure'
  | 'Thriller'
  | 'Historical'
  | 'Superhero'
  | 'War'
  | 'Mystery'
  | 'Musical'
  | 'Samurai'
  | 'Cosmic Horror'
  | 'Solar Punk';

export interface VisualStyle {
  id: string;
  label: string;
  iconName?: string;
  prompt_snippet: string;
  description: string;
}

export interface CharacterOutfitEnsemble {
  id: string;
  themeType: 'signature' | 'stealth' | 'formal' | 'heavy' | 'downtime';
  themeBadge: string;
  label: string;
  text: string;
  description: string;
}

export interface TraitItem {
  label: string;
  text: string;
  isCustom?: boolean;
}

export interface CharacterSubBlock {
  id: string;
  type: 'genre' | 'role' | 'traits' | 'environment' | 'props' | 'costumes' | 'style';
  label: string;
  text: string;
  category?: string;
  isCustom?: boolean;
  createdAt: number;
}

export interface CharacterInputs {
  id?: string;
  name: string;
  genre: GenreType;
  role: string;
  props: string[];
  costumes?: string[];
  selectedTraits: Record<string, string[]>; // categoryKey -> array of trait texts
  customTraits: Record<string, string[]>; // categoryKey -> array of custom trait texts
  environment: string;
  style: string;
  lighting?: string;
  cameraFraming?: string;
  aspectRatio?: string;
  mood?: string;
}

export interface SynthesizedPersona {
  masterPrompt: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  sdxlPrompt: {
    positive: string;
    negative: string;
  };
  soraVideoPrompt: string;
  characterProfile: {
    name: string;
    aliasOrTitle?: string;
    tagline: string;
    backstory: string;
    psychologicalProfile: string;
    keyMotivation: string;
    signatureCatchphrase: string;
    visualPalette: string[];
    costumeBreakdown: string[];
  };
  tokenCount: number;
  generatedAt: number;
  imageUrl?: string;
}

export interface PresetCharacter {
  id: string;
  name: string;
  tagline: string;
  genre: GenreType;
  role: string;
  style: string;
  environment: string;
  props: string[];
  costumes?: string[];
  outfitEnsembles?: CharacterOutfitEnsemble[];
  selectedTraits: Record<string, string[]>;
}
