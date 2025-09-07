# 🍳 JustCook

**Turn your ingredients into chef-level recipes — in seconds.**

JustCook helps you create complete recipes from whatever ingredients you have in your fridge or pantry. Get detailed steps, smart substitutions, nutrition info, and plating tips using the power of AI.

## ✨ Features

- **🥕 Ingredient to Recipe**: Turn any list of ingredients into a complete recipe
- **🔁 Smart Substitutions**: Get alternatives for missing ingredients
- **🍽 Nutrition Info**: Estimated macros per serving with live updates
- **🛒 Shopping Lists**: Export missing ingredients as downloadable lists
- **📱 Beautiful UI**: Clean, minimal interface built with shadcn/ui
- **⚡ Fast Generation**: Get recipes in seconds using OpenAI GPT-4

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/paarad/17-justcook.git
   cd 17-justcook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **UI Components**: shadcn/ui with neutral theme
- **AI**: OpenAI GPT-4 for recipe generation
- **Hosting**: Designed for Vercel deployment

## 📖 How to Use

1. **Enter your ingredients** in the text area (e.g., "pasta, tomatoes, garlic, olive oil")
2. **Set your preferences** - dietary restrictions, cuisine style, cooking time, servings
3. **Click "Just Cook"** to generate your recipe
4. **Adjust servings** using the slider to scale ingredients automatically
5. **Download shopping lists** for missing ingredients
6. **Follow step-by-step instructions** with timing estimates

## 🎯 Example Use Case

**Input:**
- Ingredients: `pasta, canned tomatoes, onion, garlic`
- Diet: `vegan`
- Cuisine: `Italian`
- Time: `25 minutes`

**Output:**
- 🍝 **One-Pot Vegan Tomato Pasta**
- 📝 Complete recipe with 6 clear steps
- 🛒 Missing items: olive oil (with substitution suggestions)
- 📊 Nutrition: 440 kcal, 14g protein, 70g carbs, 9g fat per serving
- 🍽 Plating tips: "Use a shallow bowl, swirl with fork, top with herbs"

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── api/generate-recipe/     # OpenAI integration
│   ├── recipe/                  # Recipe results page
│   ├── recipes/                 # Saved recipes (placeholder)
│   ├── layout.tsx               # App layout with header
│   └── page.tsx                 # Home page with ingredient input
├── components/ui/               # shadcn/ui components
└── lib/utils.ts                 # Utility functions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for recipe generation | ✅ Yes |

## 📋 Future Enhancements (v2)

- 🔐 User authentication (Supabase)
- 💾 Save and organize recipes
- 📸 AI-generated dish images (DALL·E)
- 🔄 "Remix" feature for recipe variations
- 🎤 Voice input support
- 🤖 Telegram bot integration
- 🌍 Multi-language support
- 📱 Progressive Web App (PWA)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)

---

**Made with ❤️ for home cooks everywhere**
