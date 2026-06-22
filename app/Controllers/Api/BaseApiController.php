<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

abstract class BaseApiController extends BaseController
{
    protected function requestData(): array
{
    // JSON request
    if ($this->request->is('json')) {
        $json = $this->request->getJSON(true);

        if (is_array($json)) {
            return $json;
        }
    }

    // multipart/form-data dan x-www-form-urlencoded
    $post = $this->request->getPost();

    if (!empty($post)) {
        return $post;
    }

    // PUT/PATCH raw input
    $rawInput = $this->request->getRawInput();

    if (!empty($rawInput)) {
        return $rawInput;
    }

    return [];
}

    protected function success(string $message, mixed $data = null, int $statusCode = 200): ResponseInterface
    {
        $payload = [
            'status'  => true,
            'message' => $message,
        ];

        if ($data !== null) {
            $payload['data'] = $data;
        }

        return $this->response
            ->setStatusCode($statusCode)
            ->setJSON($payload);
    }

    protected function error(string $message, int $statusCode = 400): ResponseInterface
    {
        return $this->response
            ->setStatusCode($statusCode)
            ->setJSON([
                'status'  => false,
                'message' => $message,
            ]);
    }

    protected function validationError(array $errors): ResponseInterface
    {
        return $this->error(implode(' ', $errors), 422);
    }
}
