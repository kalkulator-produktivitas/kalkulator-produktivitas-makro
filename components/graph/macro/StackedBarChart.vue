<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-300">
    <div class="flex justify-between px-3 pt-2 bg-gradient-to-r rounded-t-xl">

      <p class="font-bold text-md ml-2 text-[#034EA2] text-balance">{{ title }}</p>
    </div>
    <!-- Main content area with chart and legend -->
    <div class="flex w-full">
      <!-- Custom legend sidebar -->
      <div class="w-48 border-r border-gray-200">
        <div class="p-3">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Lapangan Usaha</h4>
          <div class="max-h-80 overflow-y-auto custom-scrollbar">
            <div v-for="(dataset, index) in props.chartData.datasets" :key="index"
              class="flex mb-2 px-2 rounded hover:bg-gray-100 transition-colors">
              <div class="w-3 h-3 rounded-full mr-2 mt-0.5 flex-shrink-0"
                :style="{ backgroundColor: dataset.backgroundColor }"></div>
              <span class="text-xs text-gray-700 leading-tight">{{ dataset.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart container -->
      <div class="flex-1 h-96">
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

const props = defineProps(['title', 'chartData', 'ribuan', 'options'])

// Formatter function for different units
const formatter = (value) => {
  if (props.options?.unit === 'juta') {
    return `${(value / 1000000).toFixed(2)}`;
  } else if (props.options?.unit === 'milyar') {
    return `${(value / 1000000000).toFixed(2)}`;
  } else if (props.options?.unit === 'ribu') {
    return `${(value / 1000).toFixed(2)}`;
  } else if (props.options?.unit === 'per ribu') {
    return `${(value * 1000).toFixed(2)}`;
  } else if (props.options?.unit === 'per juta') {
    return `${(value * 1000000).toFixed(2)}`;
  } else {
    return `${value.toFixed(2)} ${props.options?.unit || ''}`;
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1.2,
  layout: {
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            const value = context.parsed.y;
            if (props.options?.unit) {
              label += formatter(value);
            } else if (props.ribuan) {
              label += `${(value / 1000000000).toFixed(2)} milyar`;
            } else {
              label += new Intl.NumberFormat('id-ID').format(value);
            }
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: "#666666",
        maxRotation: 0,
        minRotation: 0,
      },
      grid: {
        color: "#EDEDED",
      },
    },
    y: {
      stacked: true,
      ticks: {
        callback: function (value) {
          if (props.options?.unit) {
            return formatter(value);
          } else if (props.ribuan) {
            return `${value / 1000000000} milyar`;
          } else {
            return new Intl.NumberFormat('id-ID').format(value);
          }
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