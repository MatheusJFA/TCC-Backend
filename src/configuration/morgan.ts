import { Enviroment } from "@/types/enviroment.type";
import morgan, { StreamOptions } from "morgan";
import enviroment from "./enviroment";
import Logger from "./logger";


const skip = () => {
  return  enviroment.node_enviroment !== Enviroment.DEVELOPMENT;
};

const stream: StreamOptions = {
  write: (message) => {
    console.log(message);
    Logger.http(message);
  },
};


const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;