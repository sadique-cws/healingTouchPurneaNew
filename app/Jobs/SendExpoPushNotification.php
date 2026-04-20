<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendExpoPushNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public string $token,
        public string $title,
        public string $body,
        public array $data = [],
        public string $sound = 'default',
    ) {}

    public function handle(): void
    {
        $token = trim($this->token);

        if ($token === '') {
            Log::warning('[ExpoPush] Empty token, skipping push notification.');
            return;
        }

        $payload = [
            'to' => $token,
            'title' => $this->title,
            'body' => $this->body,
            'sound' => $this->sound,
            'data' => $this->data,
        ];

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post('https://exp.host/--/api/v2/push/send', $payload);

            if (! $response->successful()) {
                Log::warning('[ExpoPush] Push request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'payload' => $payload,
                ]);
                return;
            }

            Log::info('[ExpoPush] Push sent successfully.', [
                'token' => $token,
                'payload' => $payload,
            ]);
        } catch (\Throwable $e) {
            Log::error('[ExpoPush] Push notification error: ' . $e->getMessage(), [
                'payload' => $payload,
            ]);
        }
    }
}
