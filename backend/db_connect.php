<?php
$env = parse_ini_file(__DIR__ . '/.env');

$host = $env['DB_HOST'];
$user = $env['DB_USER'];
$password = $env['DB_PASSWORD'];
$database = $env['DB_DATABASE'];

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

?>
