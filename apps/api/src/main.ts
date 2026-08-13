import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { TransformInterceptor } from './shared/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './shared/filters/http-exception.filter'

function buildAllowedOrigins(): string[] {
  const origins = new Set<string>(['http://localhost:3000'])
  const frontendUrl = process.env.FRONTEND_URL?.trim().replace(/\/$/, '')
  if (frontendUrl) origins.add(frontendUrl)

  // Optional comma-separated extras (preview URLs, etc.)
  const extra = process.env.CORS_ORIGINS?.split(',') ?? []
  for (const raw of extra) {
    const origin = raw.trim().replace(/\/$/, '')
    if (origin) origins.add(origin)
  }
  return [...origins]
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  })

  const allowedOrigins = buildAllowedOrigins()

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`), false)
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3001}`)
  })
}
bootstrap()
