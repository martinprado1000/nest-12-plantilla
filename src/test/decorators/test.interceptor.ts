import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//------------------------Interceptor 1------------------------------------------------------------------
@Injectable()
export class TestInterceptor1 implements NestInterceptor {

  // DESDE LOS INTERCEPTORS PUEDO ACCEDER A LOS METODOS DE LAS CLASES

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Primero: Esto se ejecuta primero, Este es el interceptor 1');
    const now = Date.now();

    return next.handle()  // next.handle() es lo que llama al metodo que lo ejecuto para que haga lo que tenga que hacer y vuelva
      .pipe(
        tap(() => console.log(`Tercero: Lo que retorna es lo que se ejecuta ultimo, esto es el interceptor 1... Tiempo de ejecución: ${Date.now() - now}ms`)),
      );
  }
}


//------------------------Interceptor 2------------------------------------------------------------------
@Injectable()
export class TestInterceptor2 implements NestInterceptor {

  // Definición de la función que deseas ejecutar
  private customFunction(): void {
    console.log('función ejecutada desde el interceptor 2');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // Llamada a la función antes de ejecutar el metodo
    this.customFunction();

    return next
      .handle()
      .pipe(
        tap((value) => {  // Aca obtengo lo que retorna el metodo o clase que ejecuto el interceptor
          console.log(`Esto se imprime desde el intercetor 2 y es la respuesta del metodo que lo ejecutó${value}`)
          this.customFunction(); // Llamada a la función antes de ejecutar el metodo
        }),
      );
  }
}

//------------------------Interceptor 3------------------------------------------------------------------
@Injectable()
export class TestInterceptor3 implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // El interceptor tiene acceso al request
    const req = context.switchToHttp().getRequest(); // Obtener la request
    const user = req.user; // Usuario del request si existe
    const method = req.method; // Método HTTP (POST, PATCH, DELETE, etc.)
    const entity = context.getClass().name; // Nombre del controlador
    const entityId: string = req.params.id;

    //console.log(req)  // No lo imprimo porque trae muchas cosas
    console.log(user)   // En este caso el user no existe por lo tanto retorna undefined
    console.log(method)
    console.log(entity)
    console.log(`Esta es el id de la entidad pasada por parametro ${entityId}`)

    return next
      .handle()
      .pipe(
        tap((value) => {  // Aca obtengo lo que retorna el metodo o clase que ejecuto el interceptor
          console.log(`Esto se imprime desde el intercetor y esto la respuesta del metodo que lo ejecutó: ${value}`)
        }),
      );
  }
}