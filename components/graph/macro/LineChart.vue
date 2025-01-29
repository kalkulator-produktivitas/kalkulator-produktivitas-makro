<template>
  <div class="flex flex-col relative bg-transparent w-full hover:shadow-xl transition duration-300">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">
      <p class="font-bold text-md ml-2 text-[#034EA2]">{{ title }}</p>
    </div>
    <div class="">
      <Line :options="chartOptions" class="px-4" :data="chartData" />
    </div>
  </div>

</template>

<script setup>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import DataLabels from 'chartjs-plugin-datalabels'
import { ref } from 'vue';
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  DataLabels
);
const showTooltip = ref(false)

const props = defineProps(['title', 'chartData', 'thousands', 'millions', "options"])

const chartOptions = {
  backgroundColor: 'transparent',
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: props.options.aspectRatio ? props.options.aspectRatio : 2.4,
  plugins: {
    legend: {
      display: props.options.legends ? true : false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
      }
    },
    title: {
      display: true,
      font: {
        size: 16,
        weight: "bold",
      },
      color: "#003366",
    },
    datalabels: {
      display: props.options.datalabels ? true : false,
      anchor: 'end',
      align: 'top',
      formatter: function (value) {
        if (props.millions) {
          return `${(value / 1000000).toFixed(1)}`;
        } else if (props.thousands) {
          return `${(value / 1000).toFixed(1)}`;
        } else {
          return `${value.toFixed(1)}`;
        }
      },
      color: '#666666',
      font: {
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false, // Hides vertical grid lines
      },
      ticks: {
        color: "#666666",
      },
    },
    y: {
      display: props.options.yLabel ? true : false,  // This hides the y-axis completely
      grid: {
        display: false,
      },
      ticks: {
        callback: function(value) {
          if (props.millions) {
            return `${(value / 1000000).toFixed(0)}M`;
          } else if (props.thousands) {
            return `${(value / 1000).toFixed(0)}Jt`; 
          } else {
            return value.toFixed(0);
          }
        },
        color: "#666666",
      }
    },
  },
}

</script>

<style scoped></style>