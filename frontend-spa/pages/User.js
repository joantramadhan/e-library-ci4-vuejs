// Phase 5A: User CRUD (Vue CDN compatible, no import/export)

window.UserPage = {
  name: 'UserPage',
  data() {
    return {
      loading: false,
      loadingSave: false,
      error: '',

      items: [],
      search: '',

      modalOpen: false,
      modalMode: 'create', // 'create' | 'edit'
      formError: '',
      form: {
        nama: '',
        username: '',
        password: '',
      },
    };
  },
  computed: {
    filteredItems() {
      const q = (this.search || '').trim().toLowerCase();
      if (!q) return this.items;

      return this.items.filter((u) => {
        const nama = (u?.nama ?? u?.full_name ?? u?.nama_user ?? '').toString().toLowerCase();
        const username = (u?.username ?? u?.user_name ?? '').toString().toLowerCase();
        return nama.includes(q) || username.includes(q);
      });
    },
  },
  created() {
    this.loadUser();
  },
  methods: {
    normalizeArrayResponse(resData) {
      // Audit rule:
      // If backend format: { status: true, data: [...] } -> response.data.data
      // If array direct: [...] -> response.data
      if (Array.isArray(resData)) return resData;
      if (resData && Array.isArray(resData.data)) return resData.data;
      if (resData && Array.isArray(resData?.data?.data)) return resData.data.data;
      return [];
    },

    resolveUserId(item) {
      return item?.id ?? item?._id ?? item?.user_id ?? null;
    },

    openCreateModal() {
      this.modalMode = 'create';
      this.formError = '';
      this.form = {
        nama: '',
        username: '',
        password: '',
      };
      this.modalOpen = true;
    },

    openEditModal(item) {
      this.modalMode = 'edit';
      this.formError = '';
      this.form = {
        nama: item?.nama ?? item?.full_name ?? item?.nama_user ?? '',
        username: item?.username ?? item?.user_name ?? '',
        password: '', // password opsional saat update
      };
      this.form._id = this.resolveUserId(item);
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.formError = '';
    },

    async loadUser() {
      this.loading = true;
      this.error = '';
      try {
        const res = await window.api.get('/api/user');
        this.items = this.normalizeArrayResponse(res?.data);
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat user.';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.formError = '';

      const nama = (this.form.nama || '').trim();
      const username = (this.form.username || '').trim();
      const password = (this.form.password || '').toString();

      if (!nama) {
        this.formError = 'nama wajib diisi.';
        return;
      }
      if (!username) {
        this.formError = 'username wajib diisi.';
        return;
      }

      this.loadingSave = true;
      try {
        if (this.modalMode === 'create') {
          // Password wajib saat create
          if (!password.trim()) {
            this.formError = 'password wajib diisi saat membuat user.';
            return;
          }

          const payload = {
            nama,
            username,
            password: password.trim(),
          };
          await window.api.post('/api/user', payload);
        } else {
          // Password opsional saat update
          const id = this.form._id;
          if (!id) throw new Error('ID user tidak ditemukan untuk update.');

          const payload = { nama, username };

          // Jika password kosong saat update, jangan kirim field password ke API
          if (password.trim()) {
            payload.password = password.trim();
          }

          await window.api.put(`/api/user/${id}`, payload);
        }

        await this.loadUser();
        this.modalOpen = false;
      } catch (e) {
        this.formError =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menyimpan user.';
      } finally {
        this.loadingSave = false;
      }
    },

    async deleteItem(item) {
      if (!item) return;

      const id = this.resolveUserId(item);
      if (!id) {
        this.error = 'ID user tidak ditemukan untuk delete.';
        return;
      }

      const ok = window.confirm(`Hapus user '${item?.username ?? item?.user_name ?? ''}'?`);
      if (!ok) return;

      this.loadingSave = true;
      this.error = '';
      try {
        await window.api.delete(`/api/user/${id}`);
        await this.loadUser();
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menghapus user.';
      } finally {
        this.loadingSave = false;
      }
    },
  },
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div class="mx-auto max-w-6xl px-4 py-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900/40">
              <span class="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
              CRUD User
            </div>
            <h1 class="mt-3 text-2xl font-bold tracking-tight">User</h1>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Kelola user (create/update/delete).</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="openCreateModal"
              class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              :disabled="loadingSave"
            >
              + Tambah
            </button>
            <button
              @click="$router.push('/dashboard')"
              class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
            >
              Kembali
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/40">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300">Search</label>
              <div class="mt-2 flex gap-3">
                <input
                  v-model="search"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  placeholder="Cari nama atau username..."
                />
                <button
                  class="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                  :disabled="!search"
                  @click="search=''"
                >
                  Reset
                </button>
              </div>
            </div>

            <div class="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan <span class="font-semibold">{{ filteredItems.length }}</span> hasil
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
          {{ error }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">Memuat user...</div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div class="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>

        <!-- Table -->
        <div v-else class="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/40">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">Daftar User</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">CRUD lengkap dengan refresh otomatis.</div>
            </div>
          </div>

          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead>
                <tr class="text-xs uppercase tracking-wide text-slate-500">
                  <th class="py-2 pr-3">ID</th>
                  <th class="py-2 pr-3">Nama</th>
                  <th class="py-2 pr-3">Username</th>
                  <th class="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="u in filteredItems"
                  :key="u?.id ?? u?._id ?? u?.username ?? u?.user_name"
                  class="border-t border-slate-200 dark:border-slate-800"
                >
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ resolveUserId(u) ?? '-' }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ u?.nama ?? u?.full_name ?? u?.nama_user ?? '-' }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ u?.username ?? u?.user_name ?? '-' }}</td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <button
                        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                        :disabled="loadingSave"
                        @click="openEditModal(u)"
                      >
                        Edit
                      </button>
                      <button
                        class="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        :disabled="loadingSave"
                        @click="deleteItem(u)"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="filteredItems.length === 0">
                  <td colspan="4" class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Data tidak ditemukan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal -->
        <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

          <div class="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/80">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {{ modalMode === 'create' ? 'Tambah User' : 'Edit User' }}
                </div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Password wajib saat create, opsional saat update.
                </div>
              </div>
              <button
                class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                @click="closeModal"
                :disabled="loadingSave"
              >
                Tutup
              </button>
            </div>

            <div v-if="formError" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              {{ formError }}
            </div>

            <form class="mt-4 space-y-4" @submit.prevent="submitForm">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Nama</label>
                <input
                  v-model="form.nama"
                  type="text"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  placeholder="Nama user"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  placeholder="username"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Password
                  <span v-if="modalMode === 'edit'" class="ml-2 text-[11px] text-slate-500 dark:text-slate-400">(optional)</span>
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  :placeholder="modalMode === 'create' ? 'password' : 'Biarkan kosong untuk tidak ubah password'"
                />
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                  :disabled="loadingSave"
                  @click="closeModal"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  :disabled="loadingSave"
                >
                  <span v-if="!loadingSave">Simpan</span>
                  <span v-else>Memproses...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
};

