// Este decorador de parámetro personalizado lo que hace es asegurarce que el usuario lo estemos obteniendo del contexto.
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const EmailTest = createParamDecorator(              // createParamDecorator: crea el decorador de parametros.
    ( data: string, ctx: ExecutionContext ) => {            // Recibe la data que le queramos enviar y el contexto desde donde es llamado.
    
        // console.log({data}) // Si le pase aca viene los parametros
    
        const req = ctx.switchToHttp().getRequest();        // ctx: es el contexto, y de aca extrae el request, por eso no aseguramos que el usuario sea del contexto.
        const user = req.user;

        //console.log(user)

        return ( data == 'email' ) 
            ? `Me mandaste el parametro email asi que lo paso: ${user.email}` 
            : "No mando el parametro email";
    }
);