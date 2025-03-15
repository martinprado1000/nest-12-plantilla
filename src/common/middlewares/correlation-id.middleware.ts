import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

const CORRELATION_ID_HEADER = 'X-Correlation-Id'; // Define el nombre de la cabecera HTTP que se utilizará para el Correlation ID

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {

  private static asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>(); //  Crea una instancia de AsyncLocalStorage. Almacenará objetos del tipo Map<string, any> tanto la clave como el valor seran de tipo string.

  use(req: Request, res: Response, next: NextFunction): void {

    const id = (req.headers[CORRELATION_ID_HEADER] as string) || uuidv4(); // Intenta recuperar el Correlation ID de la cabecera HTTP de la solicitud. Si no existe, genera uno nuevo con uuidv4.
    const store = new Map(); // Crea una nueva instancia Map que es una estructura de datos nativa de JavaScript. Permite almacenar pares clave-valor. (Nada que ver con el .map para recorrer un arreglo)
    store.set(CORRELATION_ID_HEADER, id); // Setea la clave|valor en la variable store

    CorrelationIdMiddleware.asyncLocalStorage.run(store, () => {
      req[CORRELATION_ID_HEADER] = id;
      res.set(CORRELATION_ID_HEADER, id);
      next();
    });
  }

  static getCorrelationId(): string | undefined { // Esta funcion permite recuperar el Correlation ID del almacenamiento en cualquier lugar de la aplicación
    const store = CorrelationIdMiddleware.asyncLocalStorage.getStore(); // Recupera el valor almacenado para el contexto LocalStorage asincrónico actual.
    return store ? store.get(CORRELATION_ID_HEADER) : undefined;
  }
}