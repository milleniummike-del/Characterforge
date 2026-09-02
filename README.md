# Character Forge — Visual Prompt & Keyword Generator (v2.0)

A modular, instant-reactivity visual AI prompt and keyword generation workstation engineered for Midjourney v6.1, Flux.1 Pro/Dev, and Stable Diffusion XL, styled with the **Vibrant Palette** design system.

## Core Features

- **Instant Live Prompt & Keyword Output (Positioned at the Bottom)**: Zero-latency compiler located at the bottom of the character creation suite, generating high-density visual tags, comma-separated keywords, and ready-to-paste prompt formulas on every selection change, with a 1-click "Output ↓" jump button in the sticky top header.
- **Dedicated Outfits & Costumes Wardrobe Matrix**:
  - **5 Full Outfit Ensembles per Character**: Every character archetype and preset features 5 copyable full outfits tailored to diverse mission scenarios:
    1. *Signature Look* (canonical archetype outfit)
    2. *Stealth & Infiltration* (reconnaissance, covert operations, darkness camouflage)
    3. *Formal Gala & Court Regalia* (diplomatic ceremonies, high society, festive banquets)
    4. *Hazard & Heavy Battle Gear* (high-threat combat, environmental shielding, armor)
    5. *Downtime & Casual Attire* (off-duty, street lounging, workshop/tavern clothing)
  - **1-Click Copy for Every Ensemble**: Every individual outfit card has an instant "Copy Outfit" button, plus a "Copy All 5 Outfits" batch exporter.
  - **500+ Curated Costumes & Garments**: Spanning all 20 genres (Cyberpunk techwear, High Fantasy royal plate & robes, Sci-Fi void suits, Noir trench coats, Samurai lacquered armor, Superhero suits, Solarpunk woven silks, etc.).
  - **Mix & Match Garment Builder**: Granular categorized picker for Headwear/Helmets, Tops & Outerwear, Bottoms & Legwear, Footwear, and Fabrics & Finishes.
  - **Separate Outfits Copying**: Instant 1-click copy buttons for costumes in the Header dropdown, Output Panel tabs, quick-action bar, and inside the Wardrobe selector.
- **Separate Copy Controls for Traits, Costumes & Props**:
  - **Copy Physical Traits Separately**: 1-click copy buttons in the top output panel, header menu, interactive chip group header, and directly on the Physical Traits section accordion.
  - **Copy Outfits & Costumes Separately**: 1-click copy buttons in the top output panel, header menu, interactive chip group header, and directly inside the Wardrobe selector.
  - **Copy Props & Gear Separately**: 1-click copy buttons in the top output panel, header menu, interactive chip group header, and directly inside the Role-Specific Loadout selector.
  - **Dedicated Preview Tabs**: Dedicated "Outfits & Costumes", "Physical Traits", and "Props & Gear" breakdown views with comma-separated tokens and narrative clauses.
- **1-Click Copy Everywhere**: Single-click copy buttons for Master Prompts, Midjourney commands (`--ar`, `--v 6.1`, `--style raw`), Flux.1 natural descriptions, SDXL Positive/Negative blocks, raw comma-separated tags, and individual interactive keyword chips.
- **Interactive Keyword Chips**: Grouped by Identity, Physical Anatomy, Outfits & Costumes, Props & Gear, Environment, and Optics/Lighting. Click any individual chip to immediately copy it to the clipboard.
- **Vibrant Palette Design System**: High-contrast, tactile UI aesthetic with bold indigo/pink/amber/purple/cyan color harmonies, crisp rounded containers, vibrant accent tags, and responsive micro-interactions.
- **20 Hollywood Genres & 400+ Archetypes**: Action, Sci-Fi, Fantasy, Horror, Noir, Western, Cyberpunk, Steampunk, Space Opera, Post-Apoc, Adventure, Thriller, Historical, Superhero, War, Mystery, Musical, Samurai, Cosmic Horror, and Solar Punk.
- **20 Tailored Props per Role**: Over 8,000 contextual items with multi-select toggles and custom addition.
- **15 Anatomical & Physical Dimensions**: Collapsible categories for heritage, age, body build, skin tone, facial geography, hair, eyes, markings, and posture.
- **Optics & Cinematic Modifiers**: 35mm film, lighting presets (neon, rim, volumetric, chiaroscuro), camera framing, aspect ratios, and mood modifiers.
- **Modular Block Library**: Save, load, import, and export reusable character sub-blocks (JSON/TXT).

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Architecture**: Client-side reactive keyword compiler with zero latency and Express/Vite server runner.

