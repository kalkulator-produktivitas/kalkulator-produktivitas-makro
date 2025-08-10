<template>
  <div class="">
    <div id="layout" class="md:mx-auto mx-auto flex w-full">
      <div class="flex shrink-0 w-[3%]">

      </div>
      <div class="lg:relative mt-8 w-full">
        <p class="font-bold text-xl">Dashboard Produktivitas Makro</p>
        <div class="mt-2 flex gap-4 justify-between w-[70%]">
          <div class="flex gap-4">
            <div class="px-1 py-1 flex items-center bg-blue-700 rounded-full">
              <Icon name="mdi:arrow-left-circle" class="cursor-pointer rounded-full border border-white bg-white"
                @click="navigateTo('/')" size="24" />
              <p class="text-white cursor-pointer mr-2" @click="navigateTo('/')">Back</p>
            </div>
            <select v-model="subTab" @change="changeTab(subTab)"
              class="w-[200px] py-1.5 px-3 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="subt in tabList" :key="subt" :value="subt" class="py-1">
                {{ subt }}
              </option>
            </select>
          </div>

          <div class="w-full flex justify-center items-center gap-4">
            <p class="text-md text-gray-700">{{ yearSlider.minValue }}</p>
            <WidgetSlider class="w-[80%]" :min-threshold="yearSlider.min" :max-threshold="yearSlider.max"
              :min="yearSlider.minValue" :max="yearSlider.maxValue" @update:min="value => yearSlider.minValue = value"
              @update:max="value => yearSlider.maxValue = value" :id="state" :key="state">
            </WidgetSlider>
            <p class="text-md text-gray-700">{{ yearSlider.maxValue }}</p>

            <button @click="downloadData" :disabled="!buttonActive || isLoading"
              class="bg-[#034EA2] text-white px-3 py-1 rounded-lg self-center hover:bg-[#023b7d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit
            </button>
          </div>

          <div class="flex gap-4 absolute top-3 right-5">
            <button @click="createReport" :disabled="!buttonActive"
              class="bg-[#034EA2] text-white px-3 py-1 rounded-lg self-center hover:bg-[#023b7d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Buat Laporan
            </button>
          </div>
        </div>

        <div v-if="hasData" class="w-full">
          <!-- Main Content Area -->
          <div class="w-full">
            <!-- Toggle Sidebar Button -->
            <div class="flex justify-end mb-4">
              <button @click="toggleSidebar" 
                class="flex items-center gap-2 px-3 py-2 bg-[#034EA2] text-white rounded-lg hover:bg-[#023b7d] transition-all duration-300">
                <Icon :name="sidebarOpen ? 'mdi:chevron-right' : 'mdi:chevron-left'" size="20" />
                <span class="text-sm">{{ sidebarOpen ? 'Hide' : 'Show' }} Filters</span>
              </button>
            </div>

            <!-- Line Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              <div class="min-h-[350px]">
                <GraphMacroLineChart :chart-data="data_1_new" title="Produktivitas Tenaga Kerja (Juta)" :key="state"
                  :millions="false" :options="{ legends: false, datalabels: true, height: '320px' }" />
              </div>
              <div class="min-h-[350px]">
                <GraphMacroLineChart :chart-data="data_2_new" title="Pertumbuhan Produktivitas Tenaga Kerja (%)"
                  :key="state" :millions="false" :options="{ legends: false, datalabels: true, height: '320px' }" />
              </div>
              <div class="min-h-[350px]">
                <GraphMacroLineChart :chart-data="data_3_new" title="Produktivitas Upah" :key="state" :millions="false"
                  :options="{ legends: false, datalabels: true, height: '320px' }" />
              </div>
              <div class="min-h-[350px]">
                <GraphMacroLineChart :chart-data="data_8" title="Produktivitas Bruto Dalam Negeri" :key="state"
                  :millions="true" :options="{ legends: false, datalabels: true, height: '320px' }" />
              </div>
              <div class="min-h-[350px]">
                <GraphMacroLineChart :chart-data="data_9" title="Jumlah Tenaga Kerja" :key="state"
                  :millions="false" :options="{ legends: false, datalabels: true, height: '320px' }" />
              </div>
            </div>
            
            <!-- Additional Line Chart Section -->
            <div class="mt-4 w-full">
              <GraphMacroLineChart 
                v-if="dashboardApi.data"
                :chart-data="data_4_line" 
                title="Produktivitas Tenaga Kerja per Lapangan Usaha" 
                :key="state"
                :millions="false" 
                :options="{ legends: true, datalabels: false, fullWidth: true, height: '450px' }" 
              />
            </div>
            
            <!-- Bar Charts Section - 2 Columns -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Tenaga Kerja"
                paramKey="produktivitas_tenaga_kerja"
                :data="dashboardApi.data.value"
                :chart-data="data_4"
                :key="state"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Jam Kerja"
                paramKey="produktivitas_jam_kerja"
                :data="dashboardApi.data.value"
                :chart-data="data_5"
                :key="state"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Upah"
                paramKey="produktivitas_upah"
                :data="dashboardApi.data.value"
                :chart-data="data_6"
                :key="state"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Pertumbuhan Produktivitas Tenaga Kerja"
                paramKey="growth_produktivitas_tenaga_kerja"
                :data="dashboardApi.data.value"
                :chart-data="data_7"
                :key="state"
              />
            </div>
          </div>

          <!-- Fixed Overlay Sidebar -->
          <div v-if="sidebarOpen" class="fixed inset-0 z-50">
            <!-- Darkened Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="toggleSidebar"></div>
            
            <!-- Sidebar Panel -->
            <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              <div class="h-full flex flex-col">
                <!-- Header -->
                <div class="flex justify-between items-start border-b border-slate-300 p-4">
                  <div>
                    <p class="text-[#034EA2] font-bold text-lg">Filters</p>
                    <p class="text-sm text-gray-600 mt-1">Lapangan Usaha</p>
                  </div>
                  <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700">
                    <Icon name="mdi:close" size="24" />
                  </button>
                </div>
                
                <!-- Filter Actions -->
                <div class="flex gap-2 p-4 border-b border-slate-200">
                  <button @click="addAll"
                    class="px-3 py-1 text-xs border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                    Pilih Semua
                  </button>
                  <button @click="removeAll"
                    class="px-3 py-1 text-xs border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                    Hapus Semua
                  </button>
                </div>
                
                <!-- Filter List -->
                <div class="flex-1 overflow-y-auto p-4">
                  <div v-for="usaha of lapanganUsaha" :key="usaha.nama" class="flex items-start mb-3"
                    @change="applyFilter">
                    <input :id="usaha.kode" type="checkbox" v-model="usaha.status"
                      class="mt-1 w-4 h-4 text-[#034EA2] bg-gray-100 border-gray-300 rounded dark:border-gray-600">
                    <label :for="usaha.kode" class="ms-3 text-sm leading-relaxed"
                      :class="`${usaha.kode ? 'text-[#034EA2]' : 'text-gray-900'}`">
                      {{ usaha.nama }} (Kode {{ usaha.kode }})</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center h-[50vh]">
          <p class="text-gray-500">Pilih tahun dan klik "Submit" untuk melihat dashboard</p>
        </div>
      </div>
    </div>
    <!-- {{ yearSlider }} -->
    <ReportProvinsiGen v-if="reportType === 'Provinsi' && preview === true" class="fixed inset-0 z-50"
      @close-preview="reloadApp" :rawdata="rawData2" />
    <ReportKotaGen v-if="reportType === 'Kabupaten' && preview === true" :kota="subTab" class="fixed inset-0 z-50"
      @close-preview="reloadApp" :rawdata="rawData2" />
    <Popup v-if="modal.show === true" :title="modal.title" :message="modal.message" @close="closeModal" />
    <Loading v-if="isLoading" text="Fetching Data..." />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
});

