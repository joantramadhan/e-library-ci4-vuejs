<?php

namespace App\Libraries;

class TokenService
{
    public function create(int $userId, string $username): string
    {
        $payload = [
            'user_id'    => $userId,
            'username'   => $username,
            'expiration' => time() + $this->expirationSeconds(),
        ];

        $payloadEncoded = $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));

        return $payloadEncoded . '.' . $this->signature($payloadEncoded);
    }

    public function validate(string $token): ?array
    {
        $parts = explode('.', trim($token));

        if (count($parts) !== 2) {
            return null;
        }

        [$payloadEncoded, $signature] = $parts;

        if (! hash_equals($this->signature($payloadEncoded), $signature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($payloadEncoded), true);

        if (! is_array($payload)) {
            return null;
        }

        if (
            ! isset($payload['user_id'], $payload['username'], $payload['expiration'])
            || ! is_numeric($payload['user_id'])
            || ! is_string($payload['username'])
            || ! is_numeric($payload['expiration'])
        ) {
            return null;
        }

        if ((int) $payload['expiration'] < time()) {
            return null;
        }

        return [
            'user_id'    => (int) $payload['user_id'],
            'username'   => $payload['username'],
            'expiration' => (int) $payload['expiration'],
        ];
    }

    private function signature(string $payloadEncoded): string
    {
        return $this->base64UrlEncode(hash_hmac('sha256', $payloadEncoded, $this->secret(), true));
    }

    private function secret(): string
    {
        $secret = (string) env('auth.tokenSecret', '');

        if ($secret === '') {
            return hash('sha256', ROOTPATH . APPPATH);
        }

        return $secret;
    }

    private function expirationSeconds(): int
    {
        $seconds = (int) env('auth.tokenExpiration', 86400);

        return $seconds > 0 ? $seconds : 86400;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}
