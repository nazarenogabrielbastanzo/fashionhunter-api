# Fashion Hunter - Backend

Este es el repositorio donde el grupo c4-05-m del programa NoCountry.

## Uso:

1. Clonar el repositorio con la rama `backend-prod`:
    ```sh
    git clone https://github.com/No-Country/c4-05-m.git --branch backend-prod
    ```
2. Moverse a la carpeta del proyecto y luego al folder /Backend:
    ```sh
    cd c4-05-m/Backend
    ```
3. Instalar los paquetes necesarios:
    ```sh
    npm install
    ```
4. Correr el siguiente npm script (solo usar npm, evitar yarn o pnpm):
    ```sh
    npm run start
    ```
5. Resultado esperado:
    ```sh
    > c4-05-m@1.0.0 prestart
    > node decode.js

    Importando variables de entorno...
    El archivo ./.config.env ha sido creado o actualizado!

    > c4-05-m@1.0.0 start
    > nodemon server.js

    [nodemon] 2.0.15
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node server.js`
    Documentacion: https://documenter.getpostman.com/view/18428706/UVyrVciL
    --- List of endpoints ---
    POST,GET - http://localhost:3000/api/v1/user/user
    POST - http://localhost:3000/api/v1/user/login
    POST - http://localhost:3000/api/v1/user/send-reset-password
    POST - http://localhost:3000/api/v1/user/reset-password
    POST,GET - http://localhost:3000/api/v1/user/img
    GET - http://localhost:3000/api/v1/user/check-token
    --- End of list ---
    ✓ DB Connected
    ```