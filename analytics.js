// Importa os módulos necessários do Node.js
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Caminho para o arquivo de log
const LOG_FILE_PATH = path.join(__dirname, 'clicks.log');

/**
 * Analisa o arquivo de log para encontrar o número de IPs únicos
 * para um destino específico.
 * @param {string} targetDestination - O destino que queremos analisar (ex: 'ghsdp').
 */
async function analyzeLog(targetDestination) {
  // Verifica se o arquivo de log existe
  if (!fs.existsSync(LOG_FILE_PATH)) {
    console.error(`Arquivo de log não encontrado em: ${LOG_FILE_PATH}`);
    return;
  }

  // Usamos um Set para armazenar os hashes de IP.
  // Um Set só permite valores únicos, então ele automaticamente
  // cuida da contagem de IPs únicos para nós.
  const uniqueIpHashes = new Set();

  let totalClicksForDestination = 0;

  console.log(`Analisando cliques para o destino: "${targetDestination}"...`);

  // Cria uma interface para ler o arquivo linha por linha
  const fileStream = fs.createReadStream(LOG_FILE_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Trata diferentes tipos de quebra de linha (\n ou \r\n)
  });

  // Itera sobre cada linha do arquivo
  for await (const line of rl) {
    // Ignora linhas em branco
    if (line.trim() === '') continue;

    try {
      // Converte a linha (string JSON) em um objeto
      const logEntry = JSON.parse(line);

      // Verifica se o destino do log é o que estamos procurando
      if (logEntry.destination === targetDestination) {
        totalClicksForDestination++;
        // Adiciona o hash do IP ao nosso Set
        if (logEntry.ipHash) {
          uniqueIpHashes.add(logEntry.ipHash);
        }
      }
    } catch (error) {
      console.warn(`Aviso: Ignorando linha malformada no log -> ${line}`);
    }
  }

  // Exibe os resultados
  console.log('\n--- Análise Concluída ---');
  console.log(
    `Total de cliques para "${targetDestination}": ${totalClicksForDestination}`,
  );
  console.log(
    `Total de visitantes únicos (IPs únicos) para "${targetDestination}": ${uniqueIpHashes.size}`,
  );
  console.log('------------------------\n');
}

// --- COMO USAR O SCRIPT ---
// Pegamos o nome do destino a partir do argumento da linha de comando.
// Exemplo de uso: node analytics.js ghsdp
const destinationToAnalyze = process.argv[2];

if (!destinationToAnalyze) {
  console.error('ERRO: Por favor, especifique um destino para análise.');
  console.log('Exemplo de uso: node analytics.js ghsdp');
} else {
  analyzeLog(destinationToAnalyze);
}
