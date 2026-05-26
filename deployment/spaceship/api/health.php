<?php
/**
 * Health check for Spaceship static deployment.
 * Upload to: public_html/api/health.php
 * .htaccess maps /api/health → health.php (add rule if needed)
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

echo json_encode([
    'ok' => true,
    'service' => 'gigai-bharat-marketing',
    'platform' => 'spaceship-shared',
    'domain' => 'bharatgig.live',
    'timestamp' => gmdate('c'),
    'email' => [
        'resend' => getenv('RESEND_API_KEY') !== false && getenv('RESEND_API_KEY') !== '',
        'from' => 'GigAI Bharat <no-reply@bharatgig.live>',
    ],
], JSON_UNESCAPED_SLASHES);
