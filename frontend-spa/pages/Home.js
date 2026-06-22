// Phase 2: Vue CDN compatible page (no import/export) - SaaS Premium Redesign (Responsive Theme)

window.HomePage = {
  name: 'HomePage',
  data() {
    return {
      query: '',
      isDark: false,
      items: [], // Menggantikan data dummy 'featured'
      loading: false,
      error: '',
      placeholderCover: 'https://via.placeholder.com/300x450?text=No+Cover',
    };
  },
  computed: {
    filteredFeatured() {
      // Menampilkan maksimal 8 buku terbaru di Home Page
      let result = this.items;
      
      const q = (this.query || '').trim().toLowerCase();
      if (q) {
        result = result.filter((b) => {
          const judul = (b?.judul ?? '').toString().toLowerCase();
          const penulis = (b?.penulis ?? '').toString().toLowerCase();
          const kategori = (b?.kategori?.nama_kategori ?? b?.kategori_nama ?? b?.kategori ?? '').toString().toLowerCase();
          
          return judul.includes(q) || penulis.includes(q) || kategori.includes(q);
        });
      }

      // Ambil 8 item teratas untuk section Home
      return result.slice(0, 8);
    },
  },
  methods: {
    applyThemeFromStorage() {
      this.isDark = document.documentElement.classList.contains('dark');
    },
    toggleTheme() {
      window.toggleTheme?.();
      this.isDark = document.documentElement.classList.contains('dark');
    },
    goHome() {
      this.$router.push('/');
    },
    goCatalog() {
      this.$router.push('/katalog');
    },
    goLogin() {
      this.$router.push('/login');
    },
    
    // -- START: Integrasi Data Dinamis --
    normalizeArrayResponse(resData) {
      if (Array.isArray(resData)) return resData;
      if (resData && Array.isArray(resData.data)) return resData.data;
      if (resData && Array.isArray(resData?.data?.data)) return resData.data.data;
      return [];
    },
    getId(b) {
      return b?.id ?? b?._id ?? b?.buku_id;
    },
    getCoverUrl(filename) {
      if (!filename) return '';
      return `http://localhost/UAS/UAS/public/uploads/covers/${filename}`;
    },
    kategoriText(b) {
      if (b?.kategori?.nama_kategori) return b.kategori.nama_kategori;
      if (b?.kategori_nama) return b.kategori_nama;
      if (b?.kategori) return b.kategori;
      if (b?.kategori_id) return b.kategori_id;
      return 'Buku';
    },
    async loadBuku() {
      this.loading = true;
      this.error = '';
      try {
        const res = await window.api.get('/api/buku');
        this.items = this.normalizeArrayResponse(res?.data);
      } catch (e) {
        this.error = 'Gagal memuat buku terbaru.';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    goToDetail(b) {
      const id = this.getId(b);
      if (!id) return;
      this.$router.push(`/buku/${id}`);
    },
    // -- END: Integrasi Data Dinamis --
  },
  created() {
    this.applyThemeFromStorage();
    this.loadBuku(); // Panggil API saat komponen dimuat
  },
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A0A0A] selection:bg-indigo-500/30 font-sans text-slate-900 dark:text-slate-50 relative overflow-x-hidden">
      <div class="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-100/50 via-purple-50/20 to-transparent dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-transparent pointer-events-none blur-3xl"></div>

      <nav class="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0A0A0A]/70 supports-[backdrop-filter]:bg-white/60">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
          
          <button type="button" @click="goHome" class="group flex items-center gap-3 focus:outline-none rounded-xl">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.89-.777.89-2.038 0-2.815ZM12 15.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>
            </div>
            <div class="hidden sm:block text-left">
              <div class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Web Pustaka</div>
              <div class="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Digital Workspace</div>
            </div>
          </button>

          <div class="flex items-center gap-1 sm:gap-3">
            <div class="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <button @click="goHome" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300" :class="{ 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm': $route.path === '/', 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white': $route.path !== '/' }">Overview</button>
              <button @click="goCatalog" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300" :class="{ 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm': $route.path === '/katalog', 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white': $route.path !== '/katalog' }">Katalog</button>
            </div>

            <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-2"></div>

            <button @click="toggleTheme" class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.222 4.222a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM13.445 13.445a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.778 4.222a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.555 13.445a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0z"/><path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
            </button>
            <button @click="goLogin" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <section class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
        
        

        <!-- HERO BANNER (Responsive Theme) -->
        <div class="relative rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-r dark:from-[#171F38] dark:to-[#1D2545] border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 lg:p-16 shadow-xl dark:shadow-2xl transition-colors duration-300">
          
          <!-- Background Glow Effect -->
          <div class="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-indigo-100/50 dark:from-indigo-500/10 to-transparent pointer-events-none"></div>

          <!-- Left: Content -->
          <div class="relative z-10 max-w-xl">
            <div class="inline-block rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6 backdrop-blur-sm transition-colors duration-300">
              Selamat Datang di E-Library
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-[54px] font-bold text-slate-900 dark:text-white leading-[1.1] mb-5 tracking-tight transition-colors duration-300">
              Temukan Ilmu,<br/>
              <span class="text-indigo-600 dark:text-indigo-400">Ubah Dunia.</span>
            </h1>
            
            <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-md transition-colors duration-300">
              Akses ribuan koleksi buku digital berkualitas dari berbagai bidang untuk mendukung pembelajaran dan pengembangan diri.
            </p>
            
            <div class="flex flex-wrap items-center gap-4">
              <button @click="goCatalog" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 dark:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                Jelajahi Katalog
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
              <button class="inline-flex items-center gap-2 rounded-xl bg-transparent border border-slate-300 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                Kategori
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
              </button>
            </div>
          </div>

          <!-- Right: 3D Illustration Placeholder -->
          <div class="hidden md:block relative z-10 w-[420px] lg:w-[480px]">
  <img 
    src="./assets/images/hero-3d.png" 
    alt="3D Digital Library Concept" 
    class="w-full h-auto rounded-[2rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] animate-[pulse_5s_ease-in-out_infinite]"
  />
</div>
        </div>

        <!-- Bento Stats -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
          <div class="bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
            <div class="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white">{{ items.length || '0' }}</div>
            <div class="text-sm font-medium text-slate-500 mt-1">Total Buku</div>
          </div>
          <div class="bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
            <div class="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
            </div>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white">30+</div>
            <div class="text-sm font-medium text-slate-500 mt-1">Kategori</div>
          </div>
          <div class="hidden md:flex bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex-col items-center justify-center">
            <div class="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            </div>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white">1.2K</div>
            <div class="text-sm font-medium text-slate-500 mt-1">Total User</div>
          </div>
        </div>
      </section>

      <section class="py-16 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-[#0A0A0A]/30">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Cari Cepat</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Pencarian real-time yang memfilter judul, penulis, dan kategori tanpa reload halaman.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Multi-Device</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Akses pustaka digital dari laptop, tablet, hingga smartphone dengan layout responsif.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.813-6.843m-4.926 4.926-4.926-4.926C14.178 5.378 13.116 5 12 5c-1.116 0-2.178.378-3.067 1.05m-4.926 4.926A15.996 15.996 0 0 0 2.25 12c0 1.116.378 2.178 1.05 3.067" /></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Premium UI</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Pengalaman menggunakan aplikasi standar corporate yang bersih, fokus, dan nyaman di mata.</p>
            </div>
          </div>
        </div>
      </section>
<!-- Search Area -->
        <div class="relative max-w-2xl mx-auto group mb-8">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative flex items-center bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2">
            <div class="pl-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </div>
            <input
              v-model="query"
              type="text"
              class="w-full bg-transparent border-none px-4 py-3 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
              placeholder="Cari buku, penulis, atau topik..."
            />
            <button
              v-if="query"
              @click="query=''"
              class="mr-2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
            </button>
            <div class="hidden sm:flex items-center gap-1 pr-4">
               <kbd class="font-sans px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700">⌘</kbd>
               <kbd class="font-sans px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700">K</kbd>
            </div>
          </div>
        </div>
      <section class="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Buku Terbaru</h2>
            <p class="mt-2 text-slate-600 dark:text-slate-400 font-medium">Eksplorasi koleksi literatur berkualitas yang baru saja ditambahkan.</p>
          </div>
          <div class="inline-flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
            Tampil <span class="text-indigo-600 dark:text-indigo-400 mx-1">{{ filteredFeatured.length }}</span> item
          </div>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] p-4 flex flex-col shadow-sm">
            <div class="w-full aspect-[4/3] sm:aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-4"></div>
            <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-2"></div>
            <div class="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
            <div class="mt-auto h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="filteredFeatured.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <article
            v-for="b in filteredFeatured"
            :key="getId(b) ?? b.judul"
            @click="goToDetail(b)"
            class="group flex flex-col bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
          >
            <div class="relative w-full aspect-[4/5] bg-slate-100 dark:bg-[#0A0F1C] overflow-hidden border-b border-slate-100 dark:border-slate-800">
              
              <div class="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
              
              <img
                v-if="b.cover && String(b.cover).trim()"
                :src="getCoverUrl(b.cover)"
                alt="cover"
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out z-0 relative"
                loading="lazy"
              />
              <img
                v-else
                :src="placeholderCover"
                alt="placeholder cover"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out z-0 relative grayscale opacity-70"
                loading="lazy"
              />

              <div class="absolute top-3 right-3 z-20">
                 <span class="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
                  {{ kategoriText(b) }}
                </span>
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ b.judul || '-' }}</h3>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-1">{{ b.penulis || 'Penulis Tidak Diketahui' }}</p>

              <button
                class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white dark:hover:border-indigo-500 transition-all duration-300"
              >
                Lihat Detail
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" /></svg>
              </button>
            </div>
          </article>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
          <p class="text-slate-500 dark:text-slate-400">Belum ada buku tersedia.</p>
        </div>
      </section>

      <section class="border-t border-slate-200/50 dark:border-slate-800/50 py-16 bg-white dark:bg-[#0A0A0A]">
        <div class="mx-auto max-w-4xl px-4 text-center">
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Katalog Penuh Menanti Anda</h2>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-8">Dapatkan akses ke ratusan judul buku, jurnal, dan referensi berstandar industri.</p>
          <button @click="goCatalog" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
             Mulai Jelajahi
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </section>

    </div>
  `,
};