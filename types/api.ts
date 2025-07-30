export type MakroDataAPIResponse = {
  metadata: MakroDataAPIResponseMetadata,
  provinsi: MakroDataPayload,
  kota: MakroDataPayload[],
}

export type MakroDataAPIResponseMetadata = {
  tahun: number[],
  lapangan_usaha: {
    list: { kode: string, nama: string }[],
    dict: { [key: string]: string },
  }
};

export type MakroDataPayload = {
  id: string;
  nama: string;
  nama_lengkap: string;
  sensus: {
    jumlah_penduduk: (number|null)[],
    jumlah_angkatan_kerja: (number|null)[],
    jumlah_tenaga_kerja_bekerja: (number|null)[],
    pdrb_adhk: (number|null)[],
    upah_rata_rata: (number|null)[],
    jumlah_lapangan_usaha: (number|null)[],
    jumlah_jam_kerja: (number|null)[],
  },
  agregat: ParameterProduktivitasMakro;
  lapangan_usaha: { [key: string]: ParameterProduktivitasMakro };
}

export type ParameterProduktivitasMakro = {
  pdrb_adhk: (number|null)[],
  jumlah_tenaga_kerja_bekerja: (number|null)[],
  jumlah_rata_rata_upah: (number|null)[],
  jumlah_rata_rata_jam_kerja: (number|null)[],
  produktivitas_tenaga_kerja: (number|null)[],
  produktivitas_upah: (number|null)[],
  produktivitas_jam_kerja: (number|null)[],
  growth_produktivitas_tenaga_kerja: (number|null)[],
  growth_produktivitas_upah: (number|null)[],
  growth_produktivitas_jam_kerja: (number|null)[],
}