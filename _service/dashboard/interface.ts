export interface GetDataPerusahaan {
  data: {
    nama: string,
    nama_pemilik: string,
    nama_pimpinan: string,
    telp_fax: string,
    alamat: string,
    alamat_pabrik: string,
    tanggal_pendirian: string,
    klasifikasi_usaha: [],
    email: string,
    website: string
  };
}

export interface GetDataUser {
  data: {
    id: string,
    id_perusahaan: string,
    nama_perusahaan: string,
    username: string,
    email: string,
    email_terverifikasi: boolean,
    nama: string,
    telp: string,
    is_pic: boolean
  };
}

export interface GetSummaryHome {
  data: {
    total: number,
    accepted: number,
    not_accepted: number,
    total_penjualan: number
  };
}

export interface GetListLaporan {
  data: object
}

export interface GetDashboard {
  data: {
    list: [
      {
        tahun: number,
        pembelian_bahan: number,
        nilai_tambah: number,
        produktivitas_tenaga_kerja_1: number,
        produktivitas_tenaga_kerja_2: number,
        produktivitas_tenaga_kerja_3: number,
        produktivitas_tenaga_kerja_4: number,
        produktivitasi_modal_1: number,
        produktivitasi_modal_2: number,
        produktivitasi_modal_3: number,
        profitabilitas_1: number,
        profitabilitas_2: number,
        profitabilitas_3: number,
        rasio_pendukung_1: number,
        rasio_pendukung_2: number,
        rasio_pendukung_3: number
      }
    ]
  }
}

export interface Report {
  id: string,
  id_perusahaan: string,
  nama: string,
  tahun: number,
  semester: number,
  triwulan: any,
  penjualan: number,
  modal_operasi: number,
  total_investasi: number,
  total_penjualan_dan_modal: number,
  jumlah_tenaga_kerja: number,
  jumlah_jam_kerja: number,
  jumlah_jam_lembur: number,
  upah_dan_gaji_biaya_tenaga_kerja: number,
  dana_pensiun: number,
  tunjangan_tenaga_kerja: number,
  total_biaya_tenaga_kerja: number,
  laba_bersih: number,
  laba_operasi: number,
  total_laba: number,
  pajak_penghasilan: number,
  pajak_kekayaan: number,
  pajak_upah: number,
  total_pajak: number,
  penyusutan_gedung: number,
  penyusutan_peralatan_dan_mesin: number,
  total_penyusutan: number,
  bunga_pinjaman_jangka_panjang: number,
  bunga_pinjaman_jangka_pendek: number,
  total_bunga_pinjaman: number,
  kas_dan_bank: number,
  persediaan: number,
  piutang_dagang: number,
  piutang_lain: number,
  tanah: number,
  gedung: number,
  mesin_dan_peralatan: number,
  aktiva_tetap_lainnya: number,
  total_aktiva_perusahaan: number,
  pertanyaan_1: string,
  pertanyaan_2: string,
  pertanyaan_3: string,
  pertanyaan_4: string,
  pertanyaan_5: string,
  barang_dan_jasa_yang_dibeli: number,
  barang_yang_digunakan: number,
  bahan_baku: number,
  bahan_pengemas: number,
  total_bahan_yang_digunakan: number,
  pekerjaan_subkontrak: number,
  sewa_overhead: number,
  air_dan_listrik_overhead: number,
  asuransi_perusahaan: number,
  biaya_transport: number,
  pemeliharaan_mesin: number,
  biaya_supplies_dan_gedung: number,
  biaya_lain: number,
  total_overhead_produksi: number,
  sewa_administrasi: number,
  air_dan_listrik_administrasi: number,
  telepon: number,
  pos_dan_telegram: number,
  percetakan_stationary_dan_office_supplies: number,
  biaya_kendaraan: number,
  advertising: number,
  hiburan_entertainment: number,
  majalah_dan_surat_kabar: number,
  jamuan_makan: number,
  perbaikan_umum: number,
  biaya_bank: number,
  biaya_akuntan_dan_audit: number,
  biaya_bantuan_hukum_dan_jasa_profesional: number,
  komisi: number,
  biaya_umum: number,
  total_biaya_administrasi: number
}
