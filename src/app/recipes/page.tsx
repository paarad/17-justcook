"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecipesPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Button 
        onClick={() => router.push('/')} 
        variant="ghost" 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-4">Saved Recipes</h1>
        <p className="text-lg text-stone-600">
          Your personal collection of chef-level recipes
        </p>
      </div>

      <Card className="text-center py-12">
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-stone-100 rounded-full">
              <ChefHat className="h-12 w-12 text-stone-700" />
            </div>
          </div>
          <CardTitle className="mb-4">No Saved Recipes Yet</CardTitle>
          <CardDescription className="mb-6 max-w-md mx-auto">
            Start creating amazing recipes with your ingredients, and they&apos;ll appear here for easy access later.
          </CardDescription>
          <Button onClick={() => router.push('/')}>
            Create Your First Recipe
          </Button>
        </CardContent>
      </Card>

      <div className="mt-12 text-center text-sm text-stone-500">
        <p>💡 <strong>Coming Soon:</strong> Save, organize, and share your favorite recipes with authentication.</p>
      </div>
    </div>
  );
} 