import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { GenreRoleSelector } from './components/GenreRoleSelector';
import { PropsAttireSelector } from './components/PropsAttireSelector';
import { CostumeWardrobeSelector } from './components/CostumeWardrobeSelector';
import { PhysicalTraitsAccordion } from './components/PhysicalTraitsAccordion';
import { EnvironmentStyleSelector } from './components/EnvironmentStyleSelector';
import { KeywordsOutputPanel } from './components/KeywordsOutputPanel';
import { BlockLibraryModal } from './components/BlockLibraryModal';
import {
  GenreType,
  PresetCharacter,
  CharacterSubBlock,
} from './types';
import {
  GENRES,
  ROLES_BY_GENRE,
  PHYSICAL_TRAITS,
  DEFAULT_PRESETS,
  VISUAL_STYLES,
  getPropsForRole,
  LIGHTING_MODIFIERS,
  CAMERA_FRAMING_OPTIONS,
  MOOD_OPTIONS,
  ENVIRONMENT_PRESETS,
} from './data/taxonomy';
import { GENRE_FULL_ENSEMBLES, getCharacterFiveEnsembles } from './data/costumes';
import { compileKeywords, CompilerInputs } from './utils/keywordCompiler';

const STORAGE_KEY_BLOCKS = 'character_forge_saved_blocks_v2';

const RANDOM_CHARACTER_NAMES = [
  'Kira "Null" Takahashi',
  'Vaelen Starweaver',
  'Maya "Sunburst" Solis',
  'Vincent "Jack" Callahan',
  'Elena Rostova',
  'Zephyr Cruz',
  'Cassian Drake',
  'Lyra Vance',
  'Jaxson "Rook" Thorne',
  'Aria Thorne',
  'Dmitri Volkov',
  'Silas Blackwood',
  'Naomi Chen',
  'Tariq Al-Mansoor',
  'Freja Lindqvist',
  'Caius Valerius',
  'Morrigan Crow',
  'Dorian Grayling',
  'Renzo "Ghost" Minato',
  'Siobhan O\'Connor',
  'Thorne Ironbreaker',
  'Astrid Silverblade',
  'Malik Sterling',
  'Nova Vance',
  'Kaelen Shadowmend',
  'Zara Sterling',
  'Gideon Cross',
  'Isolde Nightshade',
  'Corvus Blackthorn',
  'Nyx Everhart',
  'Harlan "Deadeye" Vance',
  'Jarek Stone',
  'Seraphina Voss',
  'Ragnar Bloodaxe',
  'Leonidas Vance',
  'Junpei Tanaka',
  'Amara Khan',
  'Ezekiel Vance',
  'Sora Midori',
  'Rowan Ashford',
];

