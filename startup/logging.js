const winston = require('winston');
require('winston-mongodb');
require('express-async-errors')

module.exports = function () {
    // Configuração do formato do log
    const logFormat = winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    );

    // Criação do logger
    const logger = winston.createLogger({
        format: logFormat,
        transports: [
            // Log em arquivo para erros
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                handleExceptions: true,
                handleRejections: true,
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),

            // Log geral em arquivo
            new winston.transports.File({
                filename: 'logs/combined.log',
                handleExceptions: true,
                handleRejections: true,
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),

            // Log no MongoDB
            new winston.transports.MongoDB({
                level: 'info',
                db: 'mongodb://localhost:27017/vidly',
                collection: 'logs',
                handleExceptions: true,
                handleRejections: true
            })
        ],
        exitOnError: false
    });

    // Adicionar logs no console durante desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(info => `${info.level}: ${info.message}`)
            ),
            handleExceptions: true,
            handleRejections: true,
        }));
    }

    // Configurar Winston como logger global
    winston.add(logger);

    // Capturar exceções não tratadas
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', error);
    });

    // Capturar rejeições não tratadas
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection:', { reason, promise });
    });

    // Exportar o logger para uso em outros módulos se necessário
    return logger;
};