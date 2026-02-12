import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useRecipes, useDeleteRecipe } from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';
import AddRecipeDialog from '@/components/AddRecipeDialog';
import StatsBar from '@/components/StatsBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChefHat, LogOut, Shuffle, Loader2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const isAdmin = useAdmin();
  const { data: recipes = [], isLoading } = useRecipes();
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const [sheetFilter, setSheetFilter] = useState<string>('All');
  const [cookedFilter, setCookedFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [subtypeFilter, setSubtypeFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [randomRecipe, setRandomRecipe] = useState<string | null>(null);

  const handleSheetChange = (s: string) => {
    setSheetFilter(s);
    setSubtypeFilter('All');
    setCategoryFilter('All');
  };

  // Get unique subtypes for the active sheet
  const subtypes = useMemo(() => {
    if (sheetFilter === 'All') return [];
    const set = new Set<string>();
    recipes.forEach((r) => {
      if (r.sheet === sheetFilter && r.subtype) set.add(r.subtype);
    });
    return Array.from(set).sort();
  }, [recipes, sheetFilter]);

  // Get unique categories based on active sheet + selected subtype
  const categories = useMemo(() => {
    if (sheetFilter === 'All') return [];
    return Array.from(
      new Set(
        recipes
          .filter((r) => {
            if (r.sheet !== sheetFilter) return false;
            if (subtypes.length > 0 && subtypeFilter !== 'All') {
              return r.subtype === subtypeFilter;
            }
            return true;
          })
          .map((r) => r.category)
          .filter(Boolean) as string[]
      )
    ).sort();
  }, [recipes, sheetFilter, subtypeFilter, subtypes]);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (search && !r.name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (sheetFilter !== 'All' && r.sheet !== sheetFilter) return false;
      if (subtypeFilter !== 'All' && r.subtype !== subtypeFilter) return false;
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
      if (cookedFilter === 'Cooked' && !r.cooked) return false;
      if (cookedFilter === 'Uncooked' && r.cooked) return false;
      return true;
    });
  }, [recipes, search, sheetFilter, subtypeFilter, categoryFilter, cookedFilter]);

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
            {isAdmin && <AddRecipeDialog />}
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters & Random */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {SHEETS.map((s) => (
              <Badge
                key={s}
                variant={sheetFilter === s ? 'default' : 'secondary'}
                className="cursor-pointer select-none"
                onClick={() => handleSheetChange(s)}
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

        {/* Category / Subtype Filters */}
        {sheetFilter !== 'All' && (
          <div className="flex flex-wrap gap-3">
            {subtypes.length > 0 && (
              <Select
                value={subtypeFilter}
                onValueChange={(val) => {
                  setSubtypeFilter(val);
                  setCategoryFilter('All');
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Subtype" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Subtypes</SelectItem>
                  {subtypes.map((st) => (
                    <SelectItem key={st} value={st}>{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isAdmin={isAdmin}
                onDelete={(id) => deleteRecipe(id)}
              />
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
