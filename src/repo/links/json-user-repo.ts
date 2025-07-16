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
}

const linkRepo = new JsonLinkRepo();

(async () => {
  console.log(await linkRepo.readFromDisk());
})();
