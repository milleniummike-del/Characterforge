import React from 'react';
import {
  Palette,
  Sun,
  Camera,
  Compass,
  Smile,
  Ratio,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  VISUAL_STYLES,
  LIGHTING_MODIFIERS,
  CAMERA_FRAMING_OPTIONS,
  ASPECT_RATIOS,
  MOOD_OPTIONS,
  ENVIRONMENT_PRESETS,
} from '../data/taxonomy';

interface EnvironmentStyleSelectorProps {
  style: string;
  lighting: string;
  cameraFraming: string;
  aspectRatio: string;
  mood: string;
  environment: string;
  onStyleChange: (style: string) => void;
  onLightingChange: (lighting: string) => void;
  onCameraFramingChange: (framing: string) => void;
  onAspectRatioChange: (aspectRatio: string) => void;
  onMoodChange: (mood: string) => void;
  onEnvironmentChange: (environment: string) => void;
}

export const EnvironmentStyleSelector: React.FC<EnvironmentStyleSelectorProps> = ({
  style,
  lighting,
  cameraFraming,
  aspectRatio,
  mood,
  environment,
  onStyleChange,
  onLightingChange,
  onCameraFramingChange,
  onAspectRatioChange,
  onMoodChange,
  onEnvironmentChange,
}) => {
  return (
    <div className="bg-white border-4 border-purple-100 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]">
            5
          </div>
          <div>
            <h2 className="text-sm font-black text-purple-950 uppercase tracking-widest flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" />
              Visual Art Style & Cinematic Parameters
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Photographic lenses, render engines, lighting rigs, and atmospheric setting
            </span>
          </div>
        </div>
      </div>

      {/* Visual Styles (5 Cards) */}
      <div>
        <label className="text-xs font-black text-purple-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-500" />
          Primary Rendering Medium
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {VISUAL_STYLES.map((vs) => {
            const isSelected = vs.id === style;
            return (
              <button
                key={vs.id}
                type="button"
                id={`style-btn-${vs.id}`}
                onClick={() => onStyleChange(vs.id)}
                className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between group active:scale-95 ${
                  isSelected
                    ? 'bg-purple-500 border-purple-600 text-white shadow-[0px_4px_0px_0px_rgba(147,51,234,1)]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {vs.label}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-purple-100 font-medium' : 'text-slate-500'}`}>
                    {vs.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optical & Lighting Modifiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t-2 border-purple-100">
        {/* Lighting */}
        <div>
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Lighting Setup
          </label>
          <select
            id="select-lighting"
            value={lighting}
            onChange={(e) => onLightingChange(e.target.value)}
            className="w-full bg-purple-50/60 border-2 border-purple-100 text-xs font-bold text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
          >
            <option value="">Default Genre Lighting</option>
            {LIGHTING_MODIFIERS.map((lm) => (
              <option key={lm.label} value={lm.value}>
                {lm.label}
              </option>
            ))}
          </select>
        </div>

        {/* Camera Framing */}
        <div>
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-cyan-500" />
            Camera Framing & Lens
          </label>
          <select
            id="select-framing"
            value={cameraFraming}
            onChange={(e) => onCameraFramingChange(e.target.value)}
            className="w-full bg-purple-50/60 border-2 border-purple-100 text-xs font-bold text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
          >
            <option value="">Default Medium Close-Up</option>
            {CAMERA_FRAMING_OPTIONS.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mood & Emotion */}
        <div>
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-pink-500" />
            Mood & Expression
          </label>
          <select
            id="select-mood"
            value={mood}
            onChange={(e) => onMoodChange(e.target.value)}
            className="w-full bg-purple-50/60 border-2 border-purple-100 text-xs font-bold text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
          >
            <option value="">Default Dramatic Mood</option>
            {MOOD_OPTIONS.map((m) => (
              <option key={m.label} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Ratio className="w-3.5 h-3.5 text-emerald-500" />
            Aspect Ratio
          </label>
          <select
            id="select-aspect-ratio"
            value={aspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value)}
            className="w-full bg-purple-50/60 border-2 border-purple-100 text-xs font-bold text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
          >
            {ASPECT_RATIOS.map((ar) => (
              <option key={ar.label} value={ar.value}>
                {ar.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Environment / World Setting */}
      <div className="pt-3 border-t-2 border-purple-100">
        <label className="text-xs font-black text-purple-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          Atmospheric Environment & Backdrop
        </label>
        <textarea
          id="textarea-environment"
          rows={2}
          value={environment}
          onChange={(e) => onEnvironmentChange(e.target.value)}
          placeholder="Describe the environment (e.g. rain-slicked neon alleyway in Neo-Tokyo with towering holographic billboards...)"
          className="w-full bg-purple-50/50 border-2 border-purple-100 text-xs font-bold text-slate-800 placeholder-purple-300 rounded-2xl p-3 focus:outline-none focus:border-purple-300 focus:bg-white resize-none mb-2 transition-all"
        />

        {/* Quick Environment Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 font-bold uppercase tracking-wider shrink-0">Quick Settings:</span>
          {ENVIRONMENT_PRESETS.slice(0, 4).map((env, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onEnvironmentChange(env)}
              className="px-3 py-1 rounded-full bg-purple-50 border-2 border-purple-100 text-purple-700 font-bold hover:bg-purple-100 hover:border-purple-200 whitespace-nowrap transition-colors"
            >
              {env.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
