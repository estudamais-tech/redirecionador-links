import { resolve } from 'path';
import { DestinationModel } from '../../models/Destination';
import { readFile } from 'fs/promises';

const ROOT_DIR = process.cwd();

const JSON_LINKS_FILE_PATH = resolve(
  ROOT_DIR,
  'src',
  'db',
  'seed',
  'destinations.json',
);

export class JsonLinkRepo {
  async readFromDisk(): Promise<DestinationModel[]> {
    const jsonContent = await readFile(JSON_LINKS_FILE_PATH, 'utf-8');
    const parsedJson = JSON.parse(jsonContent);
    return parsedJson;
  }

  async findAll(): Promise<DestinationModel[]> {
    const links = await this.readFromDisk();
    return links;
  }

  async findAllPublic(): Promise<DestinationModel[]> {
    const links = await this.readFromDisk();
    return links.filter(link => link.isActive);
  }

  async findByName(name: string): Promise<DestinationModel> {
    const links = await this.findAllPublic();
    const link = links.find(link => link.name === name);

    if (!link) {
      throw new Error('Nome do link não encontrado');
    }

    return link;
  }
}

// const jsonRepo = new JsonLinkRepo();

// (async () => {
//   console.log(await jsonRepo.findByName('ghsdp'));
//   const ghsdp = await jsonRepo.findByName('ghsdp');
//   console.log(ghsdp.url);
// })();
