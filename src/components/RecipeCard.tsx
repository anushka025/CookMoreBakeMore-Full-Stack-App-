import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { useUpdateRecipe } from '@/hooks/useRecipes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, ChefHat, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { mutate: updateRecipe } = useUpdateRecipe();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(recipe.notes ?? '');

  const toggleCooked = () => {
    updateRecipe({ id: recipe.id, updates: { cooked: !recipe.cooked } });
  };

  const toggleFavorite = () => {
    updateRecipe({ id: recipe.id, updates: { favorite: !recipe.favorite } });
  };

  const setRating = (rating: number) => {
    updateRecipe({ id: recipe.id, updates: { rating: recipe.rating === rating ? null : rating } });
  };

  const saveNotes = () => {
    updateRecipe({ id: recipe.id, updates: { notes: notes || null } });
    setEditingNotes(false);
  };

  const cancelNotes = () => {
    setNotes(recipe.notes ?? '');
    setEditingNotes(false);
  };

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md",
      recipe.cooked && "border-primary/30 bg-primary/5"
    )}>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold leading-tight text-foreground">{recipe.name}</h3>
            <Badge variant="secondary" className="mt-1.5 text-xs">
              {recipe.sheet}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={toggleFavorite}
          >
            <Heart className={cn("h-4 w-4", recipe.favorite && "fill-destructive text-destructive")} />
          </Button>
        </div>

        {/* Rating */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="rounded p-0.5 transition-colors hover:bg-accent"
            >
              <Star className={cn(
                "h-4 w-4",
                recipe.rating && star <= recipe.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )} />
            </button>
          ))}
        </div>

        {/* Notes */}
        {editingNotes ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="min-h-[60px] text-sm"
              autoFocus
            />
            <div className="flex gap-1.5">
              <Button size="sm" variant="default" onClick={saveNotes} className="h-7 gap-1 text-xs">
                <Check className="h-3 w-3" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelNotes} className="h-7 gap-1 text-xs">
                <X className="h-3 w-3" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            className="flex items-start gap-1.5 rounded-md p-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent"
          >
            <Pencil className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-2">{recipe.notes || 'Add notes...'}</span>
          </button>
        )}

        {/* Cooked Toggle */}
        <Button
          variant={recipe.cooked ? "default" : "outline"}
          size="sm"
          onClick={toggleCooked}
          className="mt-auto gap-1.5"
        >
          <ChefHat className="h-4 w-4" />
          {recipe.cooked ? 'Cooked' : 'Mark as cooked'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
