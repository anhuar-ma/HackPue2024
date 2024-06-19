// cursos.js

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el idusuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idusuario = urlParams.get('person');
    const idCurso = urlParams.get('course');
    if (!idusuario) {
        console.error('ID de usuario no encontrado en la URL.');
        return;
    }

    // Obtener referencia al contenedor de cursos
    const tareasContainer = document.getElementById('tareasContainer');

    // Hacer solicitud AJAX para obtener los cursos del usuario
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/tareas?course='+ idCurso +'&person=' + idusuario, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var tareas = JSON.parse(xhr.responseText);
            mostrarTareas(tareas);
        } else {
            console.error('Error al obtener temas:', xhr.statusText);
        }
    };
    xhr.send();

    // Función para mostrar los cursos en la página
    function mostrarTareas(tareas) {
        tareas.forEach(tarea => {
            if (tarea.status == "Completado") {
                var tareaHTML = `
                <div class="tarea">
                        <div class="contenido-tarea">
                            <h3 class="titulo-curso">${tarea.title}</h3>
                            <p class="precio">${tarea.descrip}</p>
                        </div>
                        <div class="boton-tarea">
                            <a href="${tarea.preguntasHTML}?person=${tarea.user_id}&course=${tarea.course_id}" class="boton-amarillo-block"> Contestar </a>
                        </div><!--.contenido-anuncio-->
                    </div><!--anuncio--> `;  
                
                tareasContainer.innerHTML += tareaHTML;            
            }else{
                var tareaHTML = `
                <div class="tarea">
                        <div class="contenido-tarea">
                            <h3 class="titulo-curso">${tarea.title}</h3>
                            <p class="precio">${tarea.descrip}</p>
                        </div>
                        <div class="boton-tarea">
                            <a href="${tarea.preguntasHTML}?person=${tarea.user_id}&course=${tarea.course_id}" class="boton-amarillo-block"> Repasar </a>
                        </div><!--.contenido-anuncio-->
                    </div><!--anuncio--> `;  
                
                tareasContainer.innerHTML += tareaHTML;            }

        });
    }

    // Enlace al perfil del usuario
    const perfilLink = document.getElementById('perfilLink');
    perfilLink.href = `perfil.html?id=${idusuario}`;
});
