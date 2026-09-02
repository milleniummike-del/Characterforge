import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      time: new Date().toISOString(),
    });
  });

  // POST /api/character/synthesize
  app.post('/api/character/synthesize', async (req, res) => {
    try {
      const inputs = req.body;
      const {
        name,
        genre,
        role,
        props = [],
        selectedTraits = {},
        customTraits = {},
        environment = '',
        style = 'cinematic',
        lighting = '',
        cameraFraming = '',
        aspectRatio = '--ar 16:9',
        mood = '',
      } = inputs;

      // Compile traits list
      const traitsList: string[] = [];
      Object.entries(selectedTraits).forEach(([category, items]) => {
        if (Array.isArray(items) && items.length > 0) {
          traitsList.push(...items);
        }
      });
      Object.entries(customTraits).forEach(([category, items]) => {
        if (Array.isArray(items) && items.length > 0) {
          traitsList.push(...items);
        }
      });

      const traitsString = traitsList.join(', ') || 'striking appearance, distinct features';
      const propsString = Array.isArray(props) ? props.join(', ') : '';

      const promptMatrix = `
[CHARACTER SPECIFICATION]
Name / Identity: ${name || 'Unnamed Persona'}
Narrative Universe / Genre: ${genre}
Archetype / Role: ${role}
Physical & Anatomical Traits: ${traitsString}
Contextual Props, Weapons & Attire: ${propsString || 'Thematic role equipment'}
Setting / Environment: ${environment || 'Atmospheric cinematic backdrop suited to ' + genre}
Visual Style & Lens: ${style}
Lighting: ${lighting || 'Cinematic dramatic lighting with volumetric rim light'}
Framing: ${cameraFraming || 'Medium close-up bust portrait with cinematic depth of field'}
Mood & Emotion: ${mood || 'Heroic, resolute and world-weary'}
Target Aspect Ratio: ${aspectRatio}
`;

      const ai = getGeminiClient();

      if (ai) {
        const systemInstruction = `You are the Master Visual Character Prompt Engine specifically designed for AI image and video diffusion generation (Midjourney v6.1, Flux.1 Pro/Dev, SDXL, Sora, Runway Gen-3).
Your sole purpose is to synthesize character visual specifications into pristine, highly detailed, photorealistic prompt matrices and visual costume dossiers.
This is strictly an AI image prompt generator. Do NOT include video game mechanics, RPG statistics, mana/health/stamina numbers, HP/MP values, or gaming levels.

Ensure all prompts focus on tangible visual elements: photographic lenses, camera angles, lighting temperature, skin subsurface scattering, anatomical realism, fabric textures, apparel materials, weapon finishes, color grading, surface reflections, and environmental atmosphere.`;

        const userPrompt = `Synthesize this character specification into complete multi-target generation prompts and rich character profile:
${promptMatrix}

Output valid JSON adhering to the specified schema.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.85,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                masterPrompt: {
                  type: Type.STRING,
                  description: 'A comprehensive, high-density photorealistic visual character prompt description.',
                },
                midjourneyPrompt: {
                  type: Type.STRING,
                  description: 'Prompt formatted for Midjourney v6.1 including parameter flags like --ar, --v 6.1, --style raw.',
                },
                fluxPrompt: {
                  type: Type.STRING,
                  description: 'Natural language descriptive visual prompt optimized for Flux.1 Dev/Pro.',
                },
                sdxlPositive: {
                  type: Type.STRING,
                  description: 'Stable Diffusion XL positive tag and prose prompt.',
                },
                sdxlNegative: {
                  type: Type.STRING,
                  description: 'Stable Diffusion XL negative prompt to eliminate visual artifacts.',
                },
                soraVideoPrompt: {
                  type: Type.STRING,
                  description: 'Cinematic video prompt with camera movement, subject action, atmospheric motion, and lighting dynamics for Sora or Runway Gen-3.',
                },
                characterName: {
                  type: Type.STRING,
                  description: 'Synthesized character name or formal title.',
                },
                aliasOrTitle: {
                  type: Type.STRING,
                  description: 'Honorific, street name, code name, or moniker.',
                },
                tagline: {
                  type: Type.STRING,
                  description: 'One-sentence evocative character essence summary.',
                },
                backstory: {
                  type: Type.STRING,
                  description: 'Engaging narrative backstory (2-3 paragraphs).',
                },
                psychologicalProfile: {
                  type: Type.STRING,
                  description: 'Core psychological motivations, moral alignment, and flaws.',
                },
                keyMotivation: {
                  type: Type.STRING,
                  description: 'The burning desire or existential mission driving the character.',
                },
                signatureCatchphrase: {
                  type: Type.STRING,
                  description: 'A memorable dialogue line or signature phrase.',
                },
                visualPalette: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '4-5 primary color palette names/hex codes characterizing the costume and aura.',
                },
                costumeBreakdown: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific clothing layers, textile materials, armaments, and wear patterns.',
                },
              },
              required: [
                'masterPrompt',
                'midjourneyPrompt',
                'fluxPrompt',
                'sdxlPositive',
                'sdxlNegative',
                'soraVideoPrompt',
                'tagline',
                'backstory',
                'psychologicalProfile',
                'keyMotivation',
                'signatureCatchphrase',
                'visualPalette',
                'costumeBreakdown',
              ],
            },
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        const result = {
          masterPrompt: parsed.masterPrompt,
          midjourneyPrompt: parsed.midjourneyPrompt || `${parsed.masterPrompt} ${aspectRatio} --v 6.1 --style raw`,
          fluxPrompt: parsed.fluxPrompt,
          sdxlPrompt: {
            positive: parsed.sdxlPositive,
            negative: parsed.sdxlNegative || 'blurry, low quality, deformed hands, extra fingers, cartoon, 3d render artifacts, bad anatomy, flat lighting',
          },
          soraVideoPrompt: parsed.soraVideoPrompt,
          characterProfile: {
            name: name || parsed.characterName || `${role} of ${genre}`,
            aliasOrTitle: parsed.aliasOrTitle || `The ${role}`,
            tagline: parsed.tagline,
            backstory: parsed.backstory,
            psychologicalProfile: parsed.psychologicalProfile,
            keyMotivation: parsed.keyMotivation,
            signatureCatchphrase: parsed.signatureCatchphrase,
            visualPalette: parsed.visualPalette || ['#1E1B4B', '#06B6D4', '#F43F5E', '#E2E8F0'],
            costumeBreakdown: parsed.costumeBreakdown || props,
          },
          tokenCount: Math.round(parsed.masterPrompt.split(/\s+/).length * 1.3),
          generatedAt: Date.now(),
        };

        return res.json({ success: true, persona: result });
      }

      // Algorithmic synthesis fallback if no API key is set
      const synthMaster = `Photorealistic character portrait of ${name ? name + ', ' : ''}a ${role} in a ${genre} setting. Features ${traitsString}. Equipped with authentic ${propsString || 'thematic gear'}. Located in ${environment || 'an atmospheric ' + genre + ' environment'}. ${lighting || 'Cinematic volumetric lighting with rich rim contrast'}, ${cameraFraming || 'medium close-up composition'}, 35mm master prime lens, shallow depth of field, photorealistic skin textures with subsurface scattering, micro-details in fabrics and metals, 8k resolution, cinematic color grading.`;

      const synthMidjourney = `${synthMaster} ${aspectRatio || '--ar 16:9'} --v 6.1 --style raw --q 2`;
      const synthFlux = `A cinematic high-fidelity shot of ${name || 'a ' + role} embodying the essence of ${genre}. The character is ${traitsString}, wielding ${propsString}. Surrounding environment: ${environment}. Natural dramatic lighting, crisp atmospheric textures, ultra-realistic character rendering.`;
      const synthSora = `Cinematic slow tracking camera pushing in on ${name || 'the ' + role} standing in ${environment}. The character adjusts their ${props[0] || 'gear'} as dynamic atmospheric haze drifts through the frame. Wind catches their clothing, dramatic lighting shifts across their expression showing subtle intensity. 4k 60fps cinematic film look.`;

      return res.json({
        success: true,
        persona: {
          masterPrompt: synthMaster,
          midjourneyPrompt: synthMidjourney,
          fluxPrompt: synthFlux,
          sdxlPrompt: {
            positive: `${synthMaster}, highly detailed, photorealistic, intricate textures, masterpiece, 8k uhd`,
            negative: 'blurry, low quality, deformed hands, extra fingers, cartoon, 3d render artifacts, bad anatomy, flat lighting, oversaturated, watermark, signature',
          },
          soraVideoPrompt: synthSora,
          characterProfile: {
            name: name || `The ${role}`,
            aliasOrTitle: `${genre} ${role}`,
            tagline: `An enigmatic ${role} navigating the perilous world of ${genre}.`,
            backstory: `${name || 'This character'} has survived decades at the razor edge of ${genre} society. Through sheer grit, mastery of their craft, and distinctive ${props[0] || 'arsenal'}, they have carved out a reputation that precedes them wherever shadows fall.`,
            psychologicalProfile: `Calibrated instinct, pragmatic survivalism, and a hidden moral code masked beneath a hardened exterior.`,
            keyMotivation: `To fulfill their sworn duty and overcome the looming conflict threatening their world.`,
            signatureCatchphrase: `"In this world, your gear and your instincts are the only things that don't lie."`,
            visualPalette: ['#0F172A', '#38BDF8', '#F59E0B', '#E2E8F0'],
            costumeBreakdown: props.length > 0 ? props : ['Custom tailored armor', 'Weathered leather vest', 'Reinforced boots', 'Utility pouches'],
          },
          tokenCount: Math.round(synthMaster.split(/\s+/).length * 1.3),
          generatedAt: Date.now(),
        },
      });
    } catch (error: any) {
      console.error('Synthesis error:', error);
      res.status(500).json({ error: error.message || 'Failed to synthesize character' });
    }
  });

  // POST /api/character/generate-image
  app.post('/api/character/generate-image', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(400).json({
          error: 'Gemini API Key is not configured. Please configure your API key in Settings > Secrets.',
        });
      }

      const imagePrompt = `${prompt}, photorealistic character portrait, cinematic composition, high production value, dramatic lighting, detailed face`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: imagePrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        return res.status(500).json({ error: 'No image data returned from Gemini' });
      }

      return res.json({ success: true, imageUrl });
    } catch (error: any) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: error.message || 'Image generation failed' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Character Forge Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
