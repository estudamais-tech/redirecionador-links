import { JsonLinkRepo } from '../repo/links/json-user-repo';

const linkRepo = new JsonLinkRepo();

export async function getUrlByName(name: string): Promise<string | null> {
  console.log(`[Service] buscando a url do nome: ${name}`);

  const destination = await linkRepo.findByName(name);

  return destination ? destination.url : null;
}
