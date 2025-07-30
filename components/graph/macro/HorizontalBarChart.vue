<script setup lang="ts">
import type { MakroDataAPIResponse, ParameterProduktivitasMakro } from '~/types/api';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import { BrightColors } from '~/assets/helpers/colors'

const props = defineProps<{
  title: string;
  data: MakroDataAPIResponse;
  paramKey: keyof ParameterProduktivitasMakro;
}>();

// Sort lapangan_usaha berdasarkan rata-rata nilai per tahun.
const sortedLapanganUsaha = computed(() => {
  const list = props.data.metadata.lapangan_usaha.list
    .map(w => ({
      kode: w.kode,
      nama: w.nama,
      data: props.data.provinsi.lapangan_usaha[w.kode][props.paramKey],
      avg: (props.data.provinsi.lapangan_usaha[w.kode][props.paramKey]
        .reduce(
          (prev, curr) => { return (prev === null ? 0 : prev) + (curr === null ? 0 : curr) },
          0,
        ) || 0) / props.data.provinsi.lapangan_usaha[w.kode][props.paramKey].length
      ,
    }));
  list.sort((a, b) => a.avg > b.avg ? -1 : 1);
  return list;
})

const chartData = {
  labels: sortedLapanganUsaha.value.map(v => v.kode),
  datasets: props.data.metadata.tahun
    .map((y, i) => {
      return {
        axis: 'y',
        label: `${y}`,
        data: sortedLapanganUsaha.value.map(v => v.data[i]),
        fill: false,
        backgroundColor: [BrightColors[i]],
        // borderColor: [
        //   'rgb(255, 99, 132)',
        //   'rgb(255, 159, 64)',
        //   'rgb(255, 205, 86)',
        //   'rgb(75, 192, 192)',
        //   'rgb(54, 162, 235)',
        //   'rgb(153, 102, 255)',
        //   'rgb(201, 203, 207)'
        // ],
        borderWidth: 1
      }
    })
}

const chartOptions = {
  indexAxis: 'y' as any,
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 0.3,
  plugins: {
    legend: {
      display: false,
      position: "top" as any,
      labels: {
        font: {
          size: 12,
        },
        boxWidth: 10,
        boxHeight: 10,
        useBorderRadius: true,
        borderRadius: 5
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      ticks: {
        color: "#666666",
      },
    },
    y: {
      ticks: {
        // callback: function (value: any) {
        //   return props.ribuan ? `${value / 1000000000} milyar` : value;
        // },
        color: "#666666",
      },
      grid: {
        color: "#EDEDED",
      },
    },
  },
  datalabels: {
    display: false,
  }
}

</script>

<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-300 h-96">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">
      
      <p class="font-bold text-md ml-2 text-[#034EA2] text-balance">{{ title }}</p>
      <div class="justify-end flex text-xs gap-1">
        <div v-for="year in data.metadata.tahun" :key="year" class="flex gap-1">
          <div :style="{ backgroundColor: BrightColors[data.metadata.tahun.indexOf(year)] }" class="w-2 h-2 rounded-full my-auto"></div>
          <p class="my-auto">{{ year }}</p>
        </div>       
      </div>
    </div>
    <!-- Outer container to enable horizontal scrolling -->
    <div class="w-full overflow-y-auto overflow-x-auto custom-scrollbar">
      <!-- Inner container with a larger width to enable scrolling -->
      <div :style="{ width: `${Math.max(200, chartData.labels.length * 30)}px`, maxHeight: 100, height: 100 }">
        <Bar :options="chartOptions" :data="chartData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling the scrollbar for WebKit-based browsers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  transition: ease-in-out 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
  transition: ease-in-out 0.3s;
}

/* Firefox scrollbar styling */
.custom-scrollbar {
  scrollbar-color: #d1d5db #f5f5f5;
  /* thumb color | track color */
  scrollbar-width: thin
    /* Thin scrollbar */
}
</style>