
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Aquí van las rutas de la API.

export default app;