import { getDashboardApi, getYearsApi } from '~/_service/dashboard/dashboardData';
import { getCity, getProvince } from '~/_service/navigasi/nav';
import { useRequest } from '~/composables/useRequest';
import { ErrorApiResponse } from '~/_service/http/schema';
import { ChartColors, BrightColors } from '~/assets/helpers/colors'
import { kodeUsaha } from '~/assets/helpers/kode_usaha'

const route = useRoute()

const dashboardApi = useRequest(getDashboardApi);
const yearsApi = useRequest(getYearsApi);
const provinceApi = useRequest(getProvince);
const cityApi = useRequest(getCity);

import macro from '~/assets/macro.json'

let years = ref([])

let yearSlider = ref({
  min: 0,
  max: 0,
  minValue: 0,
  maxValue: 0
})

const rawData2 = ref(null);
const isLoading = ref(false)
const hasData = ref(false)
const buttonActive = ref(true)

let reportType = ref("Provinsi")

let tabList = ref([])

let subTab = ref('')

const data = ref()
const fullData = ref()

let listProvince
let listKota

try {
  isLoading.value = true
  years.value = await yearsApi.call(route.query.id_provinsi)
  years.value = years.value.tahun
  if (years.value.length !== 0) { 
    buttonActive.value = true
    yearSlider.value.min = Math.min(...years.value)
    yearSlider.value.max = Math.max(...years.value)
    yearSlider.value.minValue = yearSlider.value.min
    yearSlider.value.maxValue = yearSlider.value.max
    listProvince = await provinceApi.call()
    listProvince = listProvince.list.filter(x => x.id === route.query.id_provinsi)[0]
    tabList.value.push(listProvince.nama)
    subTab.value = listProvince.nama
    listKota = await cityApi.call(listProvince.id)
    isLoading.value = false
  } else {
    hasData.value = false
    isLoading.value = false
    buttonActive.value = false
    yearSlider.value.min = null
    yearSlider.value.max = null
    yearSlider.value.minValue = null
    yearSlider.value.maxValue = null

  }
} catch (e) {
  if (e instanceof ErrorApiResponse) {
    console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
  } else {
    console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
  }
}

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

