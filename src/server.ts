import { env } from '@shared/env';
import { setupApp } from './main';

async function bootstrap(): Promise<void> {
  try {
    const app = setupApp();

    app.listen(env.PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
      console.log(`📊 Ambiente: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

bootstrap();
