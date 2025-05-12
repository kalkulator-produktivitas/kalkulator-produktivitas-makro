<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-300">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">
      
      <p class="font-bold text-md ml-2 text-[#034EA2] text-balance">{{ title }}</p>
      <div class="justify-end flex text-xs gap-1">
        <div v-for="year in years" :key="year" class="flex gap-1">
          <div :style="{ backgroundColor: BrightColors[years.indexOf(year)] }" class="w-2 h-2 rounded-full my-auto"></div>
          <p class="my-auto">{{ year }}</p>
        </div>       
      </div>
    </div>
    <!-- Outer container to enable horizontal scrolling -->
    <div class="w-full overflow-x-auto custom-scrollbar">
      <!-- Inner container with a larger width to enable scrolling -->
      <div :style="{ width: `${Math.max(500, props.chartData.labels.length * 100)}px` }">
        <Bar :options="chartOptions" :data="props.chartData" />
      </div>
    </div>
  </div>
</template>

<script setup>
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
import { ref } from 'vue';
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import { BrightColors } from '~/assets/helpers/colors'

const props = defineProps(['title', 'chartData', 'ribuan', 'years'])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  plugins: {
    legend: {
      display: false,
      position: "top",
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
        callback: function (value) {
          return props.ribuan ? `${value / 1000000000} milyar` : value;
        },
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

// const yearList = computed(() => {
//   let temp = props.chartData.datasets.map(x => x.label)
//   return temp
// })


</script>

<style scoped>
/* Styling the scrollbar for WebKit-based browsers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
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