<?php

require_once 'db_connect.php';

header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$userId = filter_input(INPUT_POST, 'user_id', FILTER_VALIDATE_INT); 
$puzzleId = filter_input(INPUT_POST, 'puzzle_id', FILTER_VALIDATE_INT); 
$gridState = filter_input(INPUT_POST, 'grid_state', FILTER_SANITIZE_SPECIAL_CHARS);

// Basic input check 
if (!$userId || !$puzzleId || $gridState === null) { 
  echo json_encode(['success' => false, 'message' => 'Invalid input data.']); 
  exit; 
}


$sql = "INSERT INTO user_progress (user_id, puzzle_id, grid_state, last_updated) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE grid_state = VALUES(grid_state), last_updated = NOW()";

$stmt = $conn->prepare($sql); 
$stmt->bind_param("iis", $userId, $puzzleId, $gridState);

if ($stmt->execute()) { 
  echo json_encode(['success' => true, 'message' => 'Progress saved successfully.']); 
} else { 
  echo json_encode(['success' => false, 'message' => 'Database error.']); 
}

$stmt->close(); $conn->close(); ?>

