// cursos.js

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el idusuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idusuario = urlParams.get('id');
    HTMLFormControlsCollection
    if (!idusuario) {
        console.error('ID de usuario no encontrado en la URL.');
        return;
    }

    // Obtener referencia al contenedor de cursos
    const perfilContainer = document.getElementById('perfilContainer');

    // Hacer solicitud AJAX para obtener los cursos del usuario
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/perfil?id=' + idusuario, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var perfiles = JSON.parse(xhr.responseText);
            mostrarPerfiles(perfiles);
        } else {
            console.error('Error al obtener el perfils:', xhr.statusText);
        }
    };
    xhr.send();

    // Función para mostrar los cursos en la página
    function mostrarPerfiles(perfiles) {
        perfiles.forEach(perfil => {
                var perfilHTML = ` 
                    <div class="user-profile">
                        <img src="uploads/${perfil.pfp}" alt="Avatar del Usuario" class="user-avatar">
                        <h1>Información del Usuario</h1>
                    </div>
                    <div class="user-details">
                        <p><strong>Nombre: </strong>${perfil.first_name}" "${perfil.last_name}</p>
                        <p><strong>Correo Electrónico: </strong>${perfil.email}</p>
                        <p><strong>Rol: </strong>${perfil.role}</p>
                        <p><strong>Idioma Preferido: </strong>${perfil.preferred_language}</p>
                    </div>`;  
                
                    perfilContainer.innerHTML += perfilHTML;            
            
        });
    }

    // Enlace al perfil del usuario
    const perfilLink = document.getElementById('perfilLink');
    perfilLink.href = `perfil.html?id=${idusuario}`;

    const cursosLink = document.getElementById('cursosLink');
    cursosLink.href = `cursos.html?id=${idusuario}`;
});
