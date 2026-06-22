// Phase 4: Buku CRUD (Vue CDN compatible)

window.BukuPage = {
  name: 'BukuPage',
  data() {
    return {
      loading: false,
      loadingSave: false,
      error: '',

      items: [], // buku

      search: '',

      // dropdown kategori
      kategoriLoading: false,
      kategoriError: '',
      kategoriItems: [],

      modalOpen: false,
      modalMode: 'create', // 'create' | 'edit'
      formError: '',
      form: {
        kategori_id: '',
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        deskripsi: '',
        // cover text replaced by file upload.
        cover: '', // nama file lama (saat edit)
        coverFile: null, // File object (saat user upload)
      },

      coverPreviewUrl: '',
      coverClientError: ''
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
        return (
          judul.includes(q) || penulis.includes(q) || penerbit.includes(q) || deskripsi.includes(q)
        );
      });
    },

    kategoriById() {
      const map = {};
      for (const k of this.kategoriItems) {
        const id = k?.id ?? k?._id;
        if (id !== undefined && id !== null) map[id] = k;
      }
      return map;
    },
  },
  methods: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },

    kategoriLabel(kategori_id) {
      if (!kategori_id) return '-';

      const k = this.kategoriById[kategori_id];
      return k?.nama_kategori ?? '-';
    },

    normalizeArrayResponse(resData) {
      // Audit rule:
      // If backend format: { status: true, data: [...] } -> response.data.data
      // If array direct: [...] -> response.data
      if (Array.isArray(resData)) return resData;
      if (resData && Array.isArray(resData.data)) return resData.data;
      if (resData && Array.isArray(resData?.data?.data)) return resData.data.data;
      return [];
    },

    async loadKategoriDropdown() {
      this.kategoriLoading = true;
      this.kategoriError = '';
      try {
        const res = await window.api.get('/api/kategori');
        this.kategoriItems = this.normalizeArrayResponse(res?.data);
      } catch (e) {
        this.kategoriError =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat kategori untuk dropdown.';
        this.kategoriItems = [];
      } finally {
        this.kategoriLoading = false;
      }
    },

    async loadBuku() {
      this.loading = true;
      this.error = '';
      try {
        const res = await window.api.get('/api/buku');
        this.items = this.normalizeArrayResponse(res?.data);
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal memuat buku.';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

  openCreateModal() {
      this.modalMode = 'create';
      this.formError = '';
      this.form = {
        kategori_id: '',
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        deskripsi: '',
        cover: '',
      };
      this.form.coverFile = null;
      this.coverPreviewUrl = '';
      this.coverClientError = '';
      this.modalOpen = true;
    },

    openEditModal(item) {
      this.modalMode = 'edit';
      this.formError = '';
      this.form = {
        kategori_id: item?.kategori_id ?? '',
        judul: item?.judul ?? '',
        penulis: item?.penulis ?? '',
        penerbit: item?.penerbit ?? '',
        tahun_terbit: item?.tahun_terbit ?? '',
        deskripsi: item?.deskripsi ?? '',
        cover: item?.cover ?? '',
      };
      this.form._id = item?.id ?? item?._id ?? item?.buku_id ?? null;
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.formError = '';
    },

    getCoverUrl(filename) {
      if (!filename) return '';
      return `http://localhost/UAS/UAS/public/uploads/covers/${filename}`;
    },

    fileAcceptsError(file) {
      if (!file) return '';
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowed.includes(file.type)) {
        return 'Format cover harus jpg, jpeg, png, atau webp.';
      }
      const max = 2 * 1024 * 1024;
      if (file.size > max) {
        return 'Ukuran cover maksimal 2MB.';
      }
      return '';
    },

    onPickCoverFile(e) {
      const file = e?.target?.files?.[0] ?? null;
      // clear old filename preview only if user picks a new file

      if (!file) {
        this.form.coverFile = null;
        this.coverPreviewUrl = '';
        this.coverClientError = '';
        return;
      }

      const msg = this.fileAcceptsError(file);
      if (msg) {
        this.form.coverFile = null;
        this.coverPreviewUrl = '';
        this.coverClientError = msg;
        return;
      }

      this.form.coverFile = file;
      this.coverClientError = '';

      if (this.coverPreviewUrl) {
        try {
          URL.revokeObjectURL(this.coverPreviewUrl);
        } catch (_) {}
      }

      this.coverPreviewUrl = URL.createObjectURL(file);
    },

    buildBukuFormData({ kategori_id, judul, penulis, penerbit, tahun_terbit, deskripsi }) {
      const fd = new FormData();
      fd.append('kategori_id', kategori_id);
      fd.append('judul', judul);
      fd.append('penulis', penulis);
      fd.append('penerbit', penerbit);
      fd.append('tahun_terbit', tahun_terbit);
      fd.append('deskripsi', deskripsi);

      // keep old cover name if no new file picked
      if (!this.form.coverFile && this.form.cover) {
        fd.append('cover', this.form.cover);
      }

      if (this.form.coverFile) {
        fd.append('cover_file', this.form.coverFile);
      }

      return fd;
    },

    async submitForm() {
      this.formError = '';


      const kategori_id = this.form.kategori_id;
      const judul = (this.form.judul || '').trim();
      const penulis = (this.form.penulis || '').trim();
      const penerbit = (this.form.penerbit || '').trim();
      const tahun_terbit = this.form.tahun_terbit;
      const deskripsi = (this.form.deskripsi || '').trim();
      const cover = (this.form.cover || '').trim();
      // coverFile is optional (may be null)


      // basic validation
      if (!kategori_id) {
        this.formError = 'kategori_id wajib diisi (pilih dari dropdown).';
        return;
      }
      if (!judul) return (this.formError = 'judul wajib diisi.');
      if (!penulis) return (this.formError = 'penulis wajib diisi.');
      if (!penerbit) return (this.formError = 'penerbit wajib diisi.');

      this.loadingSave = true;
      try {
        if (this.modalMode === 'create') {
          const formData = this.buildBukuFormData({

            kategori_id,
            judul,
            penulis,
            penerbit,
            tahun_terbit,
            deskripsi,
          });
          formData.append('_method', 'PUT');

await window.api.post(`/api/buku/${id}`, formData);
        } else {

          const id = this.form._id;
          if (!id) throw new Error('ID buku tidak ditemukan untuk update.');

          const formData = this.buildBukuFormData({
            kategori_id,
            judul,
            penulis,
            penerbit,
            tahun_terbit,
            deskripsi,
          });

          // Use PUT with FormData.
          // Do NOT set Content-Type header manually; axios will set correct multipart boundary.
          await window.api.post(`/api/buku/update/${id}`, formData);


        }


        await this.loadBuku();
        this.modalOpen = false;
      } catch (e) {
        this.formError =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menyimpan buku.';
      } finally {
        this.loadingSave = false;
      }
    },

    async deleteItem(item) {
      if (!item) return;
      const id = item?.id ?? item?._id ?? item?.buku_id;
      if (!id) {
        this.error = 'ID buku tidak ditemukan untuk delete.';
        return;
      }

      const ok = window.confirm(`Hapus buku '${item?.judul ?? ''}'?`);
      if (!ok) return;

      this.loadingSave = true;
      this.error = '';
      try {
        await window.api.delete(`/api/buku/${id}`);
        await this.loadBuku();
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Gagal menghapus buku.';
      } finally {
        this.loadingSave = false;
      }
    },
  },

  created() {
    this.loadBuku();
    // kategori hanya dibutuhkan untuk admin (tetapi tetap bisa dimuat agar UX modal cepat)
    this.loadKategoriDropdown();
  },

  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <div class="mx-auto max-w-6xl px-4 py-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900/40">
              <span class="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
              CRUD Buku
            </div>
            <h1 class="mt-3 text-2xl font-bold tracking-tight">Buku</h1>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Search, tambah, edit, dan hapus buku.</p>
          </div>

            <div class="flex items-center gap-3">
            <button
              v-if="isLoggedIn()"

              @click="openCreateModal"
              class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              :disabled="loadingSave"
            >
              + Tambah
            </button>

            <button
              @click="$router.push(isLoggedIn() ? '/dashboard' : '/')"
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
                  placeholder="Cari judul / penulis / penerbit..."
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
          <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">Memuat buku...</div>
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
              <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">Daftar Buku</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Search & baca informasi buku.</div>
            </div>
          </div>

          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead>
                <tr class="text-xs uppercase tracking-wide text-slate-500">
                  <th class="py-2 pr-3">ID</th>
                  <th class="py-2 pr-3">Kategori</th>
                  <th class="py-2 pr-3">Judul</th>
                  <th class="py-2 pr-3">Penulis</th>
                  <th class="py-2 pr-3">Tahun</th>
                  <th class="py-2" v-if="isLoggedIn()">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in filteredItems" :key="b?.id ?? b?.judul" class="border-t border-slate-200 dark:border-slate-800">
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ b?.id ?? '-' }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ kategoriLabel(b?.kategori_id) }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ b?.judul ?? '-' }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200">{{ b?.penulis ?? '-' }}</td>
                  <td class="py-3 pr-3 text-slate-700 dark:text-slate-200 font-mono">{{ b?.tahun_terbit ?? '-' }}</td>
                  <td class="py-3" v-if="isLoggedIn()">
                    <div class="flex items-center gap-2">
                      <button
                        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                        :disabled="loadingSave"
                        @click="openEditModal(b)"
                      >
                        Edit
                      </button>
                      <button
                        class="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        :disabled="loadingSave"
                        @click="deleteItem(b)"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredItems.length === 0">
                  <td :colspan="isLoggedIn() ? 6 : 5" class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Data tidak ditemukan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal (hanya admin yang bisa membuka via tombol) -->
        <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

    <div class="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/80">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {{ modalMode === 'create' ? 'Tambah Buku' : 'Edit Buku' }}
                </div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Form lengkap (cover: upload gambar).</div>
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

            <div v-if="kategoriError" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              {{ kategoriError }}
            </div>

            <form class="mt-4" @submit.prevent="submitForm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Kategori</label>
                  <select
                    v-model="form.kategori_id"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  >
                    <option value="" disabled>-- pilih kategori --</option>
                    <option v-for="k in kategoriItems" :key="k?.id ?? k?.slug" :value="k?.id ?? k?._id">
                      {{ k?.nama_kategori ?? k?.slug ?? '-' }}
                    </option>
                  </select>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400" v-if="kategoriLoading">Memuat dropdown kategori...</div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Judul</label>
                  <input
                    v-model="form.judul"
                    type="text"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    placeholder="Judul buku"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Penulis</label>
                  <input
                    v-model="form.penulis"
                    type="text"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    placeholder="Nama penulis"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Penerbit</label>
                  <input
                    v-model="form.penerbit"
                    type="text"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    placeholder="Nama penerbit"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Tahun Terbit</label>
                  <input
                    v-model="form.tahun_terbit"
                    type="number"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    placeholder="2024"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Deskripsi</label>
                  <textarea
                    v-model="form.deskripsi"
                    rows="3"
                    class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    placeholder="Deskripsi buku"
                  ></textarea>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Cover</label>

                  <div class="mt-2 grid grid-cols-1 gap-3">
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-slate-200"
                        @change="onPickCoverFile"
                      />
                      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">jpg, jpeg, png, webp. Maks 2MB.</div>
                    </div>

                    <div v-if="coverPreviewUrl || (form.cover && String(form.cover).trim())" class="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/20 p-3">
                      <div class="text-xs font-semibold text-slate-600 dark:text-slate-300">Preview</div>
                      <img
                        :src="coverPreviewUrl || getCoverUrl(form.cover)"
                        alt="cover preview"
                        class="mt-2 h-40 w-full rounded-lg object-cover"
                      />
                      <div v-if="coverClientError" class="mt-2 text-xs text-red-700 dark:text-red-200">{{ coverClientError }}</div>
                    </div>

                    <div v-else class="rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-400">
                      Belum ada cover dipilih.
                    </div>
                  </div>
                </div>

              </div>

              <div class="flex items-center justify-end gap-3 mt-5">
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

