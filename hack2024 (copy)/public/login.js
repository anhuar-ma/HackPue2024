document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
    
    // Get user input
    var email = document.getElementById('email').value;
    var password = document.getElementById('pass').value;
    console.log(email);
    // Validate email and password (basic validation)
    if (email.trim() === '' || password.trim() === '') {
      alert('Email and password are required.');
      return;
    }
    
    // Make AJAX request to server (assuming you use Node.js with Express for the backend)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.success) {
          alert('Login successful!');
          window.location.href = '/cursos.html?id=' + response.idusuario;
          // Redirect to cursos.html with idusuario parameter
        } else {
          alert('Login failed. Please check your email and password.');
        }
      } else {
        alert('Request failed. Please try again later.');
      }
    };


    
    
    var data = JSON.stringify({ email: email, pass: password });
    xhr.send(data);
  });
  