<?php

namespace App\Controllers\Api;

use App\Models\KategoriModel;
use CodeIgniter\HTTP\ResponseInterface;

class KategoriController extends BaseApiController
{
    private KategoriModel $kategoriModel;

    public function __construct()
    {
        $this->kategoriModel = new KategoriModel();
    }

    public function index(): ResponseInterface
    {
        return $this->success(
            'Data kategori berhasil diambil.',
            $this->kategoriModel->orderBy('id', 'DESC')->findAll()
        );
    }

    public function create(): ResponseInterface
    {
        $data = $this->requestData();

        if (! $this->validateData($data, $this->rules())) {
            return $this->validationError($this->validator->getErrors());
        }

        if ($this->slugExists((string) $data['slug'])) {
            return $this->error('Slug kategori sudah digunakan.', 422);
        }

        $this->kategoriModel->insert($this->payload($data));
        $kategori = $this->kategoriModel->find($this->kategoriModel->getInsertID());

        return $this->success('Kategori berhasil ditambahkan.', $kategori, 201);
    }

    public function update(int $id): ResponseInterface
    {
        if ($this->kategoriModel->find($id) === null) {
            return $this->error('Kategori tidak ditemukan.', 404);
        }

        $data = $this->requestData();

        if (! $this->validateData($data, $this->rules())) {
            return $this->validationError($this->validator->getErrors());
        }

        if ($this->slugExists((string) $data['slug'], $id)) {
            return $this->error('Slug kategori sudah digunakan.', 422);
        }

        $this->kategoriModel->update($id, $this->payload($data));

        return $this->success('Kategori berhasil diperbarui.', $this->kategoriModel->find($id));
    }

    public function delete(int $id): ResponseInterface
    {
        if ($this->kategoriModel->find($id) === null) {
            return $this->error('Kategori tidak ditemukan.', 404);
        }

        $this->kategoriModel->delete($id);

        return $this->success('Kategori berhasil dihapus.');
    }

    private function rules(): array
    {
        return [
            'nama_kategori' => 'required|max_length[100]',
            'slug'          => 'required|max_length[100]|regex_match[/^[a-z0-9-]+$/]',
        ];
    }

    private function payload(array $data): array
    {
        return [
            'nama_kategori' => trim((string) $data['nama_kategori']),
            'slug'          => trim((string) $data['slug']),
        ];
    }

    private function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        $builder = $this->kategoriModel->where('slug', trim($slug));

        if ($ignoreId !== null) {
            $builder->where('id !=', $ignoreId);
        }

        return $builder->first() !== null;
    }
}
