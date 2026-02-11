export interface Recipe {
  id: string;
  name: string;
  sheet: string;
  cooked: boolean;
  favorite: boolean;
  rating: number | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}
