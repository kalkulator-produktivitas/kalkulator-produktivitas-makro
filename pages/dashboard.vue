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

        <div v-if="hasData" class="lg:grid lg:grid-cols-10">
          <!-- <div class="col-span-8">{{ data }}</div> -->
          <div class="lg:col-span-8">
            <div class="flex flex-col lg:flex-row mt-2 lg:w-full w-full gap-x-2">
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_1_new" title="Produktivitas Tenaga Kerja (Juta)" :key="state"
                  :millions="false" :options="{ legends: false, datalabels: true }" />
              </div>
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_2_new" title="Pertumbuhan Produktivitas Tenaga Kerja (%)"
                  :key="state" :millions="false" :options="{ legends: false, datalabels: true }" />
              </div>
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_3_new" title="Produktivitas Upah" :key="state" :millions="false"
                  :options="{ legends: false, datalabels: true }" />
              </div>
            </div>
            <div class="lg:grid lg:grid-cols-2 lg:w-full w-1/2 mt-2 gap-2">
              <!-- <GraphMacroBarChart2 :chart-data="data_4" title="Produktivitas Tenaga Kerja" :key="state"
                :years="rawData2.metadata.tahun" :ribuan="false" />
              <GraphMacroBarChart2 :chart-data="data_5" title="Produktivitas Jam Kerja" :ribuan="false" :key="state"
                :years="rawData2.metadata.tahun" />
              <GraphMacroBarChart2 :chart-data="data_6" title="Produktivitas Upah" :key="state" :ribuan="false"
                :years="rawData2.metadata.tahun" />
              <GraphMacroBarChart2 :chart-data="data_7" title="Pertumbuhan Produktivitas Tenaga Kerja" :ribuan="false"
                :key="state" :years="rawData2.metadata.tahun" /> -->
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Tenaga Kerja"
                paramKey="produktivitas_tenaga_kerja"
                :data="dashboardApi.data.value"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Jam Kerja"
                paramKey="produktivitas_jam_kerja"
                :data="dashboardApi.data.value"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Produktivitas Upah"
                paramKey="produktivitas_upah"
                :data="dashboardApi.data.value"
              />
              <GraphMacroHorizontalBarChart 
                v-if="dashboardApi.data"
                title="Pertumbuhan Produktivitas Tenaga Kerja"
                paramKey="growth_produktivitas_tenaga_kerja"
                :data="dashboardApi.data.value"
              />
            </div>

          </div>
          <div class="lg:col-span-2 px-4 pt-2 flex w-full">
            <div class="border border-slate-200 lg:w-full h-[100%] rounded-lg px-2 relative">
              <div class="lg:absolute lg:inset-0 lg:overflow-y-auto px-2">
                <div class="sticky top-0 bg-white z-10 flex justify-between border-b border-slate-400">
                  <div>
                    <div class="flex justify-between">
                      <p class="mt-2 text-[#034EA2] font-bold">Filters</p>
                    </div>
                    <p class="text-sm mt-2 pb-2">Lapangan Usaha</p>
                  </div>
                  <div class="flex flex-col pb-2">
                    <div class="flex flex-col gap-1 my-auto">
                      <button @click="addAll"
                        class="px-1 py-1 text-xs border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                        Pilih Semua
                      </button>
                      <button @click="removeAll"
                        class="px-1 py-1 text-xs border border-gray-500 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300">
                        Hapus Semua
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div v-for="usaha of lapanganUsaha" :key="usaha.nama" class="flex items-start mb-0.5"
                    @change="applyFilter">
                    <input :id="usaha.kode" type="checkbox" v-model="usaha.status"
                      class="mt-1 w-[10px] h-4 text-[#034EA2] bg-gray-100 border-gray-300 rounded dark:border-gray-600 ">
                    <label :for="usaha.kode" class="ms-2 text-sm "
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

const closeModal = () => {
  modal.value.show = false
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
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }

  let calcData
  if (subTab.value === "DKI Jakarta") {
    calcData = rawData2.value["provinsi"]["agregat"]["produktivitas_tenaga_kerja"]
  } else {
    const kotaData = rawData2.value["kota"].find(k => k.nama === subTab.value)
    calcData = kotaData ? kotaData.agregat.produktivitas_tenaga_kerja : []
  }
  dataset.datasets[0].data = calcData.filter(x => x !== null)
  dataset.labels = rawData2.value.metadata.tahun.slice(0, calcData.length)

  return dataset
})

const data_2_new = computed(() => {
  let dataset = {
    labels: [],
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData
  if (subTab.value === "DKI Jakarta") {
    calcData = rawData2.value["provinsi"]["agregat"]["growth_produktivitas_tenaga_kerja"]
  } else {
    const kotaData = rawData2.value["kota"].find(k => k.nama === subTab.value)
    calcData = kotaData ? kotaData.agregat.growth_produktivitas_tenaga_kerja : []
  }
  dataset.datasets[0].data = calcData.filter(x => x !== null)
  dataset.labels = rawData2.value.metadata.tahun.slice(1, calcData.length)

  return dataset
})

const data_3_new = computed(() => {
  let dataset = {
    labels: [],
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData
  if (subTab.value === "DKI Jakarta") {
    calcData = rawData2.value["provinsi"]["agregat"]["produktivitas_upah"]
  } else {
    const kotaData = rawData2.value["kota"].find(k => k.nama === subTab.value)
    calcData = kotaData ? kotaData.agregat.produktivitas_upah : []
  }
  dataset.datasets[0].data = calcData.filter(x => x !== null)
  dataset.labels = rawData2.value.metadata.tahun.slice(0, calcData.length)
  return dataset
})

const data_4 = computed(() => {
  let dataNew = data.value
  // console.log(dataNew["A"])
  const dataset = {
    labels: [],
    datasets: [

    ],
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
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_tenaga_kerja'][i])))
    }

  }
  return dataset
})

const data_5 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [],
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
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_jam_kerja'][i])))
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
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_upah'][i])))
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
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['growth_produktivitas_tenaga_kerja'][i])))
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
    listKota.list.forEach(x => {
      tabList.value.push(x.nama)
    })
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