<?php

namespace App\Controllers\Api;

use App\Models\BukuModel;
use App\Models\KategoriModel;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class DashboardController extends BaseApiController
{
    public function index(): ResponseInterface
    {
        return $this->success('Data dashboard berhasil diambil.', [
            'total_buku'     => (new BukuModel())->countAllResults(),
            'total_kategori' => (new KategoriModel())->countAllResults(),
            'total_users'    => (new UserModel())->countAllResults(),
        ]);
    }
}
