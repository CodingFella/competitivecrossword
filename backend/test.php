<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// read file
$filename = 'puzzle.puz';
$handle = fopen($filename, 'rb');
$data = fread($handle, filesize($filename));
fclose($handle);


$width = ord($data[0x2C]);
$height = ord($data[0x2D]);
$numClues = unpack('v', substr($data, 0x2E, 2))[1]; // 'v' = little-endian 16-bit

$bodyOffset = 0x34;
$solution = substr($data, $bodyOffset, $width * $height);

$bodyOffset += $width * $height;
$grid = substr($data, $bodyOffset, $width * $height);

$bodyOffset += $width * $height;
$cluesRaw = substr($data, $bodyOffset);

$clues = explode("\0", $cluesRaw);


$puzzle = [
    'width' => $width,
    'height' => $height,
    'numClues' => $numClues,
    'clues' => $clues,
    'solution' => $solution,
    'grid' => $grid
];

echo json_encode($puzzle);

?>
