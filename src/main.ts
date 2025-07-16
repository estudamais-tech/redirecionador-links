import 'dotenv/config';
import express, { Request, Response } from 'express';
import { getUrlByName } from './services/destinationService';

const app = express();
const PORT = process.env.PORT || 3001;

//Rota de direcionamento
app.get('/go/:destinationName', async (req: Request, res: Response) => {
  const { destinationName } = req.params;
  //registrar abaixo o try catch para loggar o click, e caso o nome não exista retornar o erro
  try {
    console.log(`[Route] Recebida requisição para: ${destinationName}`);
    //serviço para obtenção da url pelo nome
    const targetUrl = await getUrlByName(destinationName);

    if (targetUrl) {
      console.log(`[Route] URL encontrada: ${targetUrl}. Redirecionando...`);
      // lógica de log do click viria aqui
      return res.redirect(302, targetUrl);
    } else {
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
