import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

// Client is created per-request so it always reads the current env var
function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in .env.local')
  return new Anthropic({ apiKey })
}

const SYSTEM_PROMPT = `You are an expert plant installation consultant for Verdant LA, a premium plant installation company serving greater Los Angeles. You specialize in both indoor and outdoor plant setups for apartments, homes, patios, balconies, rooftops, and yards.

Your expertise includes:
- LA's climate: Mediterranean climate with hot, dry summers and mild winters. Perfect for drought-tolerant plants, tropical species, and Mediterranean plants.
- Popular plants for LA: Bird of Paradise, Monstera, Fiddle Leaf Fig, Olive trees, Bougainvillea, Lavender, Agave, Succulents, Palms, Citrus trees, Rosemary, Jade plants.
- Design styles: Modern minimalist, Mediterranean, tropical, desert/xeric, bohemian, traditional.
- Realistic pricing: Plants range from $25 (small succulents) to $250 (large specimen plants). Planters from $30 to $200+. Installation labor $150-$500.

When analyzing a space, you always:
1. Identify the exact type of space and its characteristics
2. Consider sunlight, wind exposure, and privacy needs
3. Recommend plants that thrive in LA conditions and match the space's style
4. Provide specific, actionable placement guidance
5. Give realistic, detailed cost breakdowns
6. Include precise placement coordinates for visual overlay

IMPORTANT: For plantPlacements, carefully look at the image and estimate where each plant grouping would go. Use x (0=far left, 100=far right) and y (0=top, 100=bottom) as percentages of the image dimensions. Place markers where the plants would actually sit, considering furniture, walls, and open floor space.`

const USER_PROMPT = `Analyze this photo of a space and provide comprehensive plant installation recommendations.

Return ONLY a valid JSON object with no markdown formatting, no code blocks, just raw JSON:

{
  "spaceType": "balcony|patio|backyard|indoor|rooftop|front-yard|side-yard",
  "spaceDescription": "2-3 specific sentences describing what you see in this exact space",
  "estimatedSqFt": <number or null>,
  "style": "modern|mediterranean|tropical|desert|bohemian|minimalist|traditional|eclectic",
  "lightLevel": "bright-direct|bright-indirect|medium|low",
  "currentCondition": "empty|sparse|partially furnished|furnished",
  "recommendations": [
    {
      "plant": "Common name of plant",
      "scientificName": "Genus species",
      "quantity": <number>,
      "placement": "Specific location in this space (e.g., 'Left corner against the wall', 'Centered along the railing')",
      "reason": "1-2 sentences on why this plant suits this specific space, light, and climate",
      "careLevel": "easy|moderate|expert",
      "pricePerPlant": <number between 25-250>
    }
  ],
  "planterRecommendations": [
    {
      "type": "Detailed planter description including material, size, and style",
      "quantity": <number>,
      "priceEach": <number between 30-200>
    }
  ],
  "costBreakdown": {
    "plants": <total cost of all plants>,
    "planters": <total cost of all planters>,
    "soil": <soil and supplies, typically 40-120>,
    "installation": <labor cost, typically 150-500>,
    "total": <sum of all above>
  },
  "timeToInstall": "e.g. '2–3 hours' or '4–5 hours'",
  "maintenanceLevel": "low|medium|high",
  "maintenanceTips": [
    "Specific tip 1 for this plant selection",
    "Specific tip 2",
    "Specific tip 3"
  ],
  "afterDescription": "2-3 vivid sentences describing exactly how this specific space will look, feel, and smell after Verdant LA installs the plants. Be specific to the space shown.",
  "plantPlacements": [
    {
      "x": <0-100, percentage from left edge of image>,
      "y": <0-100, percentage from top edge of image>,
      "label": "Plant common name",
      "size": "small|medium|large",
      "color": "#2D6A4F"
    }
  ]
}

Rules:
- Recommend 3-6 plants total, appropriate for the space size
- Ensure plant quantities and prices are realistic
- Make plantPlacements accurate to what you see in the image—place markers where the plants would actually go
- Keep installation cost between $150-$500
- Total cost should realistically reflect a professional LA plant installation job`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { base64, mediaType } = body as { base64: string; mediaType: string }

    if (!base64 || !mediaType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 })
    }

    // Validate media type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(mediaType)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
    }

    const client = getClient()
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64,
              },
            },
            {
              type: 'text',
              text: USER_PROMPT,
            },
          ],
        },
      ],
    })

    // Extract text response
    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    // Parse JSON — handle both raw JSON and JSON inside markdown code blocks
    let rawText = textBlock.text.trim()

    // Strip markdown code block if present
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    // Find the JSON object
    const jsonStart = rawText.indexOf('{')
    const jsonEnd = rawText.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON found in response:', rawText.slice(0, 500))
      return NextResponse.json({ error: 'Could not parse plant recommendations. Please try again.' }, { status: 500 })
    }

    const jsonStr = rawText.slice(jsonStart, jsonEnd + 1)

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, '\nRaw:', jsonStr.slice(0, 500))
      return NextResponse.json({ error: 'Could not parse plant recommendations. Please try again.' }, { status: 500 })
    }

    // Validate required fields exist
    if (!parsed.recommendations || !parsed.costBreakdown) {
      return NextResponse.json({ error: 'Incomplete analysis returned. Please try again.' }, { status: 500 })
    }

    // Ensure plantPlacements is an array
    if (!Array.isArray(parsed.plantPlacements)) {
      parsed.plantPlacements = []
    }

    // Clamp placement coordinates to 0-100
    parsed.plantPlacements = parsed.plantPlacements.map(
      (p: { x: number; y: number; label: string; size: string; color: string }) => ({
        ...p,
        x: Math.max(5, Math.min(95, Number(p.x) || 50)),
        y: Math.max(5, Math.min(95, Number(p.y) || 50)),
      })
    )

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Analysis error:', err)

    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY in .env.local and restart the server.' }, { status: 401 })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 })
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `AI service error (${err.status}): ${err.message}` }, { status: 500 })
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse request. Please try uploading again.' }, { status: 400 })
    }

    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Unexpected error: ${message}` }, { status: 500 })
  }
}
