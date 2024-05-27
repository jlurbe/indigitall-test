const pino = require('pino');
const pinoHttp = require('pino-http');

const transport =
  process.env.DEVELOPMENT === 'true'
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

const logRequestsDetails = (req, res, next) => {
  req.log.info(`[${req.method}] ${req.url} ${JSON.stringify(req.body)}`);

  res.on('finish', () => {
    const statusCode = res.statusCode;

    if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
      req.log.warn(`[${req.method}] ${req.originalUrl} - ${statusCode}`);
    } else if (statusCode === 500) {
      req.log.error(`[${req.method}] ${req.originalUrl} - ${statusCode}`);
    } else {
      req.log.info(`[${req.method}] ${req.originalUrl} - ${statusCode}`);
    }
  });

  next();
};

module.exports = { pinoMiddleware, logRequestsDetails };
