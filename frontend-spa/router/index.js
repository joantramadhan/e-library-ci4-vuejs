const { createRouter, createWebHashHistory } = VueRouter;

// Placeholder fallback page
const Placeholder = {
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center">
        <div class="text-sm text-slate-500 dark:text-slate-400">Phase 1</div>
        <h1 class="mt-2 text-2xl font-semibold">{{ $route.path }}</h1>
        <p class="mt-3 text-slate-600 dark:text-slate-300">
          Placeholder page (akan diimplementasi di phase berikutnya).
        </p>
      </div>
    </div>
  `,
};

const routes = [
  { path: '/', name: 'home', component: window.HomePage || Placeholder },
  { path: '/login', name: 'login', component: window.LoginPage || Placeholder },

  // PUBLIC
  { path: '/katalog', name: 'katalog', component: window.KatalogPage },
  { path: '/buku/:id', name: 'detail-buku', component: window.DetailBukuPage },


  // ADMIN
  {
    path: '/dashboard',
    name: 'dashboard',
    component: window.DashboardPage || Placeholder,
    meta: { requiresAuth: true },
  },
  { path: '/buku', name: 'buku', component: window.BukuPage || Placeholder },
  { path: '/kategori', name: 'kategori', component: window.KategoriPage || Placeholder, meta: { requiresAuth: true } },
  { path: '/user', name: 'user', component: window.UserPage || Placeholder, meta: { requiresAuth: true } },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const requiresAuth = Boolean(to.meta && to.meta.requiresAuth);
  if (!requiresAuth) return true;

  if (!window.hasToken || !window.hasToken()) {
    return {
      path: '/login',
      replace: true,
    };
  }

  return true;
});

window.router = router;