const preview = ref(null)
// sample standard deviation
const std = (arr) => {
  const mu = mean(arr);
  const diffArr = arr.map(a => (a - mu) ** 2);
  return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
  const sorted = asc(arr);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

const modal = ref({
  show: false,
  type: '',
  message: '',
  status: undefined
})

const reloadApp = () => {
  // reloadNuxtApp({
  //   path: "/dashboard",
  //   ttl: 100,
  // });
  preview.value = false
}

const state = ref(0)
const sidebarOpen = ref(false) // Changed to false by default to avoid conflicts

const closeModal = () => {
  modal.value.show = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const lapanganUsaha = ref([
  {
    nama: 'Pertanian, Kehutanan, dan Perikanan',
    status: true,
    kode: 'A'
  },
  {
    nama: 'Pertambangan dan Penggalian',
    status: true,
    kode: 'B'
  },
  {
    nama: 'Industri Pengolahan',
    status: true,
    kode: 'C'
  },
  {
    nama: 'Pengadaan Listrik dan Gas',
    status: true,
    kode: 'D'
  },
  {
    nama: 'Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang',
    status: true,
    kode: 'E'
  },
  {
    nama: 'Konstruksi',
    status: true,
    kode: 'F'
  },
  {
    nama: 'Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor',
    status: true,
    kode: 'G'
  },
  {
    nama: 'Transportasi dan Pergudangan',
    status: true,
    kode: 'H'
  },
  {
    nama: 'Penyediaan Akomodasi dan Makan Minum',
    status: true,
    kode: 'I'
  },
  {
    nama: 'Informasi dan Komunikasi',
    status: true,
    kode: 'J'
  },
  {
    nama: 'Jasa Keuangan dan Asuransi',
    status: true,
    kode: 'K'
  },
  {
    nama: 'Real Estate',
    status: true,
    kode: 'L'
  },
  {
    nama: 'Jasa Perusahaan',
    status: true,
    kode: 'M,N'
  },
  {
    nama: 'Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib',
    status: true,
    kode: 'O'
  },
  {
    nama: 'Jasa Pendidikan',
    status: true,
    kode: 'P'
  },
  {
    nama: 'Jasa Kesehatan dan Kegiatan Sosial',
    status: true,
    kode: 'Q'
  },
  {
    nama: 'Jasa Lainnya',
    status: true,
    kode: 'R,S,T,U'
  }
])

const countSelected = computed(() => {
  return lapanganUsaha.value.filter(x => x.status === true).length
})

const applyFilter = () => {
  let filteredUsaha = lapanganUsaha.value.filter(x => x.status === true)
  let filteredKode = filteredUsaha.map(x => x.kode)

  // Filter the object by keeping only selected keys
  const filtered = Object.fromEntries(
    Object.entries(fullData.value).filter(([key]) =>
      filteredKode.includes(key)
    )
  )

  data.value = filtered
}

const addAll = () => {
  lapanganUsaha.value.forEach(x => x.status = true)
  applyFilter()
}

const removeAll = () => {
  lapanganUsaha.value.forEach(x => x.status = false)
  applyFilter()
}

const changeTab = (x) => {
  // listKota.map(kota => kota.nama)
  subTab.value = x
  if (subTab.value === listProvince.nama) {
    reportType.value = "Provinsi"
    data.value = rawData2.value["provinsi"]["lapangan_usaha"]
  } else if (listKota.list.map(kota => kota.nama).includes(subTab.value)) {
    reportType.value = "Kabupaten"
    let kotaData = rawData2.value["kota"].filter(x => x.nama === subTab.value)[0]
    data.value = kotaData.lapangan_usaha
  }
}

const data_1_new = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }

  // Check if rawData2 exists and has required properties
  if (!rawData2.value || !rawData2.value.provinsi || !rawData2.value.metadata) {
    return dataset
  }

  // Add province data
  const provinsiData = rawData2.value["provinsi"]["agregat"]["produktivitas_tenaga_kerja"] || []
  if (provinsiData.length > 0) {
    dataset.datasets.push({
      label: "DKI Jakarta",
      data: provinsiData.filter(x => x !== null),
      backgroundColor: "#3867D6",
      borderRadius: 5,
    })
  }

  // Add all cities data
  if (rawData2.value["kota"] && rawData2.value["kota"].length > 0) {
    const colors = ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6"]
    
    rawData2.value["kota"].forEach((kota, index) => {
      const kotaData = kota?.agregat?.produktivitas_tenaga_kerja || []
      if (kotaData.length > 0) {
        dataset.datasets.push({
          label: kota.nama,
          data: kotaData.filter(x => x !== null),
          backgroundColor: colors[index % colors.length],
          borderRadius: 5,
        })
      }
    })
  }

  dataset.labels = (rawData2.value.metadata.tahun || []).slice(0, Math.max(...dataset.datasets.map(ds => ds.data.length)))

  return dataset
})

