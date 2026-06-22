<?php

namespace App\Controllers\Api;

use App\Models\BukuModel;
use CodeIgniter\HTTP\ResponseInterface;

class BukuController extends BaseApiController
{
    private BukuModel $bukuModel;

    public function __construct()
    {
        $this->bukuModel = new BukuModel();
    }

    public function index(): ResponseInterface
    {
        $buku = $this->bukuModel
            ->orderBy('id', 'DESC')
            ->findAll();

        return $this->success('Data buku berhasil diambil.', $buku);
    }

    public function show(int $id): ResponseInterface
    {
        $buku = $this->bukuModel->find($id);

        if ($buku === null) {
            return $this->error('Buku tidak ditemukan.', 404);
        }

        return $this->success('Detail buku berhasil diambil.', $buku);
    }

    public function create(): ResponseInterface
    {
        $data = $this->requestData();

        $file = $this->request->getFile('cover_file');

        if ($file && $file->isValid() && !$file->hasMoved()) {

            $uploadPath = ROOTPATH . 'public/uploads/covers';

            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $newName = $file->getRandomName();

            $file->move($uploadPath, $newName);

            $data['cover'] = $newName;
        }

        if (!$this->validateData($data, $this->rules())) {
            return $this->validationError(
                $this->validator->getErrors()
            );
        }

        $this->bukuModel->insert(
            $this->payload($data)
        );

        $buku = $this->bukuModel->find(
            $this->bukuModel->getInsertID()
        );

        return $this->success(
            'Buku berhasil ditambahkan.',
            $buku,
            201
        );
    }
public function update(int $id): ResponseInterface
{
    $buku = $this->bukuModel->find($id);

    if ($buku === null) {
        return $this->error('Buku tidak ditemukan.', 404);
    }

    // Karena update sekarang lewat POST multipart
    $data = $this->request->getPost();

    // Pertahankan cover lama
    $data['cover'] = $buku['cover'];

    $file = $this->request->getFile('cover_file');

    if ($file && $file->isValid() && ! $file->hasMoved()) {

        $uploadPath = ROOTPATH . 'public/uploads/covers';

        if (! is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        // hapus cover lama
        if (! empty($buku['cover'])) {

            $oldFile = $uploadPath . '/' . $buku['cover'];

            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        $newName = $file->getRandomName();

        $file->move($uploadPath, $newName);

        $data['cover'] = $newName;
    }

    if (! $this->validateData($data, $this->rules())) {
        return $this->validationError(
            $this->validator->getErrors()
        );
    }

    $this->bukuModel->update(
        $id,
        $this->payload($data)
    );

    return $this->success(
        'Buku berhasil diperbarui.',
        $this->bukuModel->find($id)
    );
}
    public function delete(int $id): ResponseInterface
    {
        $buku = $this->bukuModel->find($id);

        if ($buku === null) {
            return $this->error('Buku tidak ditemukan.', 404);
        }

        if (!empty($buku['cover'])) {

            $file = ROOTPATH .
                'public/uploads/covers/' .
                $buku['cover'];

            if (file_exists($file)) {
                unlink($file);
            }
        }

        $this->bukuModel->delete($id);

        return $this->success('Buku berhasil dihapus.');
    }

    private function rules(): array
    {
        return [
            'kategori_id' => 'required|integer|is_not_unique[kategori.id]',
            'judul' => 'required|max_length[255]',
            'penulis' => 'required|max_length[150]',
            'penerbit' => 'required|max_length[150]',
            'tahun_terbit' => 'required|integer|greater_than_equal_to[1901]|less_than_equal_to[2155]',
            'deskripsi' => 'permit_empty',
            'cover' => 'permit_empty',
        ];
    }

    private function payload(array $data): array
    {
        return [
            'kategori_id' => (int) $data['kategori_id'],
            'judul' => trim((string) $data['judul']),
            'penulis' => trim((string) $data['penulis']),
            'penerbit' => trim((string) $data['penerbit']),
            'tahun_terbit' => (int) $data['tahun_terbit'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'cover' => $data['cover'] ?? null,
        ];
    }
}
