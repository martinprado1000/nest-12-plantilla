// Este decorador es el que obtiene el usuario del request y lo retorna al parametro del metodo que lo llamo.
// Este decorador personalizado en si se asegura que el usuario lo estemos obteniendo del contexto y no del request, seria lo mismo pero mas seguro.

import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

export const GetUser = createParamDecorator(        // createParamDecorator: crea el decorador
    ( data: string, ctx: ExecutionContext ) => {    // Recibe la data que le enviamos por parametro y el contexto desde donde es llamado. Que generalmente no le enviamos nada, seria para si queremos agregar algo al request obtenido

        const req = ctx.switchToHttp().getRequest();  // ctx: es el contexto, y de aca extrae el request, por eso no aseguramos que el usuario sea del contexto.
                  
        // let user = req.user; // Reemplazo esta linea por la siguiente para eliminar el password y no enviarla al metodo que solicita el usario activo.
        const user = req.user.toObject ? req.user.toObject() : instanceToPlain(req.user); // Convertir el documento de Mongoose en un objeto plano
        delete user.password;

        if ( !user )
            throw new InternalServerErrorException('User not found (request)');  
            // Si obtenemos este error es porque tenemos un error en el backend porque llego hasta aqui sin autorizar un token.

        return ( !data ) 
            ? user 
            : user[data];
        
    }
);