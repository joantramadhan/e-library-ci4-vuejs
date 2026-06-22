// Phase 4: Kategori CRUD (Vue CDN compatible) - Premium SaaS Redesign

window.KategoriPage = {
  name: 'KategoriPage',
  data() {
    return {
      loading: false,
      loadingSave: false,
      error: '',
      items: [], // kategori
      search: '',
      modalOpen: false,
      modalMode: 'create', // 'create' | 'edit'
      form: {
        nama_kategori: '',
        slug: '',
      },
      formError: '',
      isDark: false,
    };
  },
  computed: {
    filteredItems() {
      const q = (this.search || '').trim().toLowerCase();
      if (!q) return this.items;

      return this.items.filter((k) => {
        const nama = (k?.nama_kategori ?? '').toString().toLowerCase();
        const slug = (k?.slug ?? '').toString().toLowerCase();
        return nama.includes(q) || slug.includes(q);
      });
    },
  },
  created() {
    this.applyThemeFromStorage();
    this.loadKategori();
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
    goQuick(path) {
      this.$router.push(path);
    },
    doLogout() {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      this.$router.push('/login');
    },

    normalizeKategoriResponse(data) {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      if (data && Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },

    async loadKategori() {
      this.loading = true;
      this.error = '';
      try {
        const res = await window.api.get('/api/kategori');
        this.items = this.normalizeKategoriResponse(res?.data);
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat kategori.';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    openCreateModal() {
      this.modalMode = 'create';
      this.formError = '';
      this.form = {
        nama_kategori: '',
        slug: '',
      };
      this.modalOpen = true;
    },

    openEditModal(item) {
      this.modalMode = 'edit';
      this.formError = '';
      this.form = {
        nama_kategori: item?.nama_kategori ?? '',
        slug: item?.slug ?? '',
      };
      this.form._id = item?.id ?? item?._id ?? item?.kategori_id ?? null;
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.formError = '';
    },

    async submitForm() {
      this.formError = '';
      const nama_kategori = (this.form.nama_kategori || '').trim();
      const slug = (this.form.slug || '').trim();

      if (!nama_kategori) {
        this.formError = 'Nama Kategori wajib diisi.';
        return;
      }
      if (!slug) {
        this.formError = 'Slug wajib diisi.';
        return;
      }

      this.loadingSave = true;
      try {
        if (this.modalMode === 'create') {
          const payload = { nama_kategori, slug };
          await window.api.post('/api/kategori', payload);
        } else {
          const id = this.form._id;
          if (!id) throw new Error('ID kategori tidak ditemukan untuk update.');
          const payload = { nama_kategori, slug };
          await window.api.put(`/api/kategori/${id}`, payload);
        }

        await this.loadKategori();
        this.modalOpen = false;
      } catch (e) {
        this.formError =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menyimpan kategori.';
      } finally {
        this.loadingSave = false;
      }
    },

    async deleteItem(item) {
      if (!item) return;
      const id = item?.id ?? item?._id ?? item?.kategori_id;
      if (!id) {
        this.error = 'ID kategori tidak ditemukan untuk delete.';
        return;
      }

      const ok = window.confirm(`Apakah Anda yakin ingin menghapus kategori '${item?.nama_kategori ?? ''}'?`);
      if (!ok) return;

      this.loadingSave = true;
      this.error = '';
      try {
        await window.api.delete(`/api/kategori/${id}`);
        await this.loadKategori();
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menghapus kategori.';
      } finally {
        this.loadingSave = false;
      }
    },
  },
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-50 relative overflow-x-hidden selection:bg-emerald-500/30">
      
      <div class="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-transparent pointer-events-none blur-3xl"></div>

      <nav class="sticky top-0 z-40 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0A0A0A]/70 supports-[backdrop-filter]:bg-white/60">
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
              <button @click="goQuick('/dashboard')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Overview</button>
              <button @click="goQuick('/buku')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Data Buku</button>
              <button @click="$router.push('/kategori')" class="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm">Kategori</button>
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

      <main class="flex-1 w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        <div class="flex flex-col gap-4 md:flex-row md:items-end justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 backdrop-blur-sm mb-3">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              Sistem Klasifikasi
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Manajemen Kategori</h1>
            <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Atur struktur kategori untuk mempermudah pencarian pustaka digital.</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="openCreateModal"
              :disabled="loadingSave"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Tambah Kategori
            </button>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full sm:max-w-md group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </div>
            <input
              v-model="search"
              type="text"
              class="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-[#0A0A0A] dark:border-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              placeholder="Cari berdasarkan nama atau slug..."
            />
          </div>
          <div class="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Total: <span class="text-emerald-600 dark:text-emerald-400">{{ filteredItems.length }}</span> Kategori
          </div>
        </div>

        <div v-if="error" class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-800 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
           <span class="font-semibold text-sm">{{ error }}</span>
        </div>

        <div class="bg-white/80 dark:bg-[#111]/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative">
          
          <div v-if="loading" class="absolute inset-0 z-10 bg-white/50 dark:bg-[#111]/50 backdrop-blur-sm flex items-center justify-center">
            <svg class="h-8 w-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/><path d="M22 12c0-5.523-4.477-10-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
          </div>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-[#0A0A0A]/50 border-b border-slate-200 dark:border-slate-800">
                  <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 w-24">ID</th>
                  <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nama Kategori</th>
                  <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Slug</th>
                  <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr v-for="k in filteredItems" :key="k?.id ?? k?.slug" class="hover:bg-slate-50 dark:hover:bg-[#1A1F2E] transition-colors group">
                  <td class="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400">{{ k?.id ?? '-' }}</td>
                  <td class="py-4 px-6">
                    <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ k?.nama_kategori ?? '-' }}</div>
                  </td>
                  <td class="py-4 px-6">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {{ k?.slug ?? '-' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        @click="openEditModal(k)"
                        :disabled="loadingSave"
                        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400 transition-colors"
                        title="Edit Kategori"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                      </button>
                      <button
                        @click="deleteItem(k)"
                        :disabled="loadingSave"
                        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors"
                        title="Hapus Kategori"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredItems.length === 0">
                  <td colspan="4" class="py-16 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="h-12 w-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center mb-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg></div>
                      <div class="text-sm font-bold text-slate-900 dark:text-white">Tidak Ada Data</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Belum ada kategori yang sesuai dengan pencarian Anda.</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer class="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-[#0A0F1C]/50 backdrop-blur-lg mt-auto relative z-10">
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

      <div v-if="modalOpen" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] p-6 sm:p-8 shadow-2xl transform transition-all">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">
                {{ modalMode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori' }}
              </h3>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Pastikan nama dan slug unik untuk SEO.</p>
            </div>
            <button
              @click="closeModal"
              :disabled="loadingSave"
              class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div v-if="formError" class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75Zm9-1.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm0 5.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clip-rule="evenodd" /></svg>
            {{ formError }}
          </div>

          <form @submit.prevent="submitForm" class="space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Nama Kategori</label>
              <input
                v-model="form.nama_kategori"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:bg-[#111] transition-all"
                placeholder="Misal: Fiksi Ilmiah"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Slug URL</label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-mono outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:bg-[#111] transition-all"
                placeholder="misal: fiksi-ilmiah"
              />
              <p class="text-[10px] text-slate-500 mt-2 font-medium">Harus huruf kecil, tanpa spasi, gunakan strip (-) untuk pemisah.</p>
            </div>

            <div class="pt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60 mt-8">
              <button
                type="button"
                @click="closeModal"
                :disabled="loadingSave"
                class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="loadingSave"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 transition-all"
              >
                <svg v-if="loadingSave" class="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/><path d="M22 12c0-5.523-4.477-10-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
                <span v-else>{{ modalMode === 'create' ? 'Simpan Data' : 'Update Data' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  `,
};