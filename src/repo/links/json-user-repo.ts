import { resolve } from 'path';
import { DestinationModel } from '../../models/Destination';
import { readFile } from 'fs/promises';

const JSON_LINKS_FILE_PATH = resolve(
  __dirname,
  '..',
  '..',
  'db',
  'seed',
  'destinations.json',
);

export class JsonLinkRepo {
  async readFromDisk(): Promise<DestinationModel[]> {
    try {
      console.log(`[Repo] Lendo os arquivos de ${JSON_LINKS_FILE_PATH}`);
      const jsonContent = await readFile(JSON_LINKS_FILE_PATH, 'utf-8');
      return JSON.parse(jsonContent);
    } catch (e) {
      console.error('[Repo] Falha ao ler ou parsear o arquivo JSON', e);
      throw new Error('Não foi possível carregar os dados JSON');
    }
  }

  async findAll(): Promise<DestinationModel[]> {
    const links = await this.readFromDisk();
    return links;
  }

  async findAllPublic(): Promise<DestinationModel[]> {
    const links = await this.readFromDisk();
    return links.filter(link => link.isActive);
  }

  async findByName(name: string): Promise<DestinationModel | null> {
    const links = await this.findAllPublic();
    return links.find(link => link.name === name) || null;
  }
}

// const jsonRepo = new JsonLinkRepo();

// (async () => {
//   console.log(await jsonRepo.findByName('ghsdp'));
//   const ghsdp = await jsonRepo.findByName('ghsdp');
//   console.log(ghsdp.url);
// })();
