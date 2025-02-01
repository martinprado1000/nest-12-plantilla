import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        configService: ConfigService
    ) {
        super({ // PassportStrategy necesita de su contructor para obtener los datos del super.
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Esta es la opcion que le indicamos que el jwt viene en el Bearer Token, del header.
        });
    }

    // Esta es la validacion nuestra de jwt. Si llego a este punto es porque ya existe un jwt y si es valido.
    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        const user = await this.userModel.findById(id);

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        if ( !user.isActive ) // Si no esta activo en la db
            throw new UnauthorizedException('User is inactive, talk with an admin');

        //console.log(user)

        return user; // Agrega user al Request.
    }

}