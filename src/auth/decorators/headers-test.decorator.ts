// Este decorador personalizado lo que hace es asegurarce que el usuario lo estemos obteniendo del contexto.
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const HeadersTest = createParamDecorator(       // createParamDecorator: crea el decorador
    ( data: string, ctx: ExecutionContext ) => {            // Recibe la data que le queramos enviar y el contexto desde donde es llamado.
    
        const req = ctx.switchToHttp().getRequest()  // ctx: es el contexto, y de aca extrae el request, por eso no aseguramos que el usuario sea del contexto.
        return req.rawHeaders;

 
    }
);