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

## Ejecutar el proyecto

- tener Python y Node.js instalados.
- Para ejecutar el servidor Django:

```bash
python manage.py tailwind dev
```
