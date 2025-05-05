<template>
  <div class="">
    <div id="layout" class="md:mx-auto mx-auto flex w-full">
      <div class="flex shrink-0 w-[3%]">

      </div>
      <div class="lg:relative mt-8">
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
          <div class="flex gap-4 absolute top-3 right-5">
            <ul class="flex flex-row pl-0 mx-auto bg-blue-200 rounded-full">
              <li class="font-bold text-sm" :key="'a'">
                <button class="w-[160px] h-full rounded-full" @click="reportType = 'Provinsi'"
                  :class="reportType === 'Provinsi' ? 'text-white active bg-[#034EA2]' : 'hover:text-gray-600 hover:border-gray-300 bg-blue-200'">Provinsi</button>
              </li>
              <li class="font-bold text-sm" :key="'b'">
                <button class="w-[160px] h-full rounded-full" @click="reportType = 'Kabupaten'"
                  :class="reportType === 'Kabupaten' ? 'text-white active bg-[#034EA2]' : 'hover:text-gray-600 hover:border-gray-300 bg-blue-200'">Kabupaten/Kota</button>
              </li>
            </ul>
            <button @click="createReport" :disabled="!buttonActive"
              class="bg-[#034EA2] text-white px-3 py-1 rounded-lg self-center hover:bg-[#023b7d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Buat Laporan
            </button>
          </div>


        </div>

        <div class="lg:grid lg:grid-cols-10">
          <!-- <div class="col-span-8">{{ data }}</div> -->
          <div class="lg:col-span-8">
            <div class="flex flex-col lg:flex-row mt-2 lg:w-full w-full gap-x-2">
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_1_new" title="Produktivitas Tenaga Kerja (Juta)" :key="state"
                  :millions="false" :options="{ legends: false, datalabels: true }" />
              </div>
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_2_new" title="Pertumbuhan Produktivitas Tenaga Kerja" :key="state"
                  :millions="false" :options="{ legends: false, datalabels: true }" />
              </div>
              <div class="w-full lg:w-1/3">
                <GraphMacroLineChart :chart-data="data_3_new" title="Produktivitas Upah" :key="state" :millions="false"
                  :options="{ legends: false, datalabels: true }" />
              </div>
            </div>
            <div class="lg:grid lg:grid-cols-2 lg:w-full w-1/2 mt-2 gap-2">
              <GraphMacroBarChart2 :chart-data="data_4" title="Produktivitas Tenaga Kerja" :key="state"
                :ribuan="false" />
              <GraphMacroBarChart2 :chart-data="data_5" title="Produktivitas Jam Kerja" :ribuan="false" :key="state" />
              <GraphMacroBarChart2 :chart-data="data_6" title="Produktivitas Upah" :key="state" :ribuan="false" />
              <GraphMacroBarChart2 :chart-data="data_7" title="Pertumbuhan Produktivitas Tenaga Kerja" :ribuan="false"
                :key="state" />
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
      </div>
    </div>
    <!-- {{ rawData2 }} -->
    <ReportProvinsiGen v-if="reportType === 'Provinsi' && preview === true" class="fixed inset-0 z-50"
      @close-preview="reloadApp" />
    <ReportKotaGen v-if="reportType === 'Kabupaten' && preview === true" :kota="subTab" class="fixed inset-0 z-50"
      @close-preview="reloadApp" />
    <Popup v-if="modal.show === true" :title="modal.title" :message="modal.message" @close="closeModal" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
});

import { getDashboardApi } from '~/_service/dashboard/dashboardData';
import { getCity, getProvince } from '~/_service/navigasi/nav';
import { useRequest } from '~/composables/useRequest';
import { ErrorApiResponse } from '~/_service/http/schema';

const route = useRoute()

const dashboardApi = useRequest(getDashboardApi);
const provinceApi = useRequest(getProvince);
const cityApi = useRequest(getCity);

import macro from '~/assets/macro.json'

import rawData from '~/assets/macro_2_restructured.json'
const rawData2 = ref(null);

let reportType = ref("Provinsi")

let tabList = ref([])

let subTab = ref('')

const data = ref()
const fullData = ref()

let listProvince
let listKota

try {
  listProvince = await provinceApi.call()
  listProvince = listProvince.list.filter(x => x.id === route.query.id_provinsi)[0]
  tabList.value.push(listProvince.nama)
  subTab.value = listProvince.nama
  listKota = await cityApi.call(listProvince.id)
  listKota.list.forEach(x => {
    tabList.value.push(x.nama)
  })


  const res = await dashboardApi.call(route.query.tahun_start, route.query.tahun_end, route.query.id_provinsi)
  rawData2.value = res
  data.value = rawData2.value["provinsi"]["lapangan_usaha"]
  fullData.value = rawData2.value["provinsi"]["lapangan_usaha"]
} catch (error) {
  console.log(error)
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
  reloadNuxtApp({
    path: "/dashboard",
    ttl: 100,
  });
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
  subTab.value = x
  if (subTab.value === 'DKI Jakarta') {
    data.value = rawData2.value["provinsi"]["lapangan_usaha"]
  } else {
    let kotaData = rawData2.value["kota"].filter(x => x.nama === subTab.value)[0]
    data.value = kotaData.lapangan_usaha
  }
}

