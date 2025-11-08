<?php

require_once 'db_connect.php';

header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$userId = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);
$puzzleId = filter_input(INPUT_GET, 'puzzle_id', FILTER_VALIDATE_INT);

if (!$userId || !$puzzleId) {
    echo json_encode(['success' => false, 'message' => 'Missing user or puzzle ID in GET request.']);
    exit;
}

$sql = "SELECT grid_state FROM user_progress WHERE user_id = ? AND puzzle_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database preparation error.']);
    $conn->close();
    exit;
}

$stmt->bind_param("ii", $userId, $puzzleId);

if ($stmt->execute()) {
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'success' => true, 
            'grid_state' => $row['grid_state']
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'grid_state' => null, 
            'message' => 'No saved progress found.'
        ]);
    }
} else {
    // Failed
    echo json_encode(['success' => false, 'message' => 'Database execution error.']);
}

$stmt->close();
$conn->close();
?>
