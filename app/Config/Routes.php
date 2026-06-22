<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/login', 'Auth::login');
$routes->get('/dashboard', 'Dashboard::index');



$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    $routes->post('login', 'AuthController::login');

    // Guest bisa akses baca buku tanpa token
    $routes->group('', static function ($routes) {
        $routes->get('buku', 'BukuController::index');
        $routes->get('buku/(:num)', 'BukuController::show/$1');
    });

    // Admin wajib token untuk route lainnya
    $routes->group('', ['filter' => 'apiAuth'], static function ($routes) {
        $routes->get('dashboard', 'DashboardController::index');

        $routes->post('buku', 'BukuController::create');
        $routes->put('buku/(:num)', 'BukuController::update/$1');
        $routes->delete('buku/(:num)', 'BukuController::delete/$1');

        $routes->get('kategori', 'KategoriController::index');
        $routes->post('kategori', 'KategoriController::create');
        $routes->put('kategori/(:num)', 'KategoriController::update/$1');
        $routes->delete('kategori/(:num)', 'KategoriController::delete/$1');

        $routes->get('user', 'UserController::index');
        $routes->post('buku', 'BukuController::create');

$routes->put('buku/(:num)', 'BukuController::update/$1');
$routes->post('buku/update/(:num)', 'BukuController::update/$1');

$routes->delete('buku/(:num)', 'BukuController::delete/$1');
    });
});

