import fs from "fs";
import { HttpExchangeReader, HttpExchange } from "http-types";

export const readExchanges = (jsonlFilename: string): HttpExchange[] => {
  const jsonlStr = fs.readFileSync(jsonlFilename, { encoding: "utf-8" });
  const exchanges: HttpExchange[] = [];
  HttpExchangeReader.fromJsonLines(jsonlStr, exchange => exchanges.push(exchange));
  return exchanges;
};
