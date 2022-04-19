DEFAULT IMAGE TO CREATE ACCOUNT:

Librerias utilizadas:
firebase.

Utils creados:
storage (Utils/firebase).

Descripcion Controladores:

createDefaultImage:

1. Definimos cual será la storage (almacenamiento) del archivo y la ruta que tendrá en el mismo.

const imgRef = ref(storage, `defaultImagePicture/${req.file.originalname}`);

2. Utilizamos la variable result para almacenar la imagen temporalmente. El primer parametro es la storage con su ruta de almacenamiento y el segundo es la imagen que se carga por default.

const result = await uploadBytes(imgRef, req.file.buffer);

3. Almacenamos el path de la imagen en la base de datos.

const newImageDefault = await Image.create({
img: result.metadata.fullPath
});

selectDefaultImage:

1. Traemos todas las imagenes de la base de datos.

const img = await Image.find({});

2. Convertimos el path almacenado en la base de datos a la url para que el cliente la utilice.

const imgsPromises = img.map(async ({ img }) => {
const imgRef = ref(storage, img);

    const imgDownloadUrl = await getDownloadURL(imgRef);

    return { img: imgDownloadUrl };

});

const resolvedImg = await Promise.all(imgsPromises);
