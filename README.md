## To Do App

Bienvenidos a la demo de To Do App

Esta es una aplicación web responsive que permite a los usuarios gestionar sus tareas de manera sencilla y eficaz. La aplicación incluye una barra lateral de navegación que organiza las tareas en diferentes secciones, por ahora son:

- **Mis tareas:** La sección principal donde se crean y gestionan las tareas.
- **Destacadas:** Contiene las tareas que son consideradas más importantes.
- **Eliminadas:** Funciona como una papelera de reciclaje, permitiendo la recuperación de tareas antes de su permanente eliminación.

## Características principales

- Agregar nuevas tareas
- Editar tareas existentes
- Destacar y separar tareas más relevantes
- Eliminar tareas
- Recuperar tareas eliminadas
- Búsqueda de tareas
- Interfaz de usuario responsive
- Pantalla de carga animada
- **Persistencia de datos con `localStorage`**

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript
- Bootstrap
- Font Awesome

## Instalación

1. Clona este repositorio en tu máquina local.

   ```bash
   git clone https://github.com/IgnacioRodríguezDurán/toDo-app.git
   ```

2. Navega hasta el directorio del proyecto.

   ```bash
   cd toDo-app
   ```

3. Abre el archivo `index.html` en tu navegador.

## Estructura de Archivos

```plaintext
toDo-app/
├── index.html
├── static/
|   ├── img
│   ├── styles.css
│   └── script.js
└── README.md
```

## Uso

1. **Pantalla de Carga:** La aplicación muestra una pantalla de carga animada al inicio a modo de bienvenida.

2. **Agregar Tarea:** Ingresa una nueva tarea en el formulario y haz clic en el botón "Agregar".

3. **Editar Tarea:** Haz clic en el botón "Editar" junto a una tarea para modificar su contenido.

4. **Destacar Tarea:** Haz clic en el botón "Destacar" para marcar una tarea como destacada. Puedes revertir esta acción haciendo clic en "Revertir".

5. **Eliminar Tarea:** Haz clic en el botón "Eliminar" para mover una tarea a la sección "Eliminadas".

6. **Recuperar Tarea:** Haz clic en el botón "Recuperar" en la sección "Eliminadas" para restaurar una tarea.

7. **Limpiar Tareas Eliminadas:** Haz clic en el botón "Limpiar Tareas Eliminadas" para borrar definitivamente el listado de tareas en la papelera.

8. **Búsqueda de Tareas:** Utiliza la barra de búsqueda en la parte superior de la lista de tareas para buscar tareas específicas fácilmente.

9. **Persistencia de Datos:** Las tareas se guardan automáticamente en el `localStorage` del navegador, por lo que no se perderán al recargar la página.

## Personalización

Puedes personalizar la apariencia y el comportamiento de la aplicación editando los archivos `styles.css` y `script.js` en el directorio `static`.

## Contribuciones

¡Las contribuciones son bienvenidas! Si tienes alguna sugerencia o encuentras un problema, por favor abre un issue o envía un pull request.
