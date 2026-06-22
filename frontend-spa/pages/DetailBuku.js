// Phase 5: Detail Buku Publik (Vue CDN compatible) - Premium SaaS Redesign + Tombol Baca

window.DetailBukuPage = {
  name: 'DetailBukuPage',
  data() {
    return {
      loading: false,
      error: '',
      item: null,
      isDark: false,
      placeholderCover: 'https://via.placeholder.com/400x600?text=No+Cover',
    };
  },
  computed: {
    kategoriText() {
      const b = this.item;
      if (!b) return '-';
      if (b?.kategori?.nama_kategori) return b.kategori.nama_kategori;
      if (b?.kategori_nama) return b.kategori_nama;
      if (b?.kategori) return b.kategori;
      if (b?.kategori_id) return b.kategori_id;
      return '-';
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
    goLogin() {
      this.$router.push('/login');
    },
    goHome() {
      this.$router.push('/');
    },
    goCatalog() {
      this.$router.push('/katalog');
    },
    
    // Metode baru untuk memicu aksi Baca Buku
    bacaBuku() {
      const id = this.getIdFromRoute();
      if (!id) return;
      
      // Catatan: Ubah path '/baca/' sesuai dengan struktur Vue Router Anda 
      // yang mengarah ke halaman PDF Viewer atau Reader buku digital.
      this.$router.push(`/baca/${id}`);
      
      // Jika file bukunya berupa URL langsung, Anda bisa menggunakan:
      // window.open(this.item.file_buku_url, '_blank');
    },

    normalizeItemResponse(resData) {
      if (!resData) return null;
      if (resData?.data && typeof resData.data === 'object' && !Array.isArray(resData.data)) {
        return resData.data;
      }
      if (resData?.data?.data && typeof resData.data.data === 'object') {
        return resData.data.data;
      }
      if (typeof resData === 'object' && !Array.isArray(resData)) {
        return resData;
      }
      return null;
    },

    getIdFromRoute() {
      return this.$route?.params?.id;
    },

    getCoverUrl(filename) {
      if (!filename) return '';
      return `http://localhost/UAS/UAS/public/uploads/covers/${filename}`;
    },

    async loadDetail() {
      const id = this.getIdFromRoute();
      if (!id) {
        this.error = 'ID buku tidak ditemukan di route.';
        return;
      }

      this.loading = true;
      this.error = '';
      this.item = null;

      try {
        const res = await window.api.get(`/api/buku/${id}`);
        const payload = res?.data;
        const normalized = payload?.data?.data ?? payload?.data ?? payload;

        this.item = normalized && typeof normalized === 'object' ? normalized : this.normalizeItemResponse(payload);

        if (!this.item && res?.data?.data?.data) this.item = res.data.data.data;
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat detail buku.';
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.applyThemeFromStorage();
    this.loadDetail();
  },
  watch: {
    '$route.params.id': function () {
      this.loadDetail();
    },
  },
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-50 relative overflow-x-hidden selection:bg-indigo-500/30">
      
      <div class="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-indigo-100/50 via-purple-50/20 to-transparent dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-transparent pointer-events-none blur-3xl"></div>

      <nav class="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0A0A0A]/70 supports-[backdrop-filter]:bg-white/60">
        <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
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
              <button @click="goHome" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Overview</button>
              <button @click="goCatalog" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm">Katalog</button>
            </div>
            <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-2"></div>
            <button @click="toggleTheme" class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Dark Mode">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.222 4.222a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM13.445 13.445a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.778 4.222a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.555 13.445a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0z"/><path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
            </button>
            <button @click="goLogin" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main class="flex-1 w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-sm mb-3">
              <span class="inline-block h-2 w-2 rounded-full bg-indigo-600"></span> Detail Buku
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight line-clamp-2">{{ item?.judul || (loading ? 'Memuat Data...' : 'Buku Tidak Ditemukan') }}</h1>
            <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Informasi lengkap buku yang dipilih.</p>
          </div>
          
          <button @click="goCatalog" class="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
            Kembali ke Katalog
          </button>
        </div>

        <div v-if="error" class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
           <div class="mt-0.5 font-semibold text-sm">{{ error }}</div>
        </div>

        <div v-if="loading && !item" class="rounded-3xl bg-white/60 dark:bg-[#111]/60 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm animate-pulse">
           <div class="flex flex-col md:flex-row gap-8">
              <div class="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 shrink-0">
                <div class="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                <div class="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
              <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4">
                 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                 </div>
                 <div class="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-2 w-full"></div>
              </div>
           </div>
        </div>

        <div v-else-if="item" class="rounded-3xl bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 shadow-lg overflow-hidden p-6 md:p-8">
          <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            <div class="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col gap-4">
              <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-[#0A0F1C]">
                <img
                  v-if="item.cover && String(item.cover).trim()"
                  :src="getCoverUrl(item.cover)"
                  alt="Cover Buku"
                  class="w-full h-full object-cover object-top"
                />
                <img
                  v-else
                  :src="placeholderCover"
                  alt="Placeholder"
                  class="w-full h-full object-cover grayscale opacity-50 object-center"
                />
              </div>

              <button 
                @click="bacaBuku" 
                class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                Mulai Baca Buku
              </button>
            </div>

            <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div class="bg-slate-50 dark:bg-[#1A1F2E] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Penulis</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ item.penulis || 'Tidak Diketahui' }}</span>
                </div>
                
                <div class="bg-slate-50 dark:bg-[#1A1F2E] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Penerbit</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ item.penerbit || 'Tidak Diketahui' }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div class="bg-slate-50 dark:bg-[#1A1F2E] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                   <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                   </div>
                   <div>
                     <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Tahun Terbit</div>
                     <div class="text-base font-bold text-slate-900 dark:text-white">{{ item.tahun_terbit || '-' }}</div>
                   </div>
                </div>

                <div class="bg-slate-50 dark:bg-[#1A1F2E] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                   <div class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
                   </div>
                   <div>
                     <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Kategori</div>
                     <div class="text-base font-bold text-slate-900 dark:text-white">{{ kategoriText }}</div>
                   </div>
                </div>
              </div>

              <div class="bg-slate-50 dark:bg-[#1A1F2E] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 flex-1 shadow-sm">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-indigo-500"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
                   Deskripsi Buku
                </h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {{ item.deskripsi || 'Tidak ada deskripsi yang tersedia untuk buku ini.' }}
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

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