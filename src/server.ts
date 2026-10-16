import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor ControlLabs (TypeScript) en ejecución`);
  console.log(`📡 URL base: http://localhost:${PORT}`);
  console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/v1/health`);
  console.log(`====================================================`);
});
