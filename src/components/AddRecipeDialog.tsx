import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SHEETS = ['Desserts', 'Veggies', 'Meat'] as const;

const AddRecipeDialog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [sheet, setSheet] = useState<string>('');
  const [category, setCategory] = useState('');
  const [subtype, setSubtype] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const reset = () => {
    setName('');
    setSheet('');
    setCategory('');
    setSubtype('');
    setDifficulty('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sheet) return;

    setLoading(true);
    const { error } = await supabase.from('recipes').insert({
      name: name.trim(),
      sheet,
      category: category.trim() || null,
      subtype: subtype.trim() || null,
      difficulty: difficulty.trim() || null,
      user_id: user?.id ?? null,
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Error adding recipe', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Recipe added!' });
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipe-name">Name *</Label>
            <Input id="recipe-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Sheet *</Label>
            <Select value={sheet} onValueChange={setSheet} required>
              <SelectTrigger>
                <SelectValue placeholder="Select sheet" />
              </SelectTrigger>
              <SelectContent>
                {SHEETS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipe-category">Category</Label>
            <Input id="recipe-category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipe-subtype">Subtype</Label>
            <Input id="recipe-subtype" value={subtype} onChange={(e) => setSubtype(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipe-difficulty">Difficulty</Label>
            <Input id="recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading || !name.trim() || !sheet} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Recipe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeDialog;
