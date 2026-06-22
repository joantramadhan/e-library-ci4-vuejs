<?php

namespace App\Controllers\Api;

use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class UserController extends BaseApiController
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index(): ResponseInterface
    {
        $users = array_map(
            fn (array $user): array => $this->withoutPassword($user),
            $this->userModel->orderBy('id', 'DESC')->findAll()
        );

        return $this->success('Data user berhasil diambil.', $users);
    }

    public function create(): ResponseInterface
    {
        $data = $this->requestData();

        if (! $this->validateData($data, $this->createRules())) {
            return $this->validationError($this->validator->getErrors());
        }

        if ($this->usernameExists((string) $data['username'])) {
            return $this->error('Username sudah digunakan.', 422);
        }

        $this->userModel->insert([
            'nama'     => trim((string) $data['nama']),
            'username' => trim((string) $data['username']),
            'password' => password_hash((string) $data['password'], PASSWORD_DEFAULT),
        ]);

        $user = $this->withoutPassword($this->userModel->find($this->userModel->getInsertID()));

        return $this->success('User berhasil ditambahkan.', $user, 201);
    }

    public function update(int $id): ResponseInterface
    {
        if ($this->userModel->find($id) === null) {
            return $this->error('User tidak ditemukan.', 404);
        }

        $data = $this->requestData();

        if (! $this->validateData($data, $this->updateRules($data))) {
            return $this->validationError($this->validator->getErrors());
        }

        if ($this->usernameExists((string) $data['username'], $id)) {
            return $this->error('Username sudah digunakan.', 422);
        }

        $payload = [
            'nama'     => trim((string) $data['nama']),
            'username' => trim((string) $data['username']),
        ];

        if (isset($data['password']) && trim((string) $data['password']) !== '') {
            $payload['password'] = password_hash((string) $data['password'], PASSWORD_DEFAULT);
        }

        $this->userModel->update($id, $payload);

        return $this->success('User berhasil diperbarui.', $this->withoutPassword($this->userModel->find($id)));
    }

    public function delete(int $id): ResponseInterface
    {
        if ($this->userModel->find($id) === null) {
            return $this->error('User tidak ditemukan.', 404);
        }

        $this->userModel->delete($id);

        return $this->success('User berhasil dihapus.');
    }

    private function createRules(): array
    {
        return [
            'nama'     => 'required|max_length[100]',
            'username' => 'required|max_length[50]',
            'password' => 'required|min_length[6]',
        ];
    }

    private function updateRules(array $data): array
    {
        $rules = [
            'nama'     => 'required|max_length[100]',
            'username' => 'required|max_length[50]',
        ];

        if (isset($data['password']) && trim((string) $data['password']) !== '') {
            $rules['password'] = 'min_length[6]';
        }

        return $rules;
    }

    private function usernameExists(string $username, ?int $ignoreId = null): bool
    {
        $builder = $this->userModel->where('username', trim($username));

        if ($ignoreId !== null) {
            $builder->where('id !=', $ignoreId);
        }

        return $builder->first() !== null;
    }

    private function withoutPassword(?array $user): array
    {
        if ($user === null) {
            return [];
        }

        unset($user['password']);

        return $user;
    }
}
