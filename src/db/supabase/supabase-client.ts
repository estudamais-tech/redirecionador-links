import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_API;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'As variáveis de ambiente SUPABASE_URL e SUPABASE_API são obrigatórias.',
  );
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
