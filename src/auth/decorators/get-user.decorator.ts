// Este decorador personalizado lo que hace es asegurarce que el usuario lo estemos obteniendo del contexto.
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(        // createParamDecorator: crea el decorador
    ( data: string, ctx: ExecutionContext ) => {    // Recibe la data que le enviamos por parametro y el contexto desde donde es llamado.

        const req = ctx.switchToHttp().getRequest();  // ctx: es el contexto, y de aca extrae el request, por eso no aseguramos que el usuario sea del contexto.
        const user = req.user;

        //console.log(user)

        if ( !user )
            throw new InternalServerErrorException('User not found (request)');  
            // Si obtenemos este error es porque tenemos un error en el backend porque llego hasta aqui sin autorizar un token.

        return ( !data ) 
            ? user 
            : user[data];
        
    }
);