const buttonActive = computed(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 3000)
  })
})


const data_1_new = computed(() => {
  let dataset = {
    labels: ["2018", "2019", "2020", "2021", "2022"],
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
  dataset.labels = rawData2.value.metadata.tahun.slice(1, calcData.length)

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
    labels: ["2018", "2019", "2020", "2021", "2022"],
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
  dataset.labels = rawData2.value.metadata.tahun.slice(1, calcData.length)
  return dataset
})

const data_4 = computed(() => {
  let dataNew = data.value

  const dataset = {
    labels: [],
    datasets: [
      {
        label: "2018",
        data: [],
        backgroundColor: "#5A8DEE",
        borderRadius: 100,
      },
      {
        label: "2019",
        data: [],
        backgroundColor: "#FF5E57",
        borderRadius: 100,
      },
      {
        label: "2020",
        data: [],
        backgroundColor: "#5DD39E",
        borderRadius: 100,
      },
      {
        label: "2021",
        data: [],
        backgroundColor: "#FFC048",
        borderRadius: 100,
      },
      {
        label: "2022",
        data: [],
        backgroundColor: "#18A0FB",
        borderRadius: 100,
      },
    ],
  }

  for (let x in dataNew) {

    dataset.labels.push(`Kode ${x}`)
    for (let i = 0; i < 5; i++) {
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_tenaga_kerja'][i])))
    }
  }
  return dataset
})

const data_5 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [
      {
        label: "2018",
        data: [],
        backgroundColor: "#5A8DEE",
        borderRadius: 100,
      },
      {
        label: "2019",
        data: [],
        backgroundColor: "#FF5E57",
        borderRadius: 100,
      },
      {
        label: "2020",
        data: [],
        backgroundColor: "#5DD39E",
        borderRadius: 100,
      },
      {
        label: "2021",
        data: [],
        backgroundColor: "#FFC048",
        borderRadius: 100,
      },
      {
        label: "2022",
        data: [],
        backgroundColor: "#18A0FB",
        borderRadius: 100,
      },
    ],
  }

  for (let x in dataNew) {
    dataset.labels.push(`Kode ${x}`)
    for (let i = 0; i < 5; i++) {
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_jam_kerja'][i])))
    }
  }
  return dataset
})

const data_6 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [
      {
        label: "2018",
        data: [],
        backgroundColor: "#5A8DEE",
        borderRadius: 100,
      },
      {
        label: "2019",
        data: [],
        backgroundColor: "#FF5E57",
        borderRadius: 100,
      },
      {
        label: "2020",
        data: [],
        backgroundColor: "#5DD39E",
        borderRadius: 100,
      },
      {
        label: "2021",
        data: [],
        backgroundColor: "#FFC048",
        borderRadius: 100,
      },
      {
        label: "2022",
        data: [],
        backgroundColor: "#18A0FB",
        borderRadius: 100,
      },
    ],
  }

  for (let x in dataNew) {
    dataset.labels.push(`Kode ${x}`)
    for (let i = 0; i < 5; i++) {
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['produktivitas_upah'][i])))
    }
  }
  return dataset
})

const data_7 = computed(() => {
  let dataNew = data.value
  const dataset = {
    labels: [],
    datasets: [
      {
        label: "2018",
        data: [],
        backgroundColor: "#5A8DEE",
        borderRadius: 100,
      },
      {
        label: "2019",
        data: [],
        backgroundColor: "#FF5E57",
        borderRadius: 100,
      },
      {
        label: "2020",
        data: [],
        backgroundColor: "#5DD39E",
        borderRadius: 100,
      },
      {
        label: "2021",
        data: [],
        backgroundColor: "#FFC048",
        borderRadius: 100,
      },
      {
        label: "2022",
        data: [],
        backgroundColor: "#18A0FB",
        borderRadius: 100,
      },
    ],
  }

  for (let x in dataNew) {    
    dataset.labels.push(`Kode ${x}`)
    for (let i = 0; i < 5; i++) {
      dataset.datasets[i].data.push(parseFloat((dataNew[x]['growth_produktivitas_tenaga_kerja'][i])))
    }
  }
  return dataset
})

const reportData = ref([])

const createReport = () => {
  // console.log("clicked");
  // console.log(subTab.value)
  // console.log(reportType.value)
  if (subTab.value === 'Provinsi DKI Jakarta' && reportType.value === 'Kabupaten') {
    modal.value.show = true
    modal.value.title = 'Silahkan Pilih Kota'
    modal.value.message = 'Mohon ubah pilihan tab selain provinsi'
  } else {
    preview.value = true
  }
}


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const selectedMonth = ref('Jan')






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