<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition duration-300 w-full">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">
      <p class="font-bold text-md ml-2 text-[#034EA2]">{{ title }}</p>
    </div>
    <div class="">
      <Line :options="chartOptions" class="px-4" :data="chartData" :plugins="[DataLabels]" />
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
  PointElement
);
const showTooltip = ref(false)

const props = defineProps(['title', 'chartData', 'thousands', 'millions', "options"])

const chartOptions = {
  backgroundColor: 'transparent',
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: props.options.aspectRatio ? props.options.aspectRatio : 2.4,
  plugins: [DataLabels],
  plugins: {
    legend: {
      display: props.options.legends ? true : false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 1,
      }
    },
    title: {
      display: true,
      font: {
        size: 16,
      },
      color: "black",
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
      color: 'black',
      font: {
        family: "'helvetica', 'arial', 'sans-serif'",
        weight: 'normal',
        size: 11,
        lineHeight: 1
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
        callback: function (value) {
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