const pino = require('pino');
const pinoHttp = require('pino-http');
const util = require('util');

const transport =
  process.env.NODE_ENV === 'development'
    ? pino.transport({
        targets: [
          {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          },
        ],
      })
    : undefined;

const serializers = {
  req: () => {
    return undefined;
  },
  res: () => {
    return undefined;
  },
};
const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
    level: process.env.LOG_LEVEL || 'info',
  },
  transport
);

const pinoMiddleware = pinoHttp({
  logger,
  serializers,
  autoLogging: false,
});

const logRequestsDetails = (err, req, res, next) => {
  req.log.info(`[${req.method}] ${req.url} ${JSON.stringify(req.body)}`);

  res.on('finish', () => {
    const statusCode = res.statusCode;

    if (statusCode === 400 || statusCode === 404 || statusCode === 500) {
      req.log.error(`[${req.method}] ${req.originalUrl} - ${statusCode}`);
    } else {
      req.log.info(`[${req.method}] ${req.originalUrl} - ${statusCode}`);
    }

    if (res.locals.error) {
      req.log.error(`Error details: ${res.locals.error.stack}`);
    }
  });

  next(err);
};

module.exports = { pinoMiddleware, logRequestsDetails };
