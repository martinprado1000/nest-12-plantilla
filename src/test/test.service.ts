import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {

  findAll() {
    console.log(
      'Segundo: Lo segundo que se ejecuta es lo del controlador y servicio, Este es el servicio',
    );
    return `This action returns test1`;
  }

  findAll2() {
    console.log(
      'Segundo: Lo segundo que se ejecuta es lo del controlador y servicio, Este es el servicio',
    );
    return `This action returns test2`;
  }

  update() {
    return `This action returns test3`;
  }

  remove(id: string) {
    return `This action returns test4, el id pasado es: ${id}`;
  }

  // async findOneResponse(id: string) {
  //   return `Esto es el retorno de findOneResponse del servicio TestService`;
  // }
  
}