const data_2_new = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if rawData2 exists and has required properties
  if (!rawData2.value || !rawData2.value.provinsi || !rawData2.value.metadata) {
    return dataset
  }
  
  // Add province data
  const provinsiData = rawData2.value["provinsi"]["agregat"]["growth_produktivitas_tenaga_kerja"] || []
  if (provinsiData.length > 0) {
    dataset.datasets.push({
      label: "DKI Jakarta",
      data: provinsiData.filter(x => x !== null),
      backgroundColor: "#3867D6",
      borderRadius: 5,
    })
  }

  // Add all cities data
  if (rawData2.value["kota"] && rawData2.value["kota"].length > 0) {
    const colors = ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6"]
    
    rawData2.value["kota"].forEach((kota, index) => {
      const kotaData = kota?.agregat?.growth_produktivitas_tenaga_kerja || []
      if (kotaData.length > 0) {
        dataset.datasets.push({
          label: kota.nama,
          data: kotaData.filter(x => x !== null),
          backgroundColor: colors[index % colors.length],
          borderRadius: 5,
        })
      }
    })
  }

  dataset.labels = (rawData2.value.metadata.tahun || []).slice(1, Math.max(...dataset.datasets.map(ds => ds.data.length)))

  return dataset
})

const data_3_new = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if rawData2 exists and has required properties
  if (!rawData2.value || !rawData2.value.provinsi || !rawData2.value.metadata) {
    return dataset
  }
  
  // Add province data
  const provinsiData = rawData2.value["provinsi"]["agregat"]["produktivitas_upah"] || []
  if (provinsiData.length > 0) {
    dataset.datasets.push({
      label: "DKI Jakarta",
      data: provinsiData.filter(x => x !== null),
      backgroundColor: "#3867D6",
      borderRadius: 5,
    })
  }

  // Add all cities data
  if (rawData2.value["kota"] && rawData2.value["kota"].length > 0) {
    const colors = ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6"]
    
    rawData2.value["kota"].forEach((kota, index) => {
      const kotaData = kota?.agregat?.produktivitas_upah || []
      if (kotaData.length > 0) {
        dataset.datasets.push({
          label: kota.nama,
          data: kotaData.filter(x => x !== null),
          backgroundColor: colors[index % colors.length],
          borderRadius: 5,
        })
      }
    })
  }

  dataset.labels = (rawData2.value.metadata.tahun || []).slice(0, Math.max(...dataset.datasets.map(ds => ds.data.length)))
  return dataset
})

