import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
// This is a great, expressive voice. You can find more on the ElevenLabs website.
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB' 

serve(async (req) => {
  // Handle CORS preflight requests for browser compatibility
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    } })
  }

  try {
    const { text } = await req.json()

    if (!ELEVENLABS_API_KEY) {
      throw new Error('Missing ELEVENLABS_API_KEY environment variable.')
    }
    if (!text) {
      throw new Error('Missing `text` in request body.')
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Great model for English and Hindi
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('ElevenLabs API Error:', errorData)
      throw new Error('Failed to generate audio from ElevenLabs.')
    }

    // Stream the audio directly back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})