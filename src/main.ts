import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

//Rota de direcionamento
app.get('/go/:destination', (req: Request, res: Response) => {
  const destination = req.params.destination;

  console.log(`Redirecting for: ${destination}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