const data_8 = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }

  // Check if rawData2 exists and has required properties
  if (!rawData2.value || !rawData2.value.provinsi || !rawData2.value.metadata) {
    return dataset
  }

  // Add province data
  const provinsiData = rawData2.value["provinsi"]["agregat"]["pdrb_adhk"] || []
  if (provinsiData.length > 0) {
    dataset.datasets.push({
      label: "DKI Jakarta",
      data: provinsiData.filter(x => x !== null),
      backgroundColor: "#3867D6",
      borderRadius: 5,
    })
  }

  // Add all cities data
  if (rawData2.value["kota"] && rawData2.value["kota"].length > 0) {
    const colors = ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6"]
    
    rawData2.value["kota"].forEach((kota, index) => {
      const kotaData = kota?.agregat?.pdrb_adhk || []
      if (kotaData.length > 0) {
        dataset.datasets.push({
          label: kota.nama,
          data: kotaData.filter(x => x !== null),
          backgroundColor: colors[index % colors.length],
          borderRadius: 5,
        })
      }
    })
  }

  dataset.labels = (rawData2.value.metadata.tahun || []).slice(0, Math.max(...dataset.datasets.map(ds => ds.data.length)))

  return dataset
})


const data_9 = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }

  // Check if rawData2 exists and has required properties
  if (!rawData2.value || !rawData2.value.provinsi || !rawData2.value.metadata) {
    return dataset
  }

  // Add province data
  const provinsiData = rawData2.value["provinsi"]["agregat"]["jumlah_tenaga_kerja_bekerja"] || []
  if (provinsiData.length > 0) {
    dataset.datasets.push({
      label: "DKI Jakarta",
      data: provinsiData.filter(x => x !== null),
      backgroundColor: "#3867D6",
      borderRadius: 5,
    })
  }

  // Add all cities data
  if (rawData2.value["kota"] && rawData2.value["kota"].length > 0) {
    const colors = ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6"]
    
    rawData2.value["kota"].forEach((kota, index) => {
      const kotaData = kota?.agregat?.jumlah_tenaga_kerja_bekerja || []
      if (kotaData.length > 0) {
        dataset.datasets.push({
          label: kota.nama,
          data: kotaData.filter(x => x !== null),
          backgroundColor: colors[index % colors.length],
          borderRadius: 5,
        })
      }
    })
  }

  dataset.labels = (rawData2.value.metadata.tahun || []).slice(0, Math.max(...dataset.datasets.map(ds => ds.data.length)))

  return dataset
})

const data_4 = computed(() => {
  let dataNew = data.value
  
  const dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if required data exists
  if (!rawData2.value?.metadata?.tahun || !dataNew) {
    return dataset
  }
  
  for (let year of rawData2.value.metadata.tahun) {
    dataset.datasets.push({
      label: year,
      data: [],
      backgroundColor: BrightColors[rawData2.value.metadata.tahun.indexOf(year)],
      borderRadius: 100,
    })
  }

  for (let x in dataNew) {
    dataset.labels.push(`${kodeUsaha[x] || x}`)
    for (let i = 0; i <= rawData2.value.metadata.tahun.length - 1; i++) {
      const value = dataNew[x]?.['produktivitas_tenaga_kerja']?.[i]
      dataset.datasets[i].data.push(parseFloat(value) || 0)
    }
  }
  return dataset
})

