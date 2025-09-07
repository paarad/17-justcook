import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Recipe {
  title: string;
  summary: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
    optional?: boolean;
  }[];
  instructions: {
    step: number;
    instruction: string;
    time?: number;
  }[];
  substitutions: {
    original: string;
    alternatives: string[];
    note?: string;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  platingTips?: string;
  missingIngredients?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, diet, cuisine, time, servings } = await request.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional chef helping users cook meals with what they have. 
Give clear, safe, real recipes. Use common pantry items. Be flexible with substitutions.
Always return valid JSON in the exact format specified.`;

    const userPrompt = `Create a recipe using these ingredients: ${ingredients}

Requirements:
- Diet: ${diet === 'none' ? 'No restrictions' : diet}
- Cuisine preference: ${cuisine === 'any' ? 'Any cuisine' : cuisine}
- Max time: ${time} minutes
- Servings: ${servings}

Return ONLY a JSON object with this exact structure:
{
  "title": "Recipe Name",
  "summary": "Brief description of the dish",
  "prepTime": 15,
  "cookTime": 20,
  "totalTime": 35,
  "servings": ${servings},
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "1",
      "unit": "cup",
      "optional": false
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "Step description",
      "time": 5
    }
  ],
  "substitutions": [
    {
      "original": "ingredient",
      "alternatives": ["alternative1", "alternative2"],
      "note": "Optional note about substitution"
    }
  ],
  "nutrition": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18,
    "fiber": 8
  },
  "platingTips": "Serving and presentation suggestions",
  "missingIngredients": ["commonly needed items not in the ingredient list"]
}

Make sure the recipe:
- Uses mostly the provided ingredients
- Fits within the time constraint
- Respects dietary restrictions
- Has realistic nutrition estimates
- Includes 2-3 useful substitutions
- Lists 1-3 commonly missing ingredients with alternatives`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const recipeText = completion.choices[0].message.content;
    
    if (!recipeText) {
      throw new Error('No recipe generated');
    }

    // Parse the JSON response
    let recipe: Recipe;
    try {
      recipe = JSON.parse(recipeText);
    } catch (parseError) {
      console.error('Failed to parse recipe JSON:', parseError);
      throw new Error('Invalid recipe format received');
    }

    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error('Recipe missing required fields');
    }

    return NextResponse.json(recipe);

  } catch (error) {
    console.error('Recipe generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recipe',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 