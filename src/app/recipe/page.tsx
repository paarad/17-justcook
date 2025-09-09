"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Recipe } from "../api/generate-recipe/route";

function RecipePageContent() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentServings, setCurrentServings] = useState<number>(2);
  const searchParams = useSearchParams();
  const router = useRouter();

  const ingredients = searchParams.get('ingredients');
  const diet = searchParams.get('diet');
  const cuisine = searchParams.get('cuisine');
  const time = searchParams.get('time');
  const servings = searchParams.get('servings');

  useEffect(() => {
    if (!ingredients) {
      router.push('/');
      return;
    }

    const generateRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/generate-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients,
            diet,
            cuisine,
            time,
            servings,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate recipe');
        }

        const recipeData: Recipe = await response.json();
        setRecipe(recipeData);
        setCurrentServings(recipeData.servings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    generateRecipe();
  }, [ingredients, diet, cuisine, time, servings, router]);

  const adjustIngredientAmount = (amount: string, originalServings: number, newServings: number): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;
    
    const ratio = newServings / originalServings;
    const newAmount = numericAmount * ratio;
    
    // Round to reasonable decimal places
    if (newAmount < 1) {
      return newAmount.toFixed(2).replace(/\.?0+$/, '');
    } else if (newAmount < 10) {
      return newAmount.toFixed(1).replace(/\.0$/, '');
    } else {
      return Math.round(newAmount).toString();
    }
  };

  const adjustNutrition = (value: number, originalServings: number, newServings: number): number => {
    return Math.round((value * newServings) / originalServings);
  };

  const generateShoppingList = () => {
    if (!recipe) return;
    
    const shoppingList = recipe.ingredients
      .map(ingredient => {
        const adjustedAmount = adjustIngredientAmount(
          ingredient.amount, 
          recipe.servings, 
          currentServings
        );
        return `${adjustedAmount} ${ingredient.unit} ${ingredient.name}${ingredient.optional ? ' (optional)' : ''}`;
      })
      .join('\n');
    
    const blob = new Blob([shoppingList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_shopping_list.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-stone-900 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-gray-700 pulse-cooking" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cooking up your recipe...</h2>
          <p className="text-gray-600 mb-6">Our chef AI is crafting the perfect recipe from your ingredients.</p>
          
          {/* Loading skeleton */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Oops! Something went wrong</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          onClick={() => router.push('/')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{recipe.summary}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Total: {recipe.totalTime} min
              </div>
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-1" />
                Prep: {recipe.prepTime} min
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Serves: {currentServings}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateShoppingList} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Shopping List
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recipe Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Servings Adjustment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adjust Servings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Servings:</span>
                <div className="flex-1">
                  <Slider
                    value={[currentServings]}
                    onValueChange={(value) => setCurrentServings(value[0])}
                    max={12}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm font-medium w-8">{currentServings}</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipe.instructions.map((instruction) => (
                  <div key={instruction.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{instruction.instruction}</p>
                      {instruction.time && (
                        <p className="text-sm text-gray-500 mt-1">
                          ~{instruction.time} minutes
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Substitutions */}
          {recipe.substitutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Smart Substitutions</CardTitle>
                                 <CardDescription>
                   Don&apos;t have something? Here are some alternatives
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.substitutions.map((sub, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-1">
                        Instead of <span className="font-semibold">{sub.original}</span>:
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {sub.alternatives.map((alt, altIndex) => (
                          <Badge key={altIndex} variant="secondary">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                      {sub.note && (
                        <p className="text-sm text-gray-600">{sub.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plating Tips */}
          {recipe.platingTips && (
            <Card>
              <CardHeader>
                <CardTitle>Plating Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{recipe.platingTips}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Ingredients & Nutrition */}
        <div className="space-y-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>For {currentServings} serving{currentServings !== 1 ? 's' : ''}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-800">
                      {ingredient.name}
                      {ingredient.optional && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          optional
                        </Badge>
                      )}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {adjustIngredientAmount(ingredient.amount, recipe.servings, currentServings)} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition</CardTitle>
              <CardDescription>Per serving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Calories</span>
                  <span>{adjustNutrition(recipe.nutrition.calories, recipe.servings, currentServings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span>{adjustNutrition(recipe.nutrition.protein, recipe.servings, currentServings)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs</span>
                  <span>{adjustNutrition(recipe.nutrition.carbs, recipe.servings, currentServings)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat</span>
                  <span>{adjustNutrition(recipe.nutrition.fat, recipe.servings, currentServings)}g</span>
                </div>
                {recipe.nutrition.fiber && (
                  <div className="flex justify-between">
                    <span>Fiber</span>
                    <span>{adjustNutrition(recipe.nutrition.fiber, recipe.servings, currentServings)}g</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Missing Ingredients */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Commonly Missing</CardTitle>
                <CardDescription>You might also need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recipe.missingIngredients.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <RecipePageContent />
    </Suspense>
  );
} 