<?php
/**
 * Contact form proxy for static marketing on Spaceship (PHP/LiteSpeed).
 * Set GIGAI_CONTACT_API_URL to a backend implementing POST /api/contact.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: https://www.bharatgig.live');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$target = getenv('GIGAI_CONTACT_API_URL') ?: '';
if ($target === '') {
    http_response_code(503);
    echo json_encode(['error' => 'Contact API not configured (set GIGAI_CONTACT_API_URL)']);
    exit;
}

$body = file_get_contents('php://input');
if ($body === false || $body === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Empty body']);
    exit;
}

$headers = [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? ''),
];
$secret = getenv('GIGAI_CONTACT_API_SECRET') ?: '';
if ($secret !== '') {
    $headers[] = 'X-GigAI-Contact-Secret: ' . $secret;
}

$ch = curl_init($target);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FOLLOWLOCATION => false,
]);

$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream failed', 'detail' => $err]);
    exit;
}

http_response_code($status > 0 ? $status : 502);
echo $response;
