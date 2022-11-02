// import { join } from 'path';
// import winstonDaily from 'winston-daily-rotate-file';
// import winston from 'winston';
// import { existsSync, mkdirSync } from 'fs';

// const logDirectory = join(__dirname, '..', '..', 'logs');
// if (!existsSync(logDirectory)) mkdirSync(logDirectory);
  
// const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

// const Logger = winston.createLogger({
//     format: winston.format.combine(
//       winston.format.timestamp({
//         format: 'YYYY-MM-DD HH:mm:ss',
//       }),
//       logFormat,
//     ),
//     transports: [
//       // debug log setting
//       new winstonDaily({
//         level: 'debug',
//         datePattern: 'YYYY-MM-DD',
//         dirname: logDirectory + '/debug', // log file /logs/debug/*.log in save
//         filename: `%DATE%.log`,
//         maxFiles: 30, 
//         json: false,
//         zippedArchive: true,
//       }),
//       // error log setting
//       new winstonDaily({
//         level: 'error',
//         datePattern: 'YYYY-MM-DD',
//         dirname: logDirectory + '/error', // log file /logs/error/*.log in save
//         filename: `%DATE%.log`,
//         maxFiles: 30, // 30 Days saved
//         handleExceptions: true,
//         json: false,
//         zippedArchive: true,
//       }),
//     ],
//   });
  

// export default Logger;