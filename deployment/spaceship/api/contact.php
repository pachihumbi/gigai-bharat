<?php
/**
 * Contact API fallback for Spaceship shared hosting (no Node SSR).
 * Set secrets via cPanel → MultiPHP INI or replace placeholders below.
 * Upload to: public_html/api/contact.php
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// --- Configure in cPanel environment or edit here ---
const RESEND_API_KEY = ''; // re_...
const TURNSTILE_SECRET = ''; // optional; leave empty to skip
const EMAIL_FROM = 'GigAI Bharat <no-reply@bharatgig.live>';
const SITE_ORIGIN = 'https://www.bharatgig.live';

function client_ip(): string {
    return $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? '0.0.0.0';
}

function rate_limit_ok(string $key): bool {
    $file = sys_get_temp_dir() . '/gigai_contact_' . md5($key) . '.json';
    $now = time();
    $window = 3600;
    $max = 10;
    $data = ['count' => 0, 'start' => $now];
    if (is_file($file)) {
        $data = json_decode((string) file_get_contents($file), true) ?: $data;
        if ($now - ($data['start'] ?? 0) > $window) {
            $data = ['count' => 0, 'start' => $now];
        }
    }
    if (($data['count'] ?? 0) >= $max) {
        return false;
    }
    $data['count'] = ($data['count'] ?? 0) + 1;
    file_put_contents($file, json_encode($data));
    return true;
}

function verify_turnstile(?string $token): bool {
    if (TURNSTILE_SECRET === '' || $token === null || $token === '') {
        return TURNSTILE_SECRET === '';
    }
    $payload = http_build_query([
        'secret' => TURNSTILE_SECRET,
        'response' => $token,
        'remoteip' => client_ip(),
    ]);
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 10,
        ],
    ]);
    $raw = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
    if ($raw === false) {
        return false;
    }
    $json = json_decode($raw, true);
    return ($json['success'] ?? false) === true;
}

function send_resend(array $payload): bool {
    if (RESEND_API_KEY === '') {
        return false;
    }
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Authorization: Bearer " . RESEND_API_KEY . "\r\nContent-Type: application/json\r\n",
            'content' => json_encode($payload),
            'timeout' => 15,
        ],
    ]);
    $raw = @file_get_contents('https://api.resend.com/emails', false, $ctx);
    return $raw !== false;
}

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

if (!rate_limit_ok('contact:' . client_ip())) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests. Please try again later.']);
    exit;
}

$name = trim((string) ($body['name'] ?? ''));
$email = trim((string) ($body['email'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));
$topic = trim((string) ($body['topic'] ?? 'general'));
$turnstile = $body['turnstileToken'] ?? null;

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Validation failed']);
    exit;
}

if (!verify_turnstile(is_string($turnstile) ? $turnstile : null)) {
    http_response_code(403);
    echo json_encode(['error' => 'Security verification failed']);
    exit;
}

$adminTo = match ($topic) {
    'investors' => 'investors@bharatgig.live',
    'careers' => 'careers@bharatgig.live',
    'partnerships' => 'partnerships@bharatgig.live',
    default => 'support@bharatgig.live',
};

$id = bin2hex(random_bytes(8));
$adminOk = send_resend([
    'from' => EMAIL_FROM,
    'to' => [$adminTo],
    'reply_to' => $email,
    'subject' => "[GigAI Bharat] {$topic} inquiry from {$name}",
    'html' => "<p><strong>{$name}</strong> &lt;{$email}&gt;</p><p>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</p>",
]);

if (!$adminOk) {
    http_response_code(503);
    echo json_encode(['error' => 'Email service unavailable']);
    exit;
}

send_resend([
    'from' => EMAIL_FROM,
    'to' => [$email],
    'subject' => 'We received your message — GigAI Bharat',
    'html' => '<p>Thank you for contacting GigAI Bharat. Our team will respond shortly.</p>',
]);

echo json_encode(['ok' => true, 'id' => $id]);
