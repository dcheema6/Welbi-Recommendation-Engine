import express from 'express';
import dotenv from 'dotenv';
import { createHandler } from 'graphql-http/lib/use/express';
import { getRecomendations } from './src/services/RecommendationService';
import { schema } from './src/schemas/root';

dotenv.config();

// // The root provides a resolver function for each API endpoint
var root = {
  recommendations: getRecomendations,
};

const app = express();
app.all('/', createHandler({ schema, rootValue: root }));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
