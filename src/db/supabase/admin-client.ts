import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias.',
  );
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
