import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

// Create a singleton instance to avoid multiple clients
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = supabaseInstance || (supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}));

export interface Dish {
  id: number;
  name: string;
  image: string;
  price: number;
  is_featured?: boolean;
  created_at?: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  meals: number;
  is_popular: boolean;
  created_at?: string;
}

export interface Order {
  id: number;
  plan_id?: number;
  plan_name?: string;
  number_of_people?: number;
  meals_per_day?: number;
  items: OrderItem[];
  total: number;
  status: string;
  stripe_session_id?: string;
  created_at: string;
}

export interface OrderItem {
  dish_id: number;
  dish_name: string;
  quantity: number;
  price: number;
}
