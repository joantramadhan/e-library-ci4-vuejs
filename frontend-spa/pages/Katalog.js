// Phase 5: Katalog Publik (Vue CDN compatible) - SaaS Premium Redesign (Full Bleed Cover)

window.KatalogPage = {
  name: 'KatalogPage',
  data() {
    return {
      loading: false,
      error: '',
      items: [],
      search: '',
      placeholderCover: 'https://via.placeholder.com/300x450?text=No+Cover',
      isDark: false,
    };
  },
  computed: {
    filteredItems() {
      const q = (this.search || '').trim().toLowerCase();
      if (!q) return this.items;

      return this.items.filter((b) => {
        const judul = (b?.judul ?? '').toString().toLowerCase();
        const penulis = (b?.penulis ?? '').toString().toLowerCase();
        const penerbit = (b?.penerbit ?? '').toString().toLowerCase();
        const deskripsi = (b?.deskripsi ?? '').toString().toLowerCase();
        const kategori = (b?.kategori?.nama_kategori ?? b?.kategori_nama ?? b?.kategori ?? '').toString().toLowerCase();

        return (
          judul.includes(q) ||
          penulis.includes(q) ||
          penerbit.includes(q) ||
          deskripsi.includes(q) ||
          kategori.includes(q)
        );
      });
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
      return '-';
    },
    async loadBuku() {
      this.loading = true;
      this.error = '';
      try {
        const res = await window.api.get('/api/buku');
        console.log('Katalog response.data:', res?.data);
        this.items = this.normalizeArrayResponse(res?.data);
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat katalog.';
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
  },
  created() {
    this.applyThemeFromStorage();
    this.loadBuku();
  },

  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-50">
      
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
              <button @click="$router.push('/katalog')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm">Katalog</button>
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

      <main class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Katalog Buku</h1>
            <p class="text-slate-600 dark:text-slate-400 font-medium">Temukan koleksi bacaan dari berbagai kategori, kelola referensi, dan tingkatkan wawasan Anda.</p>
          </div>

          <div class="w-full md:w-96 flex-shrink-0">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </div>
              <input
                v-model="search"
                type="text"
                class="block w-full rounded-xl border border-slate-200 bg-white dark:bg-[#111] dark:border-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 outline-none"
                placeholder="Cari judul, penulis, penerbit..."
              />
              <div v-if="search" class="absolute inset-y-0 right-0 flex items-center pr-3">
                 <button @click="search=''" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
                 </button>
              </div>
            </div>
            <div class="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 text-right">
              Menampilkan <span class="text-indigo-600 dark:text-indigo-400">{{ filteredItems.length }}</span> hasil
            </div>
          </div>
        </div>

        <div v-if="error" class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-800 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
          <span class="font-medium text-sm">{{ error }}</span>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="i in 10" :key="i" class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] p-4 flex flex-col shadow-sm">
            <div class="w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-4"></div>
            <div class="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-3"></div>
            <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-2"></div>
            <div class="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
            <div class="mt-auto h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          </div>
        </div>

        <div v-else>
          <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-[#111]/50">
            <div class="h-16 w-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Tidak ada buku ditemukan</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Coba gunakan kata kunci pencarian yang berbeda atau periksa kembali ejaan Anda.</p>
            <button @click="search=''" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
               Clear Search
            </button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <article
              v-for="b in filteredItems"
              :key="getId(b) ?? b?.judul"
              class="group flex flex-col bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
              @click="goToDetail(b)"
            >
              <div class="relative w-full aspect-[4/5] bg-slate-100 dark:bg-[#0A0F1C] overflow-hidden border-b border-slate-100 dark:border-slate-800">
                <div class="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                
                <img
                  v-if="b?.cover && String(b.cover).trim()"
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

              <div class="p-4 flex flex-col flex-1">
                <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ b?.judul ?? '-' }}
                </h3>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                  {{ b?.penulis ?? 'Penulis Tidak Diketahui' }}
                </p>
                
                <p class="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-4 flex-1">
                  {{ b?.penerbit ? 'Penerbit: ' + b.penerbit : '' }}
                </p>

                <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <span class="flex items-center justify-between w-full text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    <span>Lihat Detail</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
        
      </main>
    </div>
  `,
};