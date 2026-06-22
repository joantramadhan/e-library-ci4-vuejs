<?php

namespace App\Controllers\Api;

use App\Libraries\TokenService;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends BaseApiController
{
    public function login(): ResponseInterface
    {
        $data = $this->requestData();

        $validation = service('validation');
        $validation->setRules([
            'username' => 'required|max_length[50]',
            'password' => 'required',
        ]);

        if (! $validation->run($data)) {
            return $this->validationError($validation->getErrors());
        }

        $user = (new UserModel())
            ->where('username', trim((string) $data['username']))
            ->first();

        if ($user === null || ! password_verify((string) $data['password'], $user['password'])) {
            return $this->error('Username atau password salah.', 401);
        }

        $token = (new TokenService())->create((int) $user['id'], $user['username']);
        unset($user['password']);

        return $this->success('Login berhasil.', [
            'token_type' => 'Bearer',
            'token'      => $token,
            'user'       => $user,
        ]);
    }
}
