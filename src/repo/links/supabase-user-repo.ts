import { Database } from '../../types/supabase';
import { supabase } from '../../db/supabase/supabase-client';

type DestinationModel = Database['public']['Tables']['links']['Row'];

export class supabaseUserRepo {
  async findByName(name: string): Promise<DestinationModel | null> {
    const { data, error } = await supabase
      .from('links') // Seleciona a tabela 'links'
      .select('*') // Pega todas as colunas
      .eq('link_name', name) // Onde a coluna 'link_name' é igual ao nome que procuramos
      .eq('is_active', true) // E o link está ativo
      .single(); // Espera APENAS UM resultado. Se encontrar mais de um, ou nenhum, retorna um erro.

    if (error) {
      // Se o erro for "PGRST116", significa que nenhuma linha foi encontrada, o que é um resultado esperado.
      if (error.code !== 'PGRST116') {
        console.error('Erro ao buscar link por nome:', error);
      }
      return null;
    }

    return data;
  }

  /**
   * Busca todos os links públicos (ativos) no banco de dados.
   */
  async findAllPublic(): Promise<DestinationModel[]> {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }); // Ordena pelos mais recentes

    if (error) {
      console.error('Erro ao buscar todos os links públicos:', error);
      return []; // Retorna um array vazio em caso de erro
    }

    return data;
  }
}
