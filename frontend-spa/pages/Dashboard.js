// Phase 3: Modern SaaS Dashboard (Vue CDN compatible, no import/export) - Premium Redesign

window.DashboardPage = {
  name: 'DashboardPage',
  data() {
    return {
      loading: false,
      error: '',
      stats: null, // { total_buku, total_kategori, total_users }
      user: null,
      isDark: false,
    };
  },
  created() {
    // Sync theme
    this.applyThemeFromStorage();

    // Keep displaying user info from localStorage.
    try {
      const raw = window.localStorage.getItem('user');
      this.user = raw ? JSON.parse(raw) : null;
    } catch (e) {
      this.user = null;
    }

    this.loadDashboard();
  },
  methods: {
    applyThemeFromStorage() {
      this.isDark = document.documentElement.classList.contains('dark');
    },
    toggleTheme() {
      window.toggleTheme?.();
      this.isDark = document.documentElement.classList.contains('dark');
    },
    async loadDashboard() {
      this.loading = true;
      this.error = '';
      this.stats = null;

      try {
        const res = await window.api.get('/api/dashboard');

        // Be defensive about response shape.
        const payload = res?.data?.data;

const total_buku = payload?.total_buku ?? 0;
const total_kategori = payload?.total_kategori ?? 0;
const total_users = payload?.total_users ?? 0;

this.stats = {
  total_buku,
  total_kategori,
  total_users,
};
        // If all are missing, treat as empty.
        if (
          typeof total_buku === 'undefined' &&
          typeof total_kategori === 'undefined' &&
          typeof total_users === 'undefined'
        ) {
          this.stats = null;
          return;
        }

        this.stats = {
          total_buku: total_buku ?? 0,
          total_kategori: total_kategori ?? 0,
          total_users: total_users ?? 0,
        };
      } catch (e) {
        // Do not hardcode backend details; show safe message.
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat dashboard.';
        this.error = msg;
      } finally {
        this.loading = false;
      }
    },

    doLogout() {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      this.$router.push('/login');
    },

    formatNumber(value) {
      const n = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(n)) return '-';
      return new Intl.NumberFormat('id-ID').format(n);
    },

    goQuick(path) {
      this.$router.push(path);
    },
    goHome() {
      this.$router.push('/');
    }
  },
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-50 relative overflow-x-hidden selection:bg-indigo-500/30">
      
      <!-- Top Ambient Glow -->
      <div class="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-100/50 via-purple-50/20 to-transparent dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-transparent pointer-events-none blur-3xl"></div>

      <!-- Navigation (Admin Context) -->
      <nav class="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0A0A0A]/70 supports-[backdrop-filter]:bg-white/60">
        <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
          
          <button type="button" @click="goHome" class="group flex items-center gap-3 focus:outline-none rounded-xl">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.89-.777.89-2.038 0-2.815ZM12 15.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>
            </div>
            <div class="hidden sm:block text-left">
              <div class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Admin Panel</div>
              <div class="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Workspace</div>
            </div>
          </button>

          <div class="flex items-center gap-1 sm:gap-3">
            <div class="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <button @click="$router.push('/dashboard')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm">Overview</button>
              <button @click="goQuick('/buku')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Data Buku</button>
              <button @click="goQuick('/kategori')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Kategori</button>
            </div>

            <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-2"></div>

            <button @click="toggleTheme" class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Dark Mode">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.222 4.222a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM13.445 13.445a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.778 4.222a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.555 13.445a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0z"/><path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
            </button>
            <button @click="doLogout" class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-500/20 transition-all duration-300 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Workspace -->
      <main class="flex-1 w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        <!-- Header Section -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-sm mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Sistem Terhubung (Live)
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Selamat Datang, <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{{ user?.name || user?.username || 'Administrator' }}</span>
            </h1>
            <p class="text-slate-600 dark:text-slate-400 font-medium">Ini adalah pusat kendali untuk mengelola seluruh data pustaka digital Anda secara real-time.</p>
          </div>

          <div class="flex-shrink-0 flex items-center gap-3">
            <button
              @click="loadDashboard"
              :disabled="loading"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all disabled:opacity-50"
            >
              <svg v-if="loading" class="h-4 w-4 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/><path d="M22 12c0-5.523-4.477-10-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              {{ loading ? 'Memuat Data...' : 'Refresh Data' }}
            </button>
          </div>
        </div>

        <!-- Dashboard Stats (Bento Style) -->
        <div class="mb-10">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Statistik Utama</h2>
          
          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div v-for="i in 3" :key="i" class="bg-white/60 dark:bg-[#111]/60 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-start animate-pulse">
                <div class="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                <div class="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
                <div class="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
             </div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
            <div>
              <h3 class="font-bold text-lg mb-1">Gagal Memuat Statistik</h3>
              <p class="text-sm font-medium opacity-90">{{ error }}</p>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!stats" class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-900/30 p-10 flex flex-col items-center justify-center text-center">
             <div class="h-16 w-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg></div>
             <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Data Belum Tersedia</h3>
             <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Sistem belum mencatat adanya entri data. Silakan mulai tambahkan data baru melalui menu kelola.</p>
          </div>

          <!-- Real Data -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
              <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <div class="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">{{ formatNumber(stats.total_buku) }}</div>
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 relative z-10">Total Buku Terdaftar</div>
            </div>

            <div class="bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
              <div class="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
              </div>
              <div class="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">{{ formatNumber(stats.total_kategori) }}</div>
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 relative z-10">Struktur Kategori</div>
            </div>

            <div class="bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors"></div>
              <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              </div>
              <div class="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">{{ formatNumber(stats.total_users) }}</div>
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 relative z-10">Pengguna Sistem</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Quick Actions Grid -->
          <div class="lg:col-span-2">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Manajemen Data (Quick Actions)</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button @click="goQuick('/buku')" class="group text-left bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Kelola Buku</h3>
                  <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Tambah, edit, dan hapus entri pustaka.</p>
                </div>
              </button>

              <button @click="goQuick('/kategori')" class="group text-left bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Kelola Kategori</h3>
                  <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Klasifikasi dan struktur rak buku.</p>
                </div>
              </button>

              <button @click="goQuick('/user')" class="group text-left bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Kelola Pengguna</h3>
                  <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Atur akses dan akun anggota.</p>
                </div>
              </button>

            </div>
          </div>

          <!-- Active Session Info -->
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Sesi Aktif</h2>
            <div class="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                  {{ user?.name ? user.name.charAt(0).toUpperCase() : 'A' }}
                </div>
                <div>
                  <div class="font-bold text-sm text-slate-900 dark:text-white">{{ user?.name || user?.username || 'Administrator' }}</div>
                  <div class="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
                     <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Online
                  </div>
                </div>
              </div>

              <div v-if="user" class="bg-slate-50 dark:bg-[#0A0A0A] rounded-xl p-3 border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Payload Data</div>
                <pre class="text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">{{ JSON.stringify(user, null, 2) }}</pre>
              </div>
              <div v-else class="text-xs font-medium text-slate-500 dark:text-slate-400 text-center py-4">
                Memverifikasi sesi via Token...
              </div>
            </div>
          </div>

        </div>

      </main>

      <!-- Premium Sticky Footer -->
      <footer class="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-[#0A0F1C]/50 backdrop-blur-lg mt-auto">
        <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <div class="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.89-.777.89-2.038 0-2.815ZM12 15.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>
              </div>
              <span class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">E-Library Workspace</span>
            </div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
              © 2026 Web Pustaka Digital. Sistem Manajemen Administrator.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
};