// Phase 2: Vue CDN compatible page (no import/export)

window.LoginPage = {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: '',
    };
  },
  methods: {
    async onSubmit() {
      this.error = '';

      const username = (this.username || '').trim();
      const password = this.password || '';

      if (!username || !password) {
        this.error = 'Username dan password wajib diisi.';
        return;
      }

      this.loading = true;
      try {
        // Endpoint:
        // POST /api/login
        // Body: { username: "", password: "" }
        const res = await window.api.post('/api/login', { username, password });

        // Response:
        // data.token
        // data.user
        const payload = res?.data?.data || {};
        const token = payload?.token;
        const user = payload?.user;

        if (!token) {
          throw new Error(res?.data?.message || 'Login gagal: token tidak ditemukan.');
        }

        // Ketentuan:
        // Simpan token ke localStorage key token
        window.localStorage.setItem('token', token);

        // Simpan user ke localStorage key user
        if (user !== undefined) {
          window.localStorage.setItem('user', JSON.stringify(user));
        }

        // Redirect ke /dashboard
        this.$router.push('/dashboard');
      } catch (e) {
        this.error = String(e && e.message ? e.message : e);
      } finally {
        this.loading = false;
      }
    },

    goHome() {
      this.$router.push('/');
    },
  },
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <div class="text-center">
          <button
            type="button"
            @click="goHome"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white transition dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Home
          </button>
        </div>

        <div class="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Login</h1>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Masuk untuk mengakses dashboard.
              </p>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black">🔒</div>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
              <input
                v-model="username"
                type="text"
                autocomplete="username"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                placeholder="password"
                required
              />
            </div>

            <div v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-4 py-3 text-sm transition"
            >
              <span v-if="!loading">Masuk</span>
              <span v-else>Loading...</span>
            </button>
          </form>

          <div class="mt-5 flex items-center justify-between gap-3">
            <div class="text-xs text-slate-500 dark:text-slate-400">
              Dengan login, token akan disimpan di localStorage.
            </div>
            <button
              type="button"
              @click="goHome"
              class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Kembali
            </button>
          </div>
        </div>

        <div class="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          UI modern Tailwind • Integrasi mengikuti endpoint backend.
        </div>
      </div>
    </div>
  `,
};

