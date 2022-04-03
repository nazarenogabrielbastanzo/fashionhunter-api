# Fashion Hunter API reference

> Esta documentación estará en constante cambio hasta finalizar el proyecto y disponible en su última versión unicamente en la rama `backend-prod`

La siguiente documentación busca mantener informado al grupo de trabajo, como tambien servir de referencia para todo aquel con intención de probar los endpoints y/o propositos de debugging.

## Endpoints

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| POST | http://localhost:3000/api/v1/user/login | Login de usuario |
| POST | http://localhost:3000/api/v1/user/signup | Crear un nuevo usuario |
| POST | http://localhost:3000/api/v1/user/forgotPassword | Enviar email que valida el 'reset password' |
| GET | http://localhost:3000/api/v1/user/all-user | Obtener todos los usuarios (Token requerido) |

**Documentación en Postman: [Fashion Hunter](https://documenter.getpostman.com/view/18428706/UVyrVciL)**

## Modelo Usuario

![userModel.jpeg](Fashion%20Hu%2008741/userModel.jpeg)

### Guía del gráfico:

- Todo `field` contiene, ademas del tipo de dato un campo de `Required` y/o `unique` los cuales denotan obligación por parte de la conexión para la correcta comunicación con la Base de Datos.
- Existen datos que se autogeneran o son de referencia interna y que no necesitan ser llenado por el usuario final o cliente:
    - `passwordChangedAt` - El dato será llenado cuando ocurra un reset de la contraseña con un valor tipo fecha.
    - `PasswordResetToken` - El dato será llenado con un token único que permite reiniciar la contraseña.
    - `PasswordResetExpires` - El dato será llenado con un tiempo de validez para que el usuario pueda reiniciar la contraseña.
    - `role` - Denota el rol que cumple el usuario al crear la cuenta o su permanencia en la plataforma. El valor por defecto es: `'user'` .
    - `active` - Denota si el usuario esta activo o mantiene una cuenta vigente o fue dado de baja.

### Modelado con ODM Mongoose y MongoDB

```jsx
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password and password confirmation do not match"
    },
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  img: {
    type: String
  }
});
```