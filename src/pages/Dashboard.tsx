import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';
import StatsBar from '@/components/StatsBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, LogOut, Shuffle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const SHEETS = ['All', 'Desserts', 'Veggies', 'Meat'] as const;
const COOKED_FILTERS = ['All', 'Cooked', 'Uncooked'] as const;

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: recipes = [], isLoading } = useRecipes();
  const [sheetFilter, setSheetFilter] = useState<string>('All');
  const [cookedFilter, setCookedFilter] = useState<string>('All');
  const [randomRecipe, setRandomRecipe] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (sheetFilter !== 'All' && r.sheet !== sheetFilter) return false;
      if (cookedFilter === 'Cooked' && !r.cooked) return false;
      if (cookedFilter === 'Uncooked' && r.cooked) return false;
      return true;
    });
  }, [recipes, sheetFilter, cookedFilter]);

  const pickRandom = () => {
    const uncooked = recipes.filter((r) => !r.cooked);
    if (uncooked.length === 0) return;
    const pick = uncooked[Math.floor(Math.random() * uncooked.length)];
    setRandomRecipe(pick.name);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Recipe Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsBar recipes={recipes} />

        {/* Filters & Random */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {SHEETS.map((s) => (
              <Badge
                key={s}
                variant={sheetFilter === s ? 'default' : 'secondary'}
                className="cursor-pointer select-none"
                onClick={() => setSheetFilter(s)}
              >
                {s}
              </Badge>
            ))}
            <div className="mx-1 w-px bg-border" />
            {COOKED_FILTERS.map((f) => (
              <Badge
                key={f}
                variant={cookedFilter === f ? 'default' : 'secondary'}
                className="cursor-pointer select-none"
                onClick={() => setCookedFilter(f)}
              >
                {f}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={pickRandom} className="gap-1.5 shrink-0">
            <Shuffle className="h-4 w-4" />
            What should I cook?
          </Button>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ChefHat className="mb-2 h-10 w-10" />
            <p>No recipes found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>

      {/* Random Recipe Dialog */}
      <Dialog open={!!randomRecipe} onOpenChange={() => setRandomRecipe(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Tonight you should cook...
            </DialogTitle>
            <DialogDescription className="pt-2 text-xl font-semibold text-foreground">
              {randomRecipe}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setRandomRecipe(null)} className="mt-2">
            Sounds good!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
