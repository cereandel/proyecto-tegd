# Proyecto StayWise

Este proyecto utiliza Django para el backend y Tailwind/PostCSS para el manejo de estilos en el frontend.

## Instalación de dependencias

### 1. Python (Django y otros paquetes)

Instala las dependencias de Python usando pip:

```bash
pip install -r requirements.txt
```

### 2. Node.js (Tailwind)

en la carpeta de theme y ejecuta:

```bash
cd theme/static_src
npm install
```

## Archivos importantes

- `requirements.txt`: Dependencias de Python/Django.
- `theme/static_src/package.json`: Dependencias de Node para estilos.
- `.gitignore`: Configurado para evitar archivos innecesarios en el repositorio.

## Configuración del archivo .env

Para manejar variables de entorno crear un .env en la raiz del directorio, les muestro como tengo el mio. 
pero puede cambiar dependiendo de como configuren la bd

```
MONGO_URL=mongodb://localhost:27017
MONGO_DB=staywise
```

Este archivo está incluido en `.gitignore` y no se sube al repositorio. Debes crearlo manualmente y completar los valores según tu entorno.

## Ejecutar el proyecto

- tener Python y Node.js instalados.
- Si les da error que no encuentran el npm module avisenme que tuve algunos rollos y lo tuve que quitar del .env
- Para ejecutar el servidor Django:

```bash
python manage.py tailwind dev
```
