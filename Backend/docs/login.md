LOGIN:

Librerias utilizadas:
express, jsonwebtoken, bcryptjs

Middlewares creados:
globalErrorHandler(Middleware/error.middleware) y validateSession (Middleware/auth.middlware)

Utils creados:
catchAsync (Utils/catchAsync), AppError (Utils/AppError)

Descripción Middlewares:

globalErrorHandler:

Se crea este middlware para que podamos enviar respuestas de errores de manera global usando nuestro constructor AppError. Se importa y se utiliza en el app.js

validateSession:

Se crea este middlware para que podamos validar si un usuario tiene un sesión valida para la utilización de futuras rutas. Tambien se crea en el objeto request, la propiedad user para que podamos utilizarla en otros controladores, en donde se excluye la contraseña de dicho usuario por seguridad. (Se utilizó el metodo de validación Bearer Token). Se importa y se utiliza en el router que necesite que las rutas tengan inicio de sesión.

Descripción Middlewares:

catchAsync:

Se crea este util para el manejo de errores en los controlladores utilizando el parametro next(). Se importa y se utiliza en cada controllador.

AppError:

Se crea este constructor para la captación de errores, cuyos parametros acepta (Codigo de estado de respuesta HTTP, Mensaje para el cliente). Se importa y se utiliza donde se requiera crear un error

Descripción Controladores:

loginUser:

1. En el controlador de user, se crea la función "loginUser", la cual recibe un username y password para el login.

const { username, password } = req.body;

2. Buscamos el usuario que requiere loguear a traves de las queries de mongoose.

const user = await User.findOne({ username });

3. Comparamos si la contraseña entregaba por el usuario corresponde a la información suministrada en la base de datos a traves de bcryptjs, dado que al realizar la creación de cuenta, se encriptan cada una de las contraseñas.

const isPasswordValid = await bcrypt.compare(password, user.password);

4. Si la contraseña es correcta, procedemos a realizar la creación del token para el usuario. Dicha vigencia y key se encuentra en la variable de enterno (Dato interno).

const token = await jwt.sign({ id: user.\_id }, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRES_IN
});

5. (Error). Si no encuentra el usuario o la contraseña no corresponde, se envía un error como uns instancia a traves de el constructor AppError.

if (!user || !isPasswordValid) {
return next(new AppError(400, "Credentials are invalid"));
}

checkToken:

1. Se crea esta ruta para que se pueda validar si el token aún se encuentra en vigencia
