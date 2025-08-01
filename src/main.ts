import 'dotenv/config';
import express, { Request, Response } from 'express';
import { getIdByName, getUrlByName } from './services/destinationService';
import { logClick } from './services/loggingService';

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

//Rota de direcionamento
app.get('/go/:destinationName', async (req: Request, res: Response) => {
  const { destinationName } = req.params;
  const userIp = req.ip || 'IP desconhecido';
  try {
    console.log(`[Route] Recebida requisição para: ${destinationName}`);
    //serviço para obtenção da url e id pelo nome
    const targetUrl = await getUrlByName(destinationName);
    const urlId = await getIdByName(destinationName);

    if (targetUrl) {
      //Evita que log o prefetch na db, ainda precisa corrigir no frontend, é uma gambiarra por hora
      const isPrefetch = req.headers['sec-purpose'] === 'prefetch';

      if (isPrefetch) {
        // Se for um prefetch, nós logamos no console para saber que aconteceu,
        // mas NÃO chamamos o serviço para registrar no banco de dados.
        console.log(
          `[Prefetch] Requisição de prefetch detectada para: ${destinationName}. Clique não será registrado.`,
        );
      } else {
        // Se for uma requisição normal (clique ou Enter), registramos o clique.
        console.log(`[Route] URL encontrada: ${targetUrl}. Redirecionando...`);
        // Chama o log. É async, mas não precisa esperar (fire-and-forget)
        logClick({
          linkId: urlId,
          ip: userIp,
        });
      }

      return res.redirect(302, targetUrl);
    } else {
      //FUTURAMENTE REDIRECIONAR PARA 404 PADRÃO DA PLATAFORMA
      console.warn(
        `[Route] Destino "${destinationName}" não encontrado. Redirecionando para fallback.`,
      );
      return res.redirect(302, 'https://estudamais.tech');
    }
  } catch (error) {
    console.error('[Route] Ocorreu um erro crítico:', error);
    // Se algo der errado, não deixe o usuário esperando. Envie uma resposta de erro.
    return res.status(500).send('Ocorreu um erro interno no servidor.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
