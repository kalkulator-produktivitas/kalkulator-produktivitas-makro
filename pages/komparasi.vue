<template>
  <div>
    <div class="md:mx-auto mt-6 mx-auto flex">
      <div class="flex shrink-0 w-[3%]">
      </div>
      <div class="px-1 py-1 absolute flex top-5 left-[15%] items-center bg-blue-700 rounded-full z-10">
        <Icon name="mdi:arrow-left-circle" class="cursor-pointer rounded-full border border-white bg-white"
          @click="navigateTo('/')" size="32" />

        <p class="text-white cursor-pointer mr-2" @click="navigateTo('/')">Back</p>
      </div>
      <div class="h-full relative w-[92vw]">
        <p class="font-bold text-xl text-[#034EA2]">Komparasi Kota</p>

        <div class="mt-4 w-full">
          <div class="border border-slate-200 rounded-lg p-6">
            <div class="flex flex-col gap-6">

              <!-- City Selection Section -->
              <div>
                <p class="text-lg font-medium mb-4">Pilih Kota untuk Komparasi</p>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- City 1 Selection -->
                  <div class="border border-slate-200 rounded-lg p-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Kota Pertama</p>
                    <div class="flex gap-2">
                      <select v-model="selectedProvince1" @change="getKotaList1"
                        class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Pilih provinsi...</option>
                        <option v-for="province in provinces" :key="province.id" :value="province.id">
                          {{ province.nama_lengkap }}
                        </option>
                      </select>

                      <select v-model="selectedCity1" :disabled="!selectedProvince1 || kotas1.length === 0"
                        class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Pilih kota...</option>
                        <option v-for="kota in kotas1" :key="kota.id" :value="kota.id">
                          {{ kota.nama }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- City 2 Selection -->
                  <div class="border border-slate-200 rounded-lg p-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Kota Kedua</p>
                    <div class="flex gap-2">
                      <select v-model="selectedProvince2" @change="getKotaList2"
                        class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Pilih provinsi...</option>
                        <option v-for="province in provinces" :key="province.id" :value="province.id">
                          {{ province.nama_lengkap }}
                        </option>
                      </select>

                      <select v-model="selectedCity2" :disabled="!selectedProvince2 || kotas2.length === 0"
                        class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Pilih kota...</option>
                        <option v-for="kota in kotas2" :key="kota.id" :value="kota.id">
                          {{ kota.nama }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Kode Usaha Selection Section -->
              <div>
                <p class="text-lg font-medium mb-4">Pilih Lapangan Usaha</p>
                <div class="flex gap-4 mb-4">
                  <button @click="selectAllKodeUsaha"
                    class="px-4 py-2 text-sm border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                    Pilih Semua
                  </button>
                  <button @click="clearAllKodeUsaha"
                    class="px-4 py-2 text-sm border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                    Hapus Semua
                  </button>
                </div>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                  <div v-for="usaha in lapanganUsaha" :key="usaha.kode" class="flex items-start">
                    <input :id="usaha.kode" type="checkbox" v-model="usaha.status" @change="applyFilter"
                      class="mt-1 w-4 h-4 text-[#034EA2] bg-gray-100 border-gray-300 rounded">
                    <label :for="usaha.kode" class="ms-3 text-sm leading-relaxed cursor-pointer">
                      <span class="font-medium text-[#034EA2]">{{ usaha.kode }}</span> - {{ usaha.nama }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Year Selection -->
              <div>
                <p class="text-lg font-medium mb-4">Pilih Tahun</p>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium">Tahun:</label>
                  <select v-model="selectedYear" class="p-2 border border-gray-300 rounded-md">
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>

              <!-- Compare Button -->
              <div class="flex justify-center">
                <button @click="compareCities" :disabled="!canCompare"
                  class="px-6 py-3 bg-[#034EA2] text-white rounded-lg hover:bg-[#023b7d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Bandingkan Kota
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Results -->
        <div v-if="showResults" class="mt-8">
          <div class="border border-slate-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-[#034EA2] mb-6">Hasil Komparasi</h2>

            <!-- City Comparison Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <!-- Left City Charts -->
              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 text-center">{{ city1Name }}</h3>
                <div class="space-y-4">
                  <!-- Bar Chart for PDRB -->
                  <GraphMacroBarChart2 v-if="city1FilteredData" :chart-data="city1Data_pdrb"
                    title="Produk Domestik Regional Bruto Atas Dasar Harga Konstan (Rp)" :key="`city1-pdrb`"
                    :millions="true" />

                  <!-- Stacked Bar Charts -->
                  <GraphMacroStackedBarChart v-if="city1FilteredData"
                    title="Produktivitas Tenaga Kerja (Rp milyar/orang/tahun)" :chart-data="city1Data_4" key="`city1"
                    :ribuan="true" />
                  <GraphMacroStackedBarChart v-if="city1FilteredData"
                    title="Produktivitas Jam Kerja (Rp juta/orang/jam)" :chart-data="city1Data_5" key="`city1-5"
                    :ribuan="false" :options="{ unit: 'juta' }" />
                  <GraphMacroStackedBarChart v-if="city1FilteredData" title="Produktivitas Upah (Rp /orang/tahun)"
                    :chart-data="city1Data_6" key="`city1-6" :options="{ unit: 'per ribu' }" />
                </div>
              </div>

              <!-- Right City Charts -->
              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 text-center">{{ city2Name }}</h3>
                <div class="space-y-4">
                  <!-- Bar Chart for PDRB -->
                  <GraphMacroBarChart2 v-if="city2FilteredData" :chart-data="city2Data_pdrb"
                    title="Produk Domestik Regional Bruto Atas Dasar Harga Konstan (Rp)" :key="`city2-pdrb`"
                    :millions="true" />

                  <!-- Stacked Bar Charts -->
                  <GraphMacroStackedBarChart v-if="city2FilteredData"
                    title="Produktivitas Tenaga Kerja (Rp milyar/orang/tahun)" :chart-data="city2Data_4" key="`city2"
                    :ribuan="true" />
                  <GraphMacroStackedBarChart v-if="city2FilteredData"
                    title="Produktivitas Jam Kerja (Rp juta/orang/jam)" :chart-data="city2Data_5" key="`city2-5"
                    :ribuan="false" :options="{ unit: 'juta' }" />
                  <GraphMacroStackedBarChart v-if="city2FilteredData" title="Produktivitas Upah (Rp /orang/tahun)"
                    :chart-data="city2Data_6" key="`city2-6" :options="{ unit: 'per ribu' }" />
                </div>
              </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-2">{{ city1Name }}</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Produktivitas Tenaga Kerja:</span>
                    <span class="font-medium">{{ mockData.city1.produktivitas_tenaga_kerja }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Produktivitas Upah:</span>
                    <span class="font-medium">{{ mockData.city1.produktivitas_upah }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Pertumbuhan:</span>
                    <span class="font-medium">{{ mockData.city1.pertumbuhan }}%</span>
                  </div>
                </div>
              </div>

              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-2">{{ city2Name }}</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Produktivitas Tenaga Kerja:</span>
                    <span class="font-medium">{{ mockData.city2.produktivitas_tenaga_kerja }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Produktivitas Upah:</span>
                    <span class="font-medium">{{ mockData.city2.produktivitas_upah }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Pertumbuhan:</span>
                    <span class="font-medium">{{ mockData.city2.pertumbuhan }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comparison Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Bar Chart Comparison -->
              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4">Perbandingan Produktivitas</h3>
                <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p class="text-gray-500">Chart: Produktivitas Tenaga Kerja</p>
                </div>
              </div>

              <!-- Line Chart Comparison -->
              <div class="border border-slate-200 rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4">Trend Pertumbuhan</h3>
                <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p class="text-gray-500">Chart: Trend Pertumbuhan</p>
                </div>
              </div>
            </div>

            <!-- Detailed Comparison Table -->
            <div class="mt-8">
              <h3 class="font-bold text-lg mb-4">Perbandingan Detail per Lapangan Usaha</h3>
              <div class="overflow-x-auto">
                <table class="w-full border border-slate-200">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="border border-slate-200 p-3 text-left">Lapangan Usaha</th>
                      <th class="border border-slate-200 p-3 text-center">{{ city1Name }}</th>
                      <th class="border border-slate-200 p-3 text-center">{{ city2Name }}</th>
                      <th class="border border-slate-200 p-3 text-center">Selisih</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="usaha in selectedLapanganUsaha" :key="usaha.kode" class="hover:bg-gray-50">
                      <td class="border border-slate-200 p-3">
                        <span class="font-medium text-[#034EA2]">{{ usaha.kode }}</span> - {{ usaha.nama }}
                      </td>
                      <td class="border border-slate-200 p-3 text-center">{{ getCityValue(mockData.city1, usaha.kode) }}
                      </td>
                      <td class="border border-slate-200 p-3 text-center">{{ getCityValue(mockData.city2, usaha.kode) }}
                      </td>
                      <td class="border border-slate-200 p-3 text-center">
                        <span
                          :class="getDifferenceClass(getCityValue(mockData.city1, usaha.kode), getCityValue(mockData.city2, usaha.kode))">
                          {{ getDifference(getCityValue(mockData.city1, usaha.kode), getCityValue(mockData.city2,
                            usaha.kode)) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProvince, getCity } from '~/_service/navigasi/nav';
import { useRequest } from '~/composables/useRequest';
import { ErrorApiResponse } from '~/_service/http/schema';
import { kodeUsaha } from '~/assets/helpers/kode_usaha';
import { getDashboardApi, getYearsApi } from '~/_service/dashboard/dashboardData';
import { BrightColors } from '~/assets/helpers/colors';

// City selection
const selectedProvince1 = ref('')
const selectedProvince2 = ref('')
const selectedCity1 = ref('')
const selectedCity2 = ref('')
const modal = ref({
  type: 'ERROR',
  message: '',
  show: false,
  status: ''
})
const loading = ref(false)

// API calls
const provinceList = useRequest(getProvince);
const kotaList = useRequest(getCity);
const dashboardApi = useRequest(getDashboardApi);
const provinces = ref<any[]>([])
const kotas1 = ref<any[]>([])
const kotas2 = ref<any[]>([])

// Year selection
const selectedYear = ref(2023)
const availableYears = ref([2018, 2019, 2020, 2021, 2022, 2023])

// Type definitions
interface LapanganUsaha {
  nama: string;
  status: boolean;
  kode: string;
}

interface MockCityData {
  produktivitas_tenaga_kerja: string;
  produktivitas_upah: string;
  pertumbuhan: number;
  [key: string]: string | number;
}

// Kode usaha selection
const lapanganUsaha = ref<LapanganUsaha[]>([
  { nama: 'Pertanian, Kehutanan, dan Perikanan', status: true, kode: 'A' },
  { nama: 'Pertambangan dan Penggalian', status: true, kode: 'B' },
  { nama: 'Industri Pengolahan', status: true, kode: 'C' },
  { nama: 'Pengadaan Listrik dan Gas', status: true, kode: 'D' },
  { nama: 'Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang', status: true, kode: 'E' },
  { nama: 'Konstruksi', status: true, kode: 'F' },
  { nama: 'Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor', status: true, kode: 'G' },
  { nama: 'Transportasi dan Pergudangan', status: true, kode: 'H' },
  { nama: 'Penyediaan Akomodasi dan Makan Minum', status: true, kode: 'I' },
  { nama: 'Informasi dan Komunikasi', status: true, kode: 'J' },
  { nama: 'Jasa Keuangan dan Asuransi', status: true, kode: 'K' },
  { nama: 'Real Estate', status: true, kode: 'L' },
  { nama: 'Jasa Perusahaan', status: true, kode: 'M,N' },
  { nama: 'Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib', status: true, kode: 'O' },
  { nama: 'Jasa Pendidikan', status: true, kode: 'P' },
  { nama: 'Jasa Kesehatan dan Kegiatan Sosial', status: true, kode: 'Q' },
  { nama: 'Jasa Lainnya', status: true, kode: 'R,S,T,U' }
])

// Results
const showResults = ref(false)
const city1Name = ref('')
const city2Name = ref('')

// Raw data from API calls
const city1RawData = ref(null)
const city2RawData = ref(null)

// Filtered data for each city
const city1FilteredData = ref(null)
const city2FilteredData = ref(null)

// Mock data for demonstration
const mockData = ref<{ city1: MockCityData; city2: MockCityData }>({
  city1: {
    produktivitas_tenaga_kerja: 'Rp 45.2 juta',
    produktivitas_upah: 'Rp 12.8 juta',
    pertumbuhan: 5.2,
    A: 1250000,
    B: 8900000,
    C: 15600000,
    D: 3200000,
    E: 1800000,
    F: 8500000,
    G: 9800000,
    H: 6500000,
    I: 4200000,
    J: 15800000,
    K: 12500000,
    L: 8500000,
    'M,N': 7200000,
    O: 6800000,
    P: 4200000,
    Q: 3800000,
    'R,S,T,U': 5200000
  },
  city2: {
    produktivitas_tenaga_kerja: 'Rp 38.7 juta',
    produktivitas_upah: 'Rp 10.9 juta',
    pertumbuhan: 3.8,
    A: 980000,
    B: 7200000,
    C: 12800000,
    D: 2800000,
    E: 1500000,
    F: 7200000,
    G: 8200000,
    H: 5800000,
    I: 3800000,
    J: 13200000,
    K: 10800000,
    L: 7200000,
    'M,N': 6200000,
    O: 5800000,
    P: 3800000,
    Q: 3200000,
    'R,S,T,U': 4500000
  }
})

// Computed properties
const selectedLapanganUsaha = computed(() => {
  return lapanganUsaha.value.filter((usaha: LapanganUsaha) => usaha.status)
})

const canCompare = computed(() => {
  return selectedCity1.value && selectedCity2.value && selectedLapanganUsaha.value.length > 0
})

// City 1 Chart Data - Produktivitas Tenaga Kerja
const city1Data_4 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city1RawData.value as any)?.metadata?.tahun || !city1FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city1RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city1FilteredData.value && city1FilteredData.value[kode]) {
      const sectorData: any = city1FilteredData.value[kode]?.['produktivitas_tenaga_kerja'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 1 Chart Data - Produktivitas Jam Kerja
const city1Data_5 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city1RawData.value as any)?.metadata?.tahun || !city1FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city1RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city1FilteredData.value && city1FilteredData.value[kode]) {
      const sectorData: any = city1FilteredData.value[kode]?.['produktivitas_jam_kerja'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 1 Chart Data - Produktivitas Upah
const city1Data_6 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city1RawData.value as any)?.metadata?.tahun || !city1FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city1RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city1FilteredData.value && city1FilteredData.value[kode]) {
      const sectorData: any = city1FilteredData.value[kode]?.['produktivitas_upah'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 2 Chart Data - Produktivitas Tenaga Kerja
const city2Data_4 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city2RawData.value as any)?.metadata?.tahun || !city2FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city2RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city2FilteredData.value && city2FilteredData.value[kode]) {
      const sectorData: any = city2FilteredData.value[kode]?.['produktivitas_tenaga_kerja'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 2 Chart Data - Produktivitas Jam Kerja
const city2Data_5 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city2RawData.value as any)?.metadata?.tahun || !city2FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city2RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city2FilteredData.value && city2FilteredData.value[kode]) {
      const sectorData: any = city2FilteredData.value[kode]?.['produktivitas_jam_kerja'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 2 Chart Data - Produktivitas Upah
const city2Data_6 = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!(city2RawData.value as any)?.metadata?.tahun || !city2FilteredData.value) {
    return dataset
  }

  // Set years as labels (x-axis)
  dataset.labels = (city2RawData.value as any).metadata.tahun

  // Create a dataset for each lapangan usaha (sector)
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  filteredKode.forEach((kode: string, index: number) => {
    if (city2FilteredData.value && city2FilteredData.value[kode]) {
      const sectorData: any = city2FilteredData.value[kode]?.['produktivitas_upah'] || []
      if (sectorData?.length > 0) {
        dataset.datasets.push({
          label: kodeUsaha[kode] || kode,
          data: sectorData.map((val: any) => parseFloat(val) || 0),
          backgroundColor: BrightColors[index % BrightColors.length],
          borderRadius: 5,
        })
      }
    }
  })

  return dataset
})

// City 1 PDRB Bar Chart Data
const city1Data_pdrb = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!city1FilteredData.value || !(city1RawData.value as any)?.metadata?.tahun) {
    return dataset
  }

  // Get the latest year index (since we're only showing one year)
  const yearIndex = (city1RawData.value as any).metadata.tahun.length - 1

  // Create labels from filtered lapangan usaha
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  dataset.labels = filteredKode.map((kode: string) => kodeUsaha[kode] || kode)

  // Create data array for the selected year
  const pdrb_data = filteredKode.map((kode: string) => {
    if (city1FilteredData.value && city1FilteredData.value[kode]) {
      const sectorData: any = city1FilteredData.value[kode]?.['pdrb_adhk'] || []
      return parseFloat(sectorData[yearIndex]) || 0
    }
    return 0
  })

  dataset.datasets.push({
    label: selectedYear.value.toString(),
    data: pdrb_data,
    backgroundColor: BrightColors.map((color, index) => color),
    borderRadius: 5,
  })

  return dataset
})

// City 2 PDRB Bar Chart Data
const city2Data_pdrb = computed(() => {
  const dataset: any = {
    labels: [],
    datasets: [],
  }

  if (!city2FilteredData.value || !(city2RawData.value as any)?.metadata?.tahun) {
    return dataset
  }

  // Get the latest year index (since we're only showing one year)
  const yearIndex = (city2RawData.value as any).metadata.tahun.length - 1

  // Create labels from filtered lapangan usaha
  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  dataset.labels = filteredKode.map((kode: string) => kodeUsaha[kode] || kode)

  // Create data array for the selected year
  const pdrb_data = filteredKode.map((kode: string) => {
    if (city2FilteredData.value && city2FilteredData.value[kode]) {
      const sectorData: any = city2FilteredData.value[kode]?.['pdrb_adhk'] || []
      return parseFloat(sectorData[yearIndex]) || 0
    }
    return 0
  })

  dataset.datasets.push({
    label: selectedYear.value.toString(),
    data: pdrb_data,
    backgroundColor: BrightColors.map((color, index) => color),
    borderRadius: 5,
  })

  return dataset
})

// Functions
const getKotaList1 = async () => {
  try {
    if (!selectedProvince1.value) {
      kotas1.value = []
      selectedCity1.value = ''
      return
    }

    const res = await kotaList.call(selectedProvince1.value)
    kotas1.value = res.list
    selectedCity1.value = ''
  } catch (e) {
    console.error('Error loading cities for province 1:', e)
  }
}

const getKotaList2 = async () => {
  try {
    if (!selectedProvince2.value) {
      kotas2.value = []
      selectedCity2.value = ''
      return
    }

    const res = await kotaList.call(selectedProvince2.value)
    kotas2.value = res.list
    selectedCity2.value = ''
  } catch (e) {
    console.error('Error loading cities for province 2:', e)
  }
}

const selectAllKodeUsaha = () => {
  lapanganUsaha.value.forEach((usaha: LapanganUsaha) => usaha.status = true)
  applyFilter()
}

const clearAllKodeUsaha = () => {
  lapanganUsaha.value.forEach((usaha: LapanganUsaha) => usaha.status = false)
  applyFilter()
}

// Extract specific city data from raw API response
const extractCityData = () => {
  if (!city1RawData.value || !city2RawData.value) return

  // Find the specific city data in the kota array from each raw data
  const city1 = kotas1.value.find((k: any) => k.id === selectedCity1.value)
  const city2 = kotas2.value.find((k: any) => k.id === selectedCity2.value)

  if ((city1RawData.value as any).kota && (city1RawData.value as any).kota.length > 0) {
    const cityData1 = (city1RawData.value as any).kota.find((c: any) => c.nama === city1?.nama)
    if (cityData1) {
      city1FilteredData.value = cityData1.lapangan_usaha
    }
  }

  if ((city2RawData.value as any).kota && (city2RawData.value as any).kota.length > 0) {
    const cityData2 = (city2RawData.value as any).kota.find((c: any) => c.nama === city2?.nama)
    if (cityData2) {
      city2FilteredData.value = cityData2.lapangan_usaha
    }
  }

  // Apply filter based on selected lapangan usaha
  applyFilter()
}

// Apply filter based on selected lapangan usaha - similar to dashboard.vue
const applyFilter = () => {
  if (!city1FilteredData.value || !city2FilteredData.value) return

  const filteredUsaha = lapanganUsaha.value.filter((x: LapanganUsaha) => x.status === true)
  const filteredKode = filteredUsaha.map((x: LapanganUsaha) => x.kode)

  // Filter city1 data
  const filtered1 = Object.fromEntries(
    Object.entries(city1FilteredData.value).filter(([key]) =>
      filteredKode.includes(key)
    )
  )

  // Filter city2 data
  const filtered2 = Object.fromEntries(
    Object.entries(city2FilteredData.value).filter(([key]) =>
      filteredKode.includes(key)
    )
  )

  console.log('Filtered City 1 Data:', filtered1)
  console.log('Filtered City 2 Data:', filtered2)

  // Trigger chart updates by updating the filtered data
  // The computed properties will automatically recalculate
}

const compareCities = async () => {
  if (!canCompare.value) return

  try {
    loading.value = true

    // Call dashboard API for both cities' provinces with the selected year
    const city1Data = await dashboardApi.call(selectedYear.value, selectedYear.value, selectedProvince1.value)
    const city2Data = await dashboardApi.call(selectedYear.value, selectedYear.value, selectedProvince2.value)

    // Store raw data from API
    city1RawData.value = city1Data
    city2RawData.value = city2Data

    // Get city names
    const city1 = kotas1.value.find((k: any) => k.id === selectedCity1.value)
    const city2 = kotas2.value.find((k: any) => k.id === selectedCity2.value)

    city1Name.value = city1?.nama || 'Kota 1'
    city2Name.value = city2?.nama || 'Kota 2'

    // Extract specific city data from the raw data
    extractCityData()

    console.log('City 1 Raw Data:', city1RawData.value)
    console.log('City 2 Raw Data:', city2RawData.value)
    console.log('City 1 Filtered Data:', city1FilteredData.value)
    console.log('City 2 Filtered Data:', city2FilteredData.value)

    showResults.value = true
    loading.value = false
  } catch (e) {
    loading.value = false
    if (e instanceof ErrorApiResponse) {
      console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
      modal.value.type = 'ERROR'
      modal.value.message = e.message
      modal.value.show = true
    } else {
      console.error('UNKNOWN ERROR: ', (e as any)?.message ?? 'Unknown Error')
      modal.value.type = 'ERROR'
      modal.value.message = 'UNKNOWN ERROR: '
      modal.value.show = true
    }
  }
}

const getDifference = (value1: number, value2: number) => {
  const diff = value1 - value2
  return diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()
}

const getCityValue = (cityData: MockCityData, kode: string): number => {
  const value = cityData[kode]
  return typeof value === 'number' ? value : 0
}

const getDifferenceClass = (value1: number, value2: number) => {
  const diff = value1 - value2
  return diff > 0 ? 'text-green-600 font-medium' : diff < 0 ? 'text-red-600 font-medium' : 'text-gray-600'
}

// Load provinces on mount
onMounted(async () => {
  try {
    const res = await provinceList.call()
    provinces.value = res.list
  } catch (e: any) {
    if (e instanceof ErrorApiResponse) {
      console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
    } else {
      console.error('UNKNOWN ERROR: ', e?.message ?? 'Unknown Error')
    }
  }
})
</script>

<style scoped>
/* Customize scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #034EA2;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #023b7d;
}
</style>