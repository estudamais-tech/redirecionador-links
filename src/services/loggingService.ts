import { appendFile } from 'fs/promises';
import { resolve } from 'path';
import { createIpHash } from '../utils/hash';

const LOG_PATH_FILE = resolve(__dirname, '../../clicks.log');

interface LogData {
  timestamp: string;
  destination: string;
  targetUrl: string;
  ipHash: string;
}

interface ClickInput {
  destination: string;
  targetUrl: string;
  ip: string; // IP bruto do requisitante
}

export async function logClick(data: ClickInput): Promise<void> {
  const logEntry: LogData = {
    timestamp: new Date().toISOString(),
    destination: data.destination,
    targetUrl: data.targetUrl,
    ipHash: createIpHash(data.ip), // Gera o hash aqui
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  try {
    await appendFile(LOG_PATH_FILE, logLine);
  } catch (error) {
    console.error(
      '[LoggingService] Falha ao escrever no arquivo de log:',
      error,
      // Não da throw no erro pra não quebrar o redirecionamento
    );
  }
}
