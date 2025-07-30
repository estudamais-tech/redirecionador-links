import { supabaseUserRepo } from '../repo/links/supabase-user-repo';

const linkRepo = new supabaseUserRepo();

export async function getUrlByName(name: string): Promise<string | null> {
  console.log(`[Service] buscando a url do nome: ${name}`);

  const destination = await linkRepo.findByName(name);

  return destination ? destination.link_url : null;
}