const data_4_line = computed(() => {
  let dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if required data exists
  if (!rawData2.value?.metadata?.tahun || !data.value) {
    return dataset
  }
  
  // Create a dataset for each lapangan usaha kode
  const colors = ["#3867D6", "#E74C3C", "#F39C12", "#27AE60", "#8E44AD", "#3498DB", "#E67E22", "#1ABC9C", "#9B59B6", "#34495E", "#95A5A6", "#F1C40F", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4"]
  
  for (let kode in data.value) {
    const kodeData = data.value[kode]?.produktivitas_tenaga_kerja || []
    if (kodeData.length > 0) {
      dataset.datasets.push({
        label: kodeUsaha[kode] || kode,
        data: kodeData.filter(x => x !== null).map(val => parseFloat(val) || 0),
        backgroundColor: colors[dataset.datasets.length % colors.length],
        borderRadius: 5,
      })
    }
  }
  
  dataset.labels = (rawData2.value.metadata.tahun || []).slice(0, Math.max(...dataset.datasets.map(ds => ds.data.length)))
  
  return dataset
})

const data_5 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if required data exists
  if (!rawData2.value?.metadata?.tahun || !dataNew) {
    return dataset
  }
  
  for (let year of rawData2.value.metadata.tahun) {
    dataset.datasets.push({
      label: year,
      data: [],
      backgroundColor: BrightColors[rawData2.value.metadata.tahun.indexOf(year)],
      borderRadius: 100,
    })
  }

  for (let x in dataNew) {
    dataset.labels.push(`${kodeUsaha[x] || x}`)
    for (let i = 0; i <= rawData2.value.metadata.tahun.length - 1; i++) {
      const value = dataNew[x]?.['produktivitas_jam_kerja']?.[i]
      dataset.datasets[i].data.push(parseFloat(value) || 0)
    }
  }
  return dataset
})

const data_6 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if required data exists
  if (!rawData2.value?.metadata?.tahun || !dataNew) {
    return dataset
  }
  
  for (let year of rawData2.value.metadata.tahun) {
    dataset.datasets.push({
      label: year,
      data: [],
      backgroundColor: BrightColors[rawData2.value.metadata.tahun.indexOf(year)],
      borderRadius: 100,
    })
  }

  for (let x in dataNew) {
    dataset.labels.push(`${kodeUsaha[x] || x}`)
    for (let i = 0; i <= rawData2.value.metadata.tahun.length - 1; i++) {
      const value = dataNew[x]?.['produktivitas_upah']?.[i]
      dataset.datasets[i].data.push(parseFloat(value) || 0)
    }
  }
  return dataset
})

const data_7 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [],
  }
  
  // Check if required data exists
  if (!rawData2.value?.metadata?.tahun || !dataNew) {
    return dataset
  }
  
  for (let year of rawData2.value.metadata.tahun) {
    dataset.datasets.push({
      label: year,
      data: [],
      backgroundColor: BrightColors[rawData2.value.metadata.tahun.indexOf(year)],
      borderRadius: 100,
    })
  }

  for (let x in dataNew) {
    dataset.labels.push(`Kode ${x}`)
    for (let i = 0; i <= rawData2.value.metadata.tahun.length - 1; i++) {
      const value = dataNew[x]?.['growth_produktivitas_tenaga_kerja']?.[i]
      dataset.datasets[i].data.push(parseFloat(value) || 0)
    }
  }
  return dataset
})

const reportData = ref([])

const createReport = () => {
  if (hasData.value) {
    preview.value = true
  } else {
    modal.value = {
      show: true,
      title: 'Warning',
      message: 'Pilih tahun dan klik "Submit" untuk melihat dashboard'
    }
  }
}


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const selectedMonth = ref('Jan')

const downloadData = async () => {
  try {
    isLoading.value = true
    // Reset sidebar state to prevent conflicts
    sidebarOpen.value = false
    
    // Clear existing data first
    rawData2.value = null
    data.value = null
    fullData.value = null
    hasData.value = false
    
    // Clear tab list and rebuild
    tabList.value = []
    if (listProvince) {
      tabList.value.push(listProvince.nama)
    }
    
    if (listKota && listKota.list) {
      listKota.list.forEach(x => {
        tabList.value.push(x.nama)
      })
    }
    
    const res = await dashboardApi.call(yearSlider.value.minValue, yearSlider.value.maxValue, route.query.id_provinsi)
    rawData2.value = res
    data.value = rawData2.value["provinsi"]["lapangan_usaha"]
    fullData.value = rawData2.value["provinsi"]["lapangan_usaha"]
    hasData.value = true
  } catch (e) {
    if (e instanceof ErrorApiResponse) {
      console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
      modal.value = {
        show: true,
        title: 'Error',
        message: `Failed to fetch data: ${e.message}`
      }
    } else {
      console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
      modal.value = {
        show: true,
        title: 'Error',
        message: 'Failed to fetch data. Please try again.'
      }
    }
  } finally {
    isLoading.value = false
  }
}

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
  background: #5a5a5a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3f3f3f;
}
</style>