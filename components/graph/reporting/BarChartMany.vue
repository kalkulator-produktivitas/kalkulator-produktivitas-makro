<template>
  <div
    class="flex flex-col relative bg-transparent ">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">
      <p class="font-bold text-md ml-2 text-[#034EA2] text-balance">{{ title }}</p>
      <div class="justify-end flex text-xs gap-1">
        <div class="w-2 h-2 bg-[#5A8DEE] rounded-full my-auto"></div>
        <p class="my-auto">2020</p>
        <div class="w-2 h-2 bg-[#FF5E57] rounded-full my-auto"></div>
        <p class="my-auto">2021</p>
        <div class="w-2 h-2 bg-[#5DD39E] rounded-full my-auto"></div>
        <p class="my-auto">2022</p>
        <div class="w-2 h-2 bg-[#FFC048] rounded-full my-auto"></div>
        <p class="my-auto">2023</p>
        <div class="w-2 h-2 bg-[#18A0FB] rounded-full my-auto"></div>
        <p class="my-auto">2024</p>
      </div>
    </div>
    <!-- Outer container to enable horizontal scrolling -->
    <div class="w-full">
      <!-- Inner container with a larger width to enable scrolling -->
      <div class="">
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

const props = defineProps(['title', 'chartData', 'ribuan'])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2.5,
  plugins: {
    legend: {
      display: false,
      position: "top",
      labels: {
        font: {
          size: 10,
        },
        boxWidth: 7,
        boxHeight: 7,
        useBorderRadius: false,
        borderRadius: 5
      },
    },
    datalabels: {
      display: false
    }
  },
  scales: {
    x: {
      stacked: false,
      ticks: {
        color: "#666666",
      },
      grid: {
        display: false
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
        drawBorder: false,
        drawTicks: false,
        lineWidth: 0.5,
        borderDash: [2, 2]
      },
    },
  }
}


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