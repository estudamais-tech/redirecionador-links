import { createIpHash } from '../utils/hash';
import { supabaseAdmin } from '../db/supabase/admin-client';
import { Database } from '../types/supabase';

type ClickInsert = Database['public']['Tables']['log_data']['Insert'];

interface ClickInput {
  linkId: string | null; // ID do link clicado
  ip: string; // IP bruto do requisitante
}

export async function logClick(data: ClickInput): Promise<void> {
  const ipHash = createIpHash(data.ip);
  const newClickData: ClickInsert = {
    link_id: data.linkId,
    ip_hash: ipHash,
  };
  try {
    console.log('[LoggingService] Inserindo o link na base de dados...');
    await supabaseAdmin.from('log_data').insert(newClickData);
  } catch (error) {
    console.error(
      '[LoggingService] Falha ao escrever na base de dados:',
      error,
      // Não da throw no erro pra não quebrar o redirecionamento
    );
  }
}
