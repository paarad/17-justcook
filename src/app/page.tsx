"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat, Clock, Users, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("none");
  const [cuisine, setCuisine] = useState("any");
  const [time, setTime] = useState("30");
  const [servings, setServings] = useState("2");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJustCook = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    
    // Create URL params for the recipe generation
    const params = new URLSearchParams({
      ingredients: ingredients.trim(),
      diet,
      cuisine,
      time,
      servings,
    });
    
    // Navigate to results page
    router.push(`/recipe?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-stone-100 rounded-full">
            <ChefHat className="h-12 w-12 text-stone-700" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          Turn Your Ingredients Into Chef-Level Recipes
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
          Tell us what&apos;s in your fridge or pantry, and we&apos;ll create a complete recipe with steps, 
          substitutions, and nutrition info — in seconds.
        </p>
      </div>

      {/* Main Input Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What&apos;s in your kitchen?</CardTitle>
          <CardDescription>
            List your ingredients, and we&apos;ll work our magic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-stone-700 mb-2">
              Your Ingredients
            </label>
            <Textarea
              id="ingredients"
              placeholder="e.g., pasta, canned tomatoes, onion, garlic, olive oil..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Diet */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Dietary Preference
              </label>
              <Select value={diet} onValueChange={setDiet}>
                <SelectTrigger>
                  <SelectValue placeholder="Any diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No restrictions</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="dairy-free">Dairy-free</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Cuisine Style
              </label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any cuisine</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Max Time (minutes)
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Servings
              </label>
              <Select value={servings} onValueChange={setServings}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="6">6 people</SelectItem>
                  <SelectItem value="8">8 people</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={handleJustCook}
              disabled={!ingredients.trim() || loading}
              className="w-full md:w-auto text-lg px-8 py-3 bg-stone-900 hover:bg-stone-800 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              size="lg"
            >
              <Utensils className={`mr-2 h-5 w-5 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? "Cooking up your recipe..." : "Just Cook"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-stone-200">
              <ChefHat className="h-6 w-6 text-stone-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Smart Recipes</h3>
            <p className="text-stone-600 text-sm">
              Get complete recipes with steps, timing, and chef tips
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-stone-200">
              <Users className="h-6 w-6 text-stone-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Substitutions</h3>
            <p className="text-stone-600 text-sm">
              Smart suggestions for missing ingredients and swaps
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-stone-200">
              <Utensils className="h-6 w-6 text-stone-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Nutrition Info</h3>
            <p className="text-stone-600 text-sm">
              Macros per serving with live updates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