export default function App() {
  // Primary character inputs state
  const [characterName, setCharacterName] = useState<string>('Kira "Null" Takahashi');
  const [genre, setGenre] = useState<GenreType>('Cyberpunk');
  const [role, setRole] = useState<string>('Netrunner');
  const [selectedCostumes, setSelectedCostumes] = useState<string[]>([
    'LED cyber jacket with high collar',
    'holographic visor mask',
    'tactical techwear cargo pants',
    'armored neural harness',
  ]);
  const [selectedProps, setSelectedProps] = useState<string[]>([
    'Cyberdeck',
    'Neural Link',
    'Smart Pistol',
    'HUD Visor',
  ]);
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>({
    'Ethnic / Ancestral Background': ['of East Asian descent'],
    Age: ['a young adult'],
    'Body Build': ['athletic build'],
    'Skin Tone': ['pale skin'],
    'Hair Texture': ['straight hair'],
    'Hair Length': ['medium-length hair'],
    'Hair Color': ['dyed, unnatural hair color'],
    'Eye Color': ['amber eyes'],
    'Facial Structure': ['angular face'],
    'Distinct Facial Features': ['high cheekbones'],
    'Physical Markings': ['visible tattoos'],
    'Posture & Movement': ['quick and light on their feet'],
    'Overall Appearance': ['striking appearance'],
  });
  const [customTraits, setCustomTraits] = useState<Record<string, string[]>>({});
  const [style, setStyle] = useState<string>('cinematic');
  const [lighting, setLighting] = useState<string>(LIGHTING_MODIFIERS[1].value); // Neon glow
  const [cameraFraming, setCameraFraming] = useState<string>(CAMERA_FRAMING_OPTIONS[1].value); // Medium close up
  const [aspectRatio, setAspectRatio] = useState<string>('--ar 16:9');
  const [mood, setMood] = useState<string>(MOOD_OPTIONS[0].value);
  const [environment, setEnvironment] = useState<string>(ENVIRONMENT_PRESETS[0]);

  // Modals state
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [savedBlocks, setSavedBlocks] = useState<CharacterSubBlock[]>([]);

  // Load saved blocks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLOCKS);
      if (saved) {
        setSavedBlocks(JSON.parse(saved));
      } else {
        const initialBlocks: CharacterSubBlock[] = [
          {
            id: 'block-init-1',
            type: 'traits',
            label: 'Cyberpunk Infiltrator Biology',
            text: 'of East Asian descent, athletic build, straight dyed hair, angular face, high cheekbones, visible tattoos',
            createdAt: Date.now(),
          },
          {
            id: 'block-init-2',
            type: 'costumes',
            label: 'Netrunner Infiltration Rig',
            text: 'LED cyber jacket with high collar, holographic visor mask, tactical techwear cargo pants, armored neural harness',
            createdAt: Date.now(),
          },
          {
            id: 'block-init-3',
            type: 'props',
            label: 'Netrunner Cyberdeck & Weapons',
            text: 'Cyberdeck, Neural Link, Smart Pistol, HUD Visor',
            createdAt: Date.now(),
          },
        ];
        setSavedBlocks(initialBlocks);
        localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(initialBlocks));
      }
    } catch (e) {
      console.error('Failed to load blocks from localStorage', e);
    }
  }, []);

  // Save blocks to localStorage when updated
  const updateSavedBlocks = (newBlocks: CharacterSubBlock[]) => {
    setSavedBlocks(newBlocks);
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(newBlocks));
    } catch (e) {
      console.error('Failed to save blocks', e);
    }
  };

  // Switch genre handler: updates genre, sets default role & initial costume items
  const handleGenreChange = (newGenre: GenreType) => {
    setGenre(newGenre);
    const available = ROLES_BY_GENRE[newGenre] || [];
    if (available.length > 0) {
      const newRole = available[0];
      setRole(newRole);
      const defaultProps = getPropsForRole(newGenre, newRole).slice(0, 4);
      setSelectedProps(defaultProps);
    }
    const ensembles = GENRE_FULL_ENSEMBLES[newGenre] || [];
    if (ensembles.length > 0) {
      setSelectedCostumes([ensembles[0].text]);
    }
  };

  // Switch role handler: updates role & adjusts default props
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const roleProps = getPropsForRole(genre, newRole).slice(0, 4);
    setSelectedProps(roleProps);
  };

  // Costume Wardrobe Handlers
  const handleToggleCostume = (item: string) => {
    setSelectedCostumes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddCustomCostume = (item: string) => {
    if (!selectedCostumes.includes(item)) {
      setSelectedCostumes((prev) => [...prev, item]);
    }
  };

  const handleSelectCostumeEnsemble = (items: string[]) => {
    setSelectedCostumes(items);
  };

  const handleClearCostumes = () => {
    setSelectedCostumes([]);
  };

  // Props selection toggle
  const handleToggleProp = (prop: string) => {
    setSelectedProps((prev) =>
      prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]
    );
  };

  const handleAddCustomProp = (prop: string) => {
    if (!selectedProps.includes(prop)) {
      setSelectedProps((prev) => [...prev, prop]);
    }
  };

  const handleClearProps = () => {
    setSelectedProps([]);
  };

  const handleSelectRecommendedProps = (props: string[]) => {
    setSelectedProps(props);
  };

  // Trait selection toggle
  const handleToggleTrait = (category: string, traitText: string) => {
    setSelectedTraits((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(traitText)
        ? current.filter((t) => t !== traitText)
        : [...current, traitText];
      return { ...prev, [category]: updated };
    });
  };

  const handleAddCustomTrait = (category: string, traitText: string) => {
    setCustomTraits((prev) => {
      const current = prev[category] || [];
      if (!current.includes(traitText)) {
        return { ...prev, [category]: [...current, traitText] };
      }
      return prev;
    });
  };

  const handleClearAllTraits = () => {
    setSelectedTraits({});
    setCustomTraits({});
  };

  // Harmonious Trait Auto-Pick
  const handleAutoPickHarmoniousTraits = () => {
    const newSelected: Record<string, string[]> = {};

    const coreCats = [
      'Ethnic / Ancestral Background',
      'Age',
      'Body Build',
      'Hair Color',
      'Eye Color',
      'Facial Structure',
      'Distinct Facial Features',
      'Posture & Movement',
      'Overall Appearance',
    ];

    coreCats.forEach((cat) => {
      const items = PHYSICAL_TRAITS[cat] || [];
      if (items.length > 0) {
        const pick = items[Math.floor(Math.random() * items.length)];
        newSelected[cat] = [pick.text];
      }
    });

    setSelectedTraits(newSelected);
  };

  // Randomize Everything
  const handleRandomizeAll = () => {
    const randomGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const roles = ROLES_BY_GENRE[randomGenre] || [];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomProps = getPropsForRole(randomGenre, randomRole)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const ensembles = GENRE_FULL_ENSEMBLES[randomGenre] || [];
    const randomCostumes =
      ensembles.length > 0
        ? [ensembles[Math.floor(Math.random() * ensembles.length)].text]
        : ['signature genre apparel', 'custom tailored attire'];

    setGenre(randomGenre);
    setRole(randomRole);
    setSelectedCostumes(randomCostumes);
    setSelectedProps(randomProps);
    handleAutoPickHarmoniousTraits();

    const randomLighting =
      LIGHTING_MODIFIERS[Math.floor(Math.random() * LIGHTING_MODIFIERS.length)].value;
    const randomFraming =
      CAMERA_FRAMING_OPTIONS[Math.floor(Math.random() * CAMERA_FRAMING_OPTIONS.length)].value;
    const randomMood = MOOD_OPTIONS[Math.floor(Math.random() * MOOD_OPTIONS.length)].value;
    const randomEnv =
      ENVIRONMENT_PRESETS[Math.floor(Math.random() * ENVIRONMENT_PRESETS.length)];

    setLighting(randomLighting);
    setCameraFraming(randomFraming);
    setMood(randomMood);
    setEnvironment(randomEnv);
  };

  // Load Preset
  const handleLoadPreset = (preset: PresetCharacter) => {
    setCharacterName(preset.name);
    setGenre(preset.genre);
    setRole(preset.role);
    setStyle(preset.style);
    setEnvironment(preset.environment);
    setSelectedProps(preset.props);
    setSelectedTraits(preset.selectedTraits);
    if (preset.costumes && preset.costumes.length > 0) {
      setSelectedCostumes(preset.costumes);
    } else {
      const ensembles = GENRE_FULL_ENSEMBLES[preset.genre] || [];
      if (ensembles.length > 0) {
        setSelectedCostumes([ensembles[0].text]);
      }
    }
  };

  // Block Library Handlers
  const handleSaveCurrentAsBlock = (
    name: string,
    type: 'traits' | 'props' | 'costumes' | 'environment'
  ) => {
    let blockText = '';
    if (type === 'traits') {
      const flatTraits: string[] = [];
      (Object.values(selectedTraits) as string[][]).forEach((arr) => {
        if (Array.isArray(arr)) flatTraits.push(...arr);
      });
      (Object.values(customTraits) as string[][]).forEach((arr) => {
        if (Array.isArray(arr)) flatTraits.push(...arr);
      });
      blockText = flatTraits.join(', ');
    } else if (type === 'costumes') {
      blockText = selectedCostumes.join(', ');
    } else if (type === 'props') {
      blockText = selectedProps.join(', ');
    } else if (type === 'environment') {
      blockText = environment;
    }

    const newBlock: CharacterSubBlock = {
      id: `block-${Date.now()}`,
      type,
      label: name,
      text: blockText,
      createdAt: Date.now(),
    };

    updateSavedBlocks([newBlock, ...savedBlocks]);
  };

  const handleLoadBlock = (block: CharacterSubBlock) => {
    if (block.type === 'costumes') {
      const items = block.text.split(',').map((s) => s.trim()).filter(Boolean);
      setSelectedCostumes(items);
    } else if (block.type === 'props') {
      const items = block.text.split(',').map((s) => s.trim()).filter(Boolean);
      setSelectedProps(items);
    } else if (block.type === 'environment') {
      setEnvironment(block.text);
    } else if (block.type === 'traits') {
      const items = block.text.split(',').map((s) => s.trim()).filter(Boolean);
      setCustomTraits((prev) => ({
        ...prev,
        'Imported Block': items,
      }));
    }
  };

  const handleDeleteBlock = (id: string) => {
    updateSavedBlocks(savedBlocks.filter((b) => b.id !== id));
  };

  const handleExportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedBlocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'character_forge_blocks.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (imported: CharacterSubBlock[]) => {
    updateSavedBlocks([...imported, ...savedBlocks]);
  };

  const currentInputs: CompilerInputs = useMemo(
    () => ({
      characterName,
      genre,
      role,
      selectedCostumes,
      selectedProps,
      selectedTraits,
      customTraits,
      environment,
      style,
      lighting,
      cameraFraming,
      aspectRatio,
      mood,
    }),
    [
      characterName,
      genre,
      role,
      selectedCostumes,
      selectedProps,
      selectedTraits,
      customTraits,
      environment,
      style,
      lighting,
      cameraFraming,
      aspectRatio,
      mood,
    ]
  );

  const handleCopyAllFromHeader = useCallback(() => {
    const compiled = compileKeywords(currentInputs);
    navigator.clipboard.writeText(compiled.rawCommaSeparated);
  }, [currentInputs]);

  const handleCopyPhysicalTraitsFromHeader = useCallback(() => {
    const compiled = compileKeywords(currentInputs);
    navigator.clipboard.writeText(compiled.physicalTraitsCommaSeparated || 'No physical traits selected');
  }, [currentInputs]);

  const handleCopyCostumesFromHeader = useCallback(() => {
    const compiled = compileKeywords(currentInputs);
    navigator.clipboard.writeText(compiled.costumesCommaSeparated || 'No costumes selected');
  }, [currentInputs]);

  const handleCopyPropsAttireFromHeader = useCallback(() => {
    const compiled = compileKeywords(currentInputs);
    navigator.clipboard.writeText(compiled.propsAttireCommaSeparated || 'No props selected');
  }, [currentInputs]);

  return (
    <div className="min-h-screen bg-indigo-50/40 text-slate-900 flex flex-col font-sans selection:bg-pink-500/20 selection:text-pink-900">
      {/* Top Header */}
      <Header
        characterName={characterName}
        onNameChange={setCharacterName}
        genre={genre}
        role={role}
        onRandomizeAll={handleRandomizeAll}
        onLoadPreset={handleLoadPreset}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onCopyAllKeywords={handleCopyAllFromHeader}
        onCopyPhysicalTraits={handleCopyPhysicalTraitsFromHeader}
        onCopyPropsAttire={handleCopyPropsAttireFromHeader}
        onCopyCostumes={handleCopyCostumesFromHeader}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Step 1 & Step 2: Hollywood Genre & Dynamic Role */}
        <section id="section-genre-role">
          <GenreRoleSelector
            genre={genre}
            role={role}
            onGenreChange={handleGenreChange}
            onRoleChange={handleRoleChange}
          />
        </section>

        {/* Step 3: Wardrobe, Costumes & Outfits Matrix */}
        <section id="section-costumes-wardrobe">
          <CostumeWardrobeSelector
            characterName={characterName}
            genre={genre}
            role={role}
            selectedCostumes={selectedCostumes}
            onToggleCostume={handleToggleCostume}
            onAddCustomCostume={handleAddCustomCostume}
            onSelectEnsemble={handleSelectCostumeEnsemble}
            onClearCostumes={handleClearCostumes}
          />
        </section>

        {/* Step 4: Contextual Props, Weapons & Gear Loadout */}
        <section id="section-props-attire">
          <PropsAttireSelector
            genre={genre}
            role={role}
            selectedProps={selectedProps}
            onToggleProp={handleToggleProp}
            onAddCustomProp={handleAddCustomProp}
            onClearProps={handleClearProps}
            onSelectRecommended={handleSelectRecommendedProps}
          />
        </section>

        {/* Step 5: Categorized Physical Traits & Biological Dimensions */}
        <section id="section-physical-traits">
          <PhysicalTraitsAccordion
            selectedTraits={selectedTraits}
            customTraits={customTraits}
            onToggleTrait={handleToggleTrait}
            onAddCustomTrait={handleAddCustomTrait}
            onClearAllTraits={handleClearAllTraits}
            onAutoPickHarmonious={handleAutoPickHarmoniousTraits}
          />
        </section>

        {/* Step 6: Visual Art Style & Cinematic Parameters */}
        <section id="section-style-environment">
          <EnvironmentStyleSelector
            style={style}
            lighting={lighting}
            cameraFraming={cameraFraming}
            aspectRatio={aspectRatio}
            mood={mood}
            environment={environment}
            onStyleChange={setStyle}
            onLightingChange={setLighting}
            onCameraFramingChange={setCameraFraming}
            onAspectRatioChange={setAspectRatio}
            onMoodChange={setMood}
            onEnvironmentChange={setEnvironment}
          />
        </section>

        {/* Real-time Dynamic Keywords & Prompt Output Panel (Positioned at the Bottom) */}
        <section id="section-keywords-output" className="pt-4">
          <KeywordsOutputPanel
            inputs={currentInputs}
            onSaveBlock={() => setIsLibraryOpen(true)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-indigo-100 bg-white/90 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-slate-600">Character Forge • Visual AI Prompt & Keyword Engine</span>
          <span className="font-mono text-[11px] font-bold text-indigo-500">
            20 Genres • 400+ Archetypes • 500+ Costumes • 8,000+ Props • 15 Physical Dimensions
          </span>
        </div>
      </footer>

      {/* Modals */}
      <BlockLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedBlocks={savedBlocks}
        onLoadBlock={handleLoadBlock}
        onDeleteBlock={handleDeleteBlock}
        onSaveCurrentAsBlock={handleSaveCurrentAsBlock}
        onExportAllJson={handleExportAllJson}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
