/**
 * Configuration for default pages, models, and settings for various media types.
 */
export const config = {
  defaultPage: 'text' as const,
  pages: {
    text: 'text',
    image: 'image',
    audio: 'audio',
  } as const,
  defaultModels: {
    text: 'gpt-3.5-turbo',
    image: 'dall-e-2',
    audio: 'tts-1',
  } as const,
  image: {
    sizes: {
      'dall-e-2': ['256x256', '512x512', '1024x1024'],
      'dall-e-3': ['1024x1024', '1792x1024', '1024x1792'],
    } as const,
    defaultSizes: {
      'dall-e-2': '256x256',
      'dall-e-3': '1024x1024',
    } as const,
  },
  audio: {
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const,
    defaultVoice: 'alloy',
    formats: ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'] as const,
    defaultFormat: 'mp3',
    mimeMaps: {
      mp3: 'audio/mp3',
      opus: 'audio/ogg',
      aac: 'audio/aac',
      flac: 'audio/flac',
      wav: 'audio/wav',
      pcm: 'audio/L16',
    } as const,
    speeds: [0.25, 1, 4] as const,
    defaultSpeed: 1,
  },
  models: {
    text: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0125',
      'gpt-3.5-turbo-1106',
      'gpt-3.5-turbo-instruct',
      'gpt-4-turbo',
      'gpt-4-turbo-2024-04-09',
      'gpt-4-turbo-preview',
      'gpt-4-0125-preview',
      'gpt-4-1106-preview',
      'gpt-4-0613',
      'gpt-4-vision-preview',
      'gpt-4-1106-vision-preview',
      'gpt-4',
      'gpt-4-32k',
      'gpt-4-32k-0613',
    ] as const,
    image: ['dall-e-2', 'dall-e-3'] as const,
    audio: ['tts-1', 'tts-1-hd'] as const,
  },
}

export default config
