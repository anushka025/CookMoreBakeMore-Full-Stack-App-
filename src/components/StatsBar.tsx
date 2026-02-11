import { Recipe } from '@/types/recipe';
import { ChefHat, Heart, BookOpen } from 'lucide-react';

interface StatsBarProps {
  recipes: Recipe[];
}

const StatsBar = ({ recipes }: StatsBarProps) => {
  const total = recipes.length;
  const cooked = recipes.filter((r) => r.cooked).length;
  const cookedPct = total > 0 ? Math.round((cooked / total) * 100) : 0;
  const favorites = recipes.filter((r) => r.favorite).length;

  const stats = [
    { icon: BookOpen, label: 'Total', value: total },
    { icon: ChefHat, label: 'Cooked', value: `${cookedPct}%` },
    { icon: Heart, label: 'Favorites', value: favorites },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4 shadow-sm"
        >
          <stat.icon className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
