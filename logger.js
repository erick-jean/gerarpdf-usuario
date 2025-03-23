const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, printf, colorize } = winston.format;

// Formato do log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configuração do logger
const logger = winston.createLogger({
    level: 'info', // Nível mínimo de log
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Logs no console
        new winston.transports.Console({
            format: combine(
                colorize(), // Adiciona cores aos logs no console
                logFormat
            )
        }),
        // Logs em arquivo com rotação diária
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

module.exports = logger;