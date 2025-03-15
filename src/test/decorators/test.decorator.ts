// Este decorador es para metodos de servicion, para hacerlo para metodos de controllers tengo que hacer opcional el propertyDescriptor
// const originalMethod? = propertyDescriptor.value;
export function TestDecorator() {

  return (
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      //----------------------- ANTES del metodo ------------------------------------------------------
      console.log('Antes del metodo')
      console.log('Desde los decoradores como este NO puedo acceder a los metodos de la clase que esta siendo decorada. Eso lo puedo hacer con el interceptor')
      console.log('Desde los decoradores como este puedo acceder a los parametros.')
      const id = args[0];
      console.log(`Este es el id obtenido desde el decorador: ${id}`)
      //const updateUserDto = args[1];
      //const activeUser = args[2];

      console.log(`Todos los argumentos son: ${args}`)
      console.log(`Con el propertyKey accedo al metodo que ejecuto el metodo: ${propertyKey}`)

      //-------------------------------------------------------------------------------------------------
      const result = await originalMethod.apply(this, args); // Ejecutar el método original
      //----------------------- DESPUES del metodo ------------------------------------------------------
      console.log('Despues de la ejecucion del método');
      console.log(`El resultado del metodo es: ${result}`)

    };

    return propertyDescriptor;
  };
}
