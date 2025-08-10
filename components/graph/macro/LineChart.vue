<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition duration-300 w-full">
    <div class="flex justify-between px-3 pt-4 bg-gradient-to-r rounded-t-xl">
      <p class="font-bold text-md ml-2 text-[#034EA2]">{{ title }}</p>
    </div>
    <div class="relative">
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
import { ref, computed } from 'vue';
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

// Determine chart height based on options or default
const chartHeight = computed(() => {
  if (props.options?.height) {
    return props.options.height;
  }
  // Default height for regular charts, taller for full-width charts
  return props.options?.fullWidth ? '400px' : '300px';
});

const chartOptions = {
  backgroundColor: 'transparent',
  responsive: true,
  aspectRatio: props.options.aspectRatio ? props.options.aspectRatio : 1.8,
  plugins: [DataLabels],
  plugins: {
    legend: {
      display: props.options?.legends !== false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 8,
        font: {
          size: 11,
        },
      },
    },
    title: {
      display: true,
      font: {
        size: 16,
      },
      color: "black",
    },
    // datalabels: {
    //   display: props.options.datalabels ? true : false,
    //   anchor: 'end',
    //   align: 'top',
    //   formatter: function (value) {
    //     if (props.millions) {
    //       return `${(value / 1000000).toFixed(1)}`;
    //     } else if (props.thousands) {
    //       return `${(value / 1000).toFixed(1)}`;
    //     } else {
    //       return `${value.toFixed(1)}`;
    //     }
    //   },
    //   color: 'black',
    //   font: {
    //     family: "'helvetica', 'arial', 'sans-serif'",
    //     weight: 'normal',
    //     size: 11,
    //     lineHeight: 1
    //   }
    // }
  },
  scales: {
    x: {
      grid: {
        display: false, // Hides vertical grid lines
      },
      ticks: {
        color: "#666666",
        font: {
          size: 11,
        },
        maxRotation: 45,
        minRotation: 0,
        padding: 8,
      },
    },
    y: {
      display: true,
      grid: {
        display: true,
        color: 'rgba(0,0,0,0.1)',
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
        font: {
          size: 11,
        },
        padding: 8,
      },
      beginAtZero: true,
    },
  },
  layout: {
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    },
  },
}

</script>

<style scoped></style>