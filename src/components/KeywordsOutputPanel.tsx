import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  Layers,
  Palette,
  Tag,
  FileCode,
  Sliders,
  CheckCheck,
  User,
  Package,
  Shirt,
  Crown,
} from 'lucide-react';
import { compileKeywords, CompilerInputs } from '../utils/keywordCompiler';
import { getCharacterFiveEnsembles } from '../data/costumes';

interface KeywordsOutputPanelProps {
  inputs: CompilerInputs;
  onSaveBlock?: () => void;
}

type TabType = 'tags' | 'costumes' | 'traits' | 'props' | 'midjourney' | 'flux' | 'sdxl' | 'master' | 'raw';

export const KeywordsOutputPanel: React.FC<KeywordsOutputPanelProps> = ({ inputs }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tags');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);

  // Compile keywords in real time with 0 latency
  const compiled = useMemo(() => compileKeywords(inputs), [inputs]);

  // 5 Full Outfit Ensembles for this character / archetype
  const fiveEnsembles = useMemo(
    () => getCharacterFiveEnsembles(inputs.genre, inputs.role, inputs.characterName),
    [inputs.genre, inputs.role, inputs.characterName]
  );

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy single tag helper
  const handleCopySingleTag = (tagText: string) => {
    navigator.clipboard.writeText(tagText);
    setCopiedSingleTag(tagText);
    setTimeout(() => setCopiedSingleTag(null), 1500);
  };

  // Export as text file
  const handleExportTxt = () => {
    const content = `=== CHARACTER PROMPT KEYWORDS: ${inputs.characterName || 'Character'} ===
Genre: ${inputs.genre} | Role: ${inputs.role} | Style: ${inputs.style}

1. RAW COMMA-SEPARATED KEYWORDS:
${compiled.rawCommaSeparated}

2. COSTUMES & WARDROBE ONLY:
${compiled.costumesCommaSeparated || 'Default archetype attire'}

3. PHYSICAL TRAITS ONLY:
${compiled.physicalTraitsCommaSeparated || 'None selected'}

4. PROPS & GEAR ONLY:
${compiled.propsAttireCommaSeparated || 'None selected'}

5. MIDJOURNEY V6.1 PROMPT:
${compiled.midjourneyPrompt}

6. FLUX.1 PROMPT:
${compiled.fluxPrompt}

7. STABLE DIFFUSION XL POSITIVE:
${compiled.sdxlPositivePrompt}

8. STABLE DIFFUSION XL NEGATIVE:
${compiled.sdxlNegativePrompt}

9. MASTER DESCRIPTIVE PROMPT:
${compiled.masterPrompt}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(inputs.characterName || 'character').toLowerCase().replace(/\s+/g, '_')}_keywords.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border-4 border-indigo-100 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Top Banner: Real-Time Output Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-indigo-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
              Generated Prompt & Keyword Output
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                Live Reactivity
              </span>
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Real-time visual keywords and formatted prompts ready for instant 1-click copying.
          </p>
        </div>

        {/* Global Quick Action Buttons: Separate & All Copy */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy Costumes & Outfits Separately */}
          <button
            type="button"
            id="btn-copy-costumes-top"
            onClick={() => handleCopy(compiled.costumesCommaSeparated || 'No costumes selected', 'top-costumes')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 px-3.5 py-2 rounded-full transition-all shadow-[0px_3px_0px_0px_rgba(109,40,217,1)] active:scale-95"
            title="Copy outfits and costumes only"
          >
            {copiedKey === 'top-costumes' ? <CheckCheck className="w-3.5 h-3.5" /> : <Shirt className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'top-costumes' ? 'Copied Outfits!' : 'Copy Outfits'}</span>
          </button>

          {/* Copy Physical Traits Separately */}
          <button
            type="button"
            id="btn-copy-traits-top"
            onClick={() => handleCopy(compiled.physicalTraitsCommaSeparated || 'No physical traits selected', 'top-traits')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-pink-600 hover:bg-pink-700 px-3.5 py-2 rounded-full transition-all shadow-[0px_3px_0px_0px_rgba(219,39,119,1)] active:scale-95"
            title="Copy physical traits only"
          >
            {copiedKey === 'top-traits' ? <CheckCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'top-traits' ? 'Copied Traits!' : 'Copy Physical Traits'}</span>
          </button>

          {/* Copy Props & Attire Separately */}
          <button
            type="button"
            id="btn-copy-props-top"
            onClick={() => handleCopy(compiled.propsAttireCommaSeparated || 'No props selected', 'top-props')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-700 px-3.5 py-2 rounded-full transition-all shadow-[0px_3px_0px_0px_rgba(8,145,178,1)] active:scale-95"
            title="Copy props and weapons only"
          >
            {copiedKey === 'top-props' ? <CheckCheck className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'top-props' ? 'Copied Props!' : 'Copy Props & Gear'}</span>
          </button>

          {/* Copy All Keywords */}
          <button
            type="button"
            id="btn-copy-all-keywords-top"
            onClick={() => handleCopy(compiled.rawCommaSeparated, 'top-all')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-full transition-all shadow-[0px_3px_0px_0px_rgba(67,56,202,1)] active:scale-95"
            title="Copy all keywords"
          >
            {copiedKey === 'top-all' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'top-all' ? 'Copied All!' : 'Copy All Keywords'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportTxt}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-full border-2 border-slate-200 transition-colors"
            title="Download full prompt specs as TXT"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>
        </div>
      </div>

      {/* Metrics & Quick Spec Bar (Clickable for Instant Copy) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div
          onClick={() => handleCopy(compiled.rawCommaSeparated, 'metric-all')}
          className="bg-indigo-50/70 hover:bg-indigo-100/70 border-2 border-indigo-100 rounded-2xl p-3 flex flex-col cursor-pointer transition-all active:scale-98 group"
          title="Click to copy all keywords"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Keywords</span>
            <Copy className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-lg font-black text-indigo-950">
            {copiedKey === 'metric-all' ? '✓ Copied!' : `${compiled.allKeywords.length} tags`}
          </span>
        </div>

        <div
          onClick={() => handleCopy(compiled.costumesCommaSeparated || 'No costumes selected', 'metric-costumes')}
          className="bg-violet-50/70 hover:bg-violet-100/70 border-2 border-violet-100 rounded-2xl p-3 flex flex-col cursor-pointer transition-all active:scale-98 group"
          title="Click to copy costumes & wardrobe separately"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Outfits & Wardrobe</span>
            <Copy className="w-3 h-3 text-violet-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-lg font-black text-violet-950">
            {copiedKey === 'metric-costumes' ? '✓ Copied!' : `${compiled.costumesKeywords.length} outfits`}
          </span>
        </div>

        <div
          onClick={() => handleCopy(compiled.physicalTraitsCommaSeparated || 'No physical traits selected', 'metric-traits')}
          className="bg-pink-50/70 hover:bg-pink-100/70 border-2 border-pink-100 rounded-2xl p-3 flex flex-col cursor-pointer transition-all active:scale-98 group"
          title="Click to copy physical traits separately"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Physical Dimensions</span>
            <Copy className="w-3 h-3 text-pink-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-lg font-black text-pink-950">
            {copiedKey === 'metric-traits' ? '✓ Copied!' : `${compiled.physicalKeywords.length} traits`}
          </span>
        </div>

        <div
          onClick={() => handleCopy(compiled.propsAttireCommaSeparated || 'No props selected', 'metric-props')}
          className="bg-cyan-50/70 hover:bg-cyan-100/70 border-2 border-cyan-100 rounded-2xl p-3 flex flex-col cursor-pointer transition-all active:scale-98 group"
          title="Click to copy props & gear separately"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Props & Gear</span>
            <Copy className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-lg font-black text-cyan-950">
            {copiedKey === 'metric-props' ? '✓ Copied!' : `${compiled.propsKeywords.length} items`}
          </span>
        </div>

        <div className="bg-amber-50/70 border-2 border-amber-100 rounded-2xl p-3 flex flex-col">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Selected Ratio</span>
          <span className="text-lg font-black text-amber-950">{inputs.aspectRatio || '--ar 16:9'}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b-2 border-indigo-100 overflow-x-auto pb-1.5">
        <button
          type="button"
          id="tab-tags"
          onClick={() => setActiveTab('tags')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tags'
              ? 'bg-indigo-500 text-white shadow-[0px_2px_0px_0px_rgba(67,56,202,1)]'
              : 'text-slate-500 hover:text-indigo-900 hover:bg-indigo-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Interactive Chips</span>
        </button>

        <button
          type="button"
          id="tab-costumes"
          onClick={() => setActiveTab('costumes')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'costumes'
              ? 'bg-violet-600 text-white shadow-[0px_2px_0px_0px_rgba(109,40,217,1)]'
              : 'text-slate-500 hover:text-violet-900 hover:bg-violet-50'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Outfits & Costumes Only</span>
        </button>

        <button
          type="button"
          id="tab-traits"
          onClick={() => setActiveTab('traits')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'traits'
              ? 'bg-pink-500 text-white shadow-[0px_2px_0px_0px_rgba(219,39,119,1)]'
              : 'text-slate-500 hover:text-pink-900 hover:bg-pink-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Physical Traits Only</span>
        </button>

        <button
          type="button"
          id="tab-props"
          onClick={() => setActiveTab('props')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'props'
              ? 'bg-cyan-500 text-white shadow-[0px_2px_0px_0px_rgba(6,182,212,1)]'
              : 'text-slate-500 hover:text-cyan-900 hover:bg-cyan-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Props & Gear Only</span>
        </button>

        <button
          type="button"
          id="tab-midjourney"
          onClick={() => setActiveTab('midjourney')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'midjourney'
              ? 'bg-indigo-600 text-white shadow-[0px_2px_0px_0px_rgba(67,56,202,1)]'
              : 'text-slate-500 hover:text-indigo-900 hover:bg-indigo-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Midjourney v6.1</span>
        </button>

        <button
          type="button"
          id="tab-flux"
          onClick={() => setActiveTab('flux')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'flux'
              ? 'bg-purple-500 text-white shadow-[0px_2px_0px_0px_rgba(147,51,234,1)]'
              : 'text-slate-500 hover:text-purple-900 hover:bg-purple-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Flux.1 Prompt</span>
        </button>

        <button
          type="button"
          id="tab-sdxl"
          onClick={() => setActiveTab('sdxl')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'sdxl'
              ? 'bg-rose-500 text-white shadow-[0px_2px_0px_0px_rgba(244,63,94,1)]'
              : 'text-slate-500 hover:text-rose-900 hover:bg-rose-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Stable Diffusion XL</span>
        </button>

        <button
          type="button"
          id="tab-master"
          onClick={() => setActiveTab('master')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'master'
              ? 'bg-amber-500 text-white shadow-[0px_2px_0px_0px_rgba(245,158,11,1)]'
              : 'text-slate-500 hover:text-amber-900 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Master Prompt</span>
        </button>

        <button
          type="button"
          id="tab-raw"
          onClick={() => setActiveTab('raw')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'raw'
              ? 'bg-slate-800 text-white shadow-[0px_2px_0px_0px_rgba(30,41,59,1)]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Raw Comma-Separated</span>
        </button>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* Tab 1: Interactive Keyword Chips */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Click any individual chip to copy it instantly, or copy entire groups with the group buttons.
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.rawCommaSeparated, 'tags-all')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full transition-colors"
            >
              {copiedKey === 'tags-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tags-all' ? 'Copied All!' : 'Copy All Tags'}</span>
            </button>
          </div>

          {/* Group: Identity */}
          <div className="bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">
                Identity & Genre Archetype ({compiled.identityKeywords.length})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(compiled.identityKeywords.join(', '), 'group-identity')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white border border-indigo-200 px-2.5 py-0.5 rounded-full"
              >
                {copiedKey === 'group-identity' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'group-identity' ? 'Copied Identity!' : 'Copy Identity Group'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {compiled.identityKeywords.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopySingleTag(tag)}
                  title="Click to copy this keyword"
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1 ${
                    copiedSingleTag === tag
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'bg-white border-indigo-200 text-indigo-900 hover:border-indigo-400 hover:shadow-sm'
                  }`}
                >
                  <span>{tag}</span>
                  {copiedSingleTag === tag ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Copy className="w-3 h-3 text-indigo-300 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Group: Costumes & Outfits (Copyable Separately) */}
          <div className="bg-violet-50/50 border-2 border-violet-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-violet-700 uppercase tracking-wider flex items-center gap-1">
                <Shirt className="w-3.5 h-3.5 text-violet-600" />
                Wardrobe, Costumes & Ensembles ({compiled.costumesKeywords.length})
              </span>
              <button
                type="button"
                id="btn-copy-costumes-group"
                onClick={() => handleCopy(compiled.costumesCommaSeparated || 'No costumes selected', 'group-costumes')}
                className="text-[11px] font-black text-white bg-violet-600 hover:bg-violet-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                {copiedKey === 'group-costumes' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'group-costumes' ? 'Copied Outfits!' : 'Copy Outfits'}</span>
              </button>
            </div>
            {compiled.costumesKeywords.length === 0 ? (
              <p className="text-xs text-violet-400 italic">No custom costumes selected yet. Choose outfits in section 3 above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {compiled.costumesKeywords.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopySingleTag(tag)}
                    title="Click to copy this costume keyword"
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1 ${
                      copiedSingleTag === tag
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-violet-200 text-violet-900 hover:border-violet-400 hover:shadow-sm'
                    }`}
                  >
                    <span>{tag}</span>
                    {copiedSingleTag === tag ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3 text-violet-300 opacity-60" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group: Physical & Anatomical (Copyable Separately) */}
          <div className="bg-pink-50/50 border-2 border-pink-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-700 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-pink-500" />
                Physical Traits & Biological Dimensions ({compiled.physicalKeywords.length})
              </span>
              <button
                type="button"
                id="btn-copy-traits-group"
                onClick={() => handleCopy(compiled.physicalTraitsCommaSeparated || 'No physical traits selected', 'group-traits')}
                className="text-[11px] font-black text-white bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                {copiedKey === 'group-traits' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'group-traits' ? 'Copied Physical Traits!' : 'Copy Physical Traits'}</span>
              </button>
            </div>
            {compiled.physicalKeywords.length === 0 ? (
              <p className="text-xs text-pink-400 italic">No physical traits selected yet. Choose traits in section 5 above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {compiled.physicalKeywords.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopySingleTag(tag)}
                    title="Click to copy this keyword"
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1 ${
                      copiedSingleTag === tag
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-pink-200 text-pink-900 hover:border-pink-400 hover:shadow-sm'
                    }`}
                  >
                    <span>{tag}</span>
                    {copiedSingleTag === tag ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3 text-pink-300 opacity-60" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group: Props & Gear (Copyable Separately) */}
          <div className="bg-cyan-50/50 border-2 border-cyan-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-cyan-700 uppercase tracking-wider flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-cyan-600" />
                Props, Weapons & Gear Loadout ({compiled.propsKeywords.length})
              </span>
              <button
                type="button"
                id="btn-copy-props-group"
                onClick={() => handleCopy(compiled.propsAttireCommaSeparated || 'No props selected', 'group-props')}
                className="text-[11px] font-black text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                {copiedKey === 'group-props' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'group-props' ? 'Copied Props & Gear!' : 'Copy Props & Gear'}</span>
              </button>
            </div>
            {compiled.propsKeywords.length === 0 ? (
              <p className="text-xs text-cyan-500 italic">No props selected yet. Select items in section 4 above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {compiled.propsKeywords.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopySingleTag(tag)}
                    title="Click to copy this keyword"
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1 ${
                      copiedSingleTag === tag
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-cyan-200 text-cyan-900 hover:border-cyan-400 hover:shadow-sm'
                    }`}
                  >
                    <span>{tag}</span>
                    {copiedSingleTag === tag ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3 text-cyan-400 opacity-60" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group: Environment & Optics */}
          <div className="bg-amber-50/50 border-2 border-amber-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
                Environment, Camera Optics & Lighting ({compiled.environmentKeywords.length + compiled.cameraLightingKeywords.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    [...compiled.environmentKeywords, ...compiled.cameraLightingKeywords].join(', '),
                    'group-env'
                  )
                }
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-white border border-amber-200 px-2.5 py-0.5 rounded-full"
              >
                {copiedKey === 'group-env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'group-env' ? 'Copied Environment!' : 'Copy Environment / Optics'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...compiled.environmentKeywords, ...compiled.cameraLightingKeywords].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopySingleTag(tag)}
                  title="Click to copy this keyword"
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1 ${
                    copiedSingleTag === tag
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'bg-white border-amber-200 text-amber-950 hover:border-amber-400 hover:shadow-sm'
                  }`}
                >
                  <span>{tag}</span>
                  {copiedSingleTag === tag ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Copy className="w-3 h-3 text-amber-400 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dedicated Outfits & Costumes Tab */}
      {activeTab === 'costumes' && (
        <div className="bg-violet-950/90 border-2 border-violet-900 rounded-2xl p-4 sm:p-5 space-y-5">
          {/* Header & Copy Active */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-violet-900/60">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-black text-violet-300 uppercase tracking-wider">
                Outfits, Costumes & Ensembles ({compiled.costumesKeywords.length} equipped)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-copy-all-5-outfits-tab"
                onClick={() => {
                  const formatted = fiveEnsembles
                    .map((ens, idx) => `Outfit ${idx + 1} (${ens.themeBadge} - ${ens.label}):\n${ens.text}`)
                    .join('\n\n');
                  handleCopy(formatted, 'tab-all-5-outfits');
                }}
                className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-violet-100 bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              >
                {copiedKey === 'tab-all-5-outfits' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tab-all-5-outfits' ? 'Copied All 5!' : 'Copy All 5 Outfits'}</span>
              </button>

              <button
                type="button"
                id="btn-copy-costumes-tab"
                onClick={() => handleCopy(compiled.costumesCommaSeparated || 'No costumes selected', 'tab-costumes')}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-violet-200 bg-violet-500/30 hover:bg-violet-500/40 border border-violet-400/40 px-3.5 py-1.5 rounded-xl transition-colors"
              >
                {copiedKey === 'tab-costumes' ? <Check className="w-3.5 h-3.5 text-violet-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tab-costumes' ? 'Copied Equipped!' : 'Copy Equipped'}</span>
              </button>
            </div>
          </div>

          {/* Equipped Clauses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-1">
                Equipped Comma-Separated Keywords:
              </span>
              <p className="text-xs text-violet-100 font-mono bg-violet-950 p-3 rounded-xl border border-violet-900/80 select-all leading-relaxed whitespace-pre-wrap">
                {compiled.costumesCommaSeparated || 'No custom costumes selected. Default genre wardrobe will apply.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-1">
                Attire & Wardrobe Prompt Clause:
              </span>
              <p className="text-xs text-violet-200 font-mono bg-violet-950/80 p-3 rounded-xl border border-violet-900/60 select-all leading-relaxed">
                {compiled.costumesKeywords.length > 0
                  ? `Wardrobe and costume attire: wearing ${compiled.costumesKeywords.join(', ')}.`
                  : 'Standard role wardrobe.'}
              </p>
            </div>
          </div>

          {/* 5 Full Outfit Ensembles List */}
          <div className="pt-3 border-t border-violet-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                5 Full Outfit Ensembles for {inputs.characterName || `${inputs.genre} • ${inputs.role}`}
              </span>
              <span className="text-[11px] text-violet-400">Click any "Copy Outfit" to grab full description</span>
            </div>

            <div className="space-y-2">
              {fiveEnsembles.map((ens, idx) => {
                const isCopied = copiedKey === `ensemble-${ens.id}`;
                return (
                  <div
                    key={ens.id}
                    className="bg-violet-900/40 border border-violet-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-violet-900/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-lg bg-violet-700/80 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-violet-100 uppercase">{ens.label}</span>
                          <span className="text-[10px] font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            {ens.themeBadge}
                          </span>
                        </div>
                        <p className="text-xs text-violet-200/90 font-mono select-all leading-relaxed">
                          {ens.text}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`btn-copy-tab-ensemble-${idx + 1}`}
                      onClick={() => handleCopy(ens.text, `ensemble-${ens.id}`)}
                      className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border shrink-0 transition-all active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-violet-800/60 hover:bg-violet-700/80 border-violet-700 text-violet-200 hover:text-white'
                      }`}
                      title={`Copy outfit #${idx + 1}`}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Outfit'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dedicated Physical Traits Tab */}
      {activeTab === 'traits' && (
        <div className="bg-pink-950/90 border-2 border-pink-900 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-black text-pink-300 uppercase tracking-wider">
                Physical Traits & Anatomical Spec ({compiled.physicalKeywords.length} tags)
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-traits-tab"
              onClick={() => handleCopy(compiled.physicalTraitsCommaSeparated || 'No physical traits selected', 'tab-traits')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-pink-200 bg-pink-500/30 hover:bg-pink-500/40 border border-pink-400/40 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'tab-traits' ? <Check className="w-3.5 h-3.5 text-pink-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tab-traits' ? 'Copied Physical Traits!' : 'Copy Physical Traits'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-1">
                Comma-Separated Keywords:
              </span>
              <p className="text-xs text-pink-100 font-mono bg-pink-950 p-3.5 rounded-xl border border-pink-900/80 select-all leading-relaxed whitespace-pre-wrap">
                {compiled.physicalTraitsCommaSeparated || 'No physical traits selected. Select traits in section 5.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-1">
                Descriptive Anatomy Phrase:
              </span>
              <p className="text-xs text-pink-200 font-mono bg-pink-950/80 p-3.5 rounded-xl border border-pink-900/60 select-all leading-relaxed">
                {compiled.physicalKeywords.length > 0
                  ? `Character physical appearance: ${compiled.physicalKeywords.join(', ')}.`
                  : 'Default balanced character anatomy.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Dedicated Props & Gear Tab */}
      {activeTab === 'props' && (
        <div className="bg-cyan-950/90 border-2 border-cyan-900 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                Props, Weapons & Gear Loadout ({compiled.propsKeywords.length} items)
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-props-tab"
              onClick={() => handleCopy(compiled.propsAttireCommaSeparated || 'No props selected', 'tab-props')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-200 bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400/40 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'tab-props' ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tab-props' ? 'Copied Props & Gear!' : 'Copy Props & Gear'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Comma-Separated Keywords:
              </span>
              <p className="text-xs text-cyan-100 font-mono bg-cyan-950 p-3.5 rounded-xl border border-cyan-900/80 select-all leading-relaxed whitespace-pre-wrap">
                {compiled.propsAttireCommaSeparated || 'No props selected. Select items in section 4.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Gear & Weapons Narrative Clause:
              </span>
              <p className="text-xs text-cyan-200 font-mono bg-cyan-950/80 p-3.5 rounded-xl border border-cyan-900/60 select-all leading-relaxed">
                {compiled.propsKeywords.length > 0
                  ? `Equipped weapons and gear: ${compiled.propsKeywords.join(', ')}.`
                  : 'Standard role equipment.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Midjourney v6.1 */}
      {activeTab === 'midjourney' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                Midjourney v6.1 Command
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {inputs.aspectRatio || '--ar 16:9'} --v 6.1 --style raw
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-midjourney"
              onClick={() => handleCopy(compiled.midjourneyPrompt, 'midjourney')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'midjourney' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'midjourney' ? 'Copied Prompt!' : 'Copy Midjourney'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 select-all whitespace-pre-wrap">
            {compiled.midjourneyPrompt}
          </p>
        </div>
      )}

      {/* Tab 6: Flux.1 */}
      {activeTab === 'flux' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                Flux.1 Pro / Dev Prompt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                Natural Flow Synthesizer
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-flux"
              onClick={() => handleCopy(compiled.fluxPrompt, 'flux')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'flux' ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'flux' ? 'Copied Flux!' : 'Copy Flux.1'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 select-all whitespace-pre-wrap">
            {compiled.fluxPrompt}
          </p>
        </div>
      )}

      {/* Tab 7: SDXL Positive & Negative */}
      {activeTab === 'sdxl' && (
        <div className="space-y-3">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                SDXL Positive Tag Sequence
              </span>
              <button
                type="button"
                id="btn-copy-sdxl-pos"
                onClick={() => handleCopy(compiled.sdxlPositivePrompt, 'sdxl-pos')}
                className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30"
              >
                {copiedKey === 'sdxl-pos' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Copy Positive</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 select-all">
              {compiled.sdxlPositivePrompt}
            </p>
          </div>

          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                SDXL Negative Filter Tokens
              </span>
              <button
                type="button"
                id="btn-copy-sdxl-neg"
                onClick={() => handleCopy(compiled.sdxlNegativePrompt, 'sdxl-neg')}
                className="text-xs font-bold text-rose-300 hover:text-rose-200 flex items-center gap-1 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30"
              >
                {copiedKey === 'sdxl-neg' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Copy Negative</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 select-all">
              {compiled.sdxlNegativePrompt}
            </p>
          </div>
        </div>
      )}

      {/* Tab 8: Master Visual Prompt */}
      {activeTab === 'master' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Master Visual Prompt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                Universal Diffusion Engine
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-master"
              onClick={() => handleCopy(compiled.masterPrompt, 'master')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'master' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'master' ? 'Copied Master!' : 'Copy Master Prompt'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 select-all whitespace-pre-wrap">
            {compiled.masterPrompt}
          </p>
        </div>
      )}

      {/* Tab 9: Raw Comma-Separated */}
      {activeTab === 'raw' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Raw Comma-Separated Keywords
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono font-bold">
                {compiled.allKeywords.length} Total Tags
              </span>
            </div>
            <button
              type="button"
              id="btn-copy-raw"
              onClick={() => handleCopy(compiled.rawCommaSeparated, 'raw')}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors"
            >
              {copiedKey === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'raw' ? 'Copied Raw Tags!' : 'Copy Raw Keywords'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 select-all whitespace-pre-wrap">
            {compiled.rawCommaSeparated}
          </p>
        </div>
      )}
    </div>
  );
};
