<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información del Usuario</title>
    <link rel="stylesheet" href="css/styleProfile.css">
</head>
<body>
<div class="sidebar">
    <img src="img/logos.svg" alt="Logo principal">
    <a href="cursos.php?id=<?php echo $_GET["id"];?>">Cursos</a>
    <a href="perfil.php?id=<?php echo $_GET["id"];?>">Mi perfil</a>
    <a href="ajustes.html">Ajustes</a>
    <a href="index.php">Cerrar sesión</a>
</div>
    <?php
    require "database.php";
    $pdo = Database::connect();

    $sql = '
    SELECT * FROM users WHERE user_id = '.$_GET["id"].'
    ';
	$stmt = $pdo->query($sql);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo '
    <div class="user-info-container">
        <div class="user-profile">
            <img src="uploads/'.$result["pfp"].'" alt="Avatar del Usuario" class="user-avatar">
            <h1>Información del Usuario</h1>
        </div>
        <div class="user-details">
            <p><strong>Nombre: </strong>'.$result["first_name"]." ".$result["last_name"].'</p>
            <p><strong>Correo Electrónico: </strong>'.$result["email"].'</p>
            <p><strong>Rol: </strong>'.$result["role"].'</p>
            <p><strong>Idioma Preferido: </strong>'.$result["preferred_language"].'</p>
        </div>
    </div>
        ';
    ?>

</body>
</html>
