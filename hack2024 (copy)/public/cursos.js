// cursos.js

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el idusuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idusuario = urlParams.get('id');

    if (!idusuario) {
        console.error('ID de usuario no encontrado en la URL.');
        return;
    }

    // Obtener referencia al contenedor de cursos
    const cursosContainer = document.getElementById('cursosContainer');

    // Hacer solicitud AJAX para obtener los cursos del usuario
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/cursos?id=' + idusuario, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var cursos = JSON.parse(xhr.responseText);
            mostrarCursos(cursos);
        } else {
            console.error('Error al obtener cursos:', xhr.statusText);
        }
    };
    xhr.send();

    // Función para mostrar los cursos en la página
    function mostrarCursos(cursos) {
        cursos.forEach(curso => {
            var cursoHTML = `
            <div class="anuncio">
                <picture>
                    <img src="img/${curso.img}" alt="Logo del curso">
                </picture>

                <div class="contenido-anuncio">
                    <h3 class="titulo-curso">${curso.title}</h3>
                    <p class="precio">${curso.instructor}</p>

                    <a href="tareas.html?course=${curso.course_id}&person=${idusuario}" class="boton-amarillo-block">
                        Ver Curso
                    </a>
                </div><!--.contenido-anuncio-->
            </div><!--.anuncio-->`;

            cursosContainer.innerHTML += cursoHTML;
        });
    }

    // Enlace al perfil del usuario
    const perfilLink = document.getElementById('perfilLink');
    perfilLink.href = `perfil.html?id=${idusuario}`;

    const cursosLink = document.getElementById('cursosLink');
    cursosLink.href = `cursos.html?id=${idusuario}`;
});
