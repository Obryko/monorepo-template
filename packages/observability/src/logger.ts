import pino from 'pino'

export interface LoggerOptions {
  name: string
  level?: string
}

export function createLogger(options: LoggerOptions): pino.Logger {
  const level = options.level ?? process.env['LOG_LEVEL'] ?? 'info'
  const isDev = process.env['NODE_ENV'] !== 'production'

  return pino({
    name: options.name,
    level,
    ...(isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        }
      : {}),
  })
}
