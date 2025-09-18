<template>
  <div
    class="flex flex-col relative bg-white rounded-xl border border-slate-200 hover:shadow-xl transition duration-300 w-full">
    <div class="flex justify-between items-center px-3 pt-4 bg-gradient-to-r rounded-t-xl">
      <p class="font-bold text-md ml-2 text-[#034EA2]">{{ title }}</p>

      <!-- Y-Scale Controls -->

    </div>
    <div class="flex items-center gap-2 pl-5 pt-1">
      <span class="text-xs text-gray-600">Skala:</span>
      <div class="flex items-center gap-1">
        <input v-model="yAxisMin" type="number" placeholder="Min"
          class="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          @input="updateYScale" />
        <span class="text-xs text-gray-400">-</span>
        <input v-model="yAxisMax" type="number" placeholder="Max"
          class="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          @input="updateYScale" />
        <button @click="resetYScale"
          class="ml-1 px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          title="Reset to auto scale">
          Default
        </button>
      </div>
    </div>
    <div class="relative">
      <Line :options="dynamicChartOptions" class="px-4" :data="chartData" />
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

const props = defineProps(['title', 'chartData', 'unit', "options"])

// Y-axis scale controls
const yAxisMin = ref(null)
const yAxisMax = ref(null)
const isAutoScale = ref(true)

// Determine chart height based on options or default
const chartHeight = computed(() => {
  if (props.options?.height) {
    return props.options.height;
  }
  // Default height for regular charts, taller for full-width charts
  return props.options?.fullWidth ? '400px' : '300px';
});

const units = computed(() => {
  if (props.unit === 'juta') {
    return 'Juta';
  } else if (props.unit === 'ribu') {
    return 'Ribu';
  } else if (props.unit === 'bilion') {
    return 'Bilion';
  } else if (props.unit === 'trillion') {
    return 'Trillion';
  } else if (props.unit === 'quadrillion') {
    return 'Quadrillion';
  } else if (props.unit === 'quintillion') {
    return 'Quintillion';
  } else {
    return '';
  }
})

// Dynamic chart options that respond to y-scale controls
const dynamicChartOptions = computed(() => {
  const baseOptions = {
    backgroundColor: 'transparent',
    responsive: true,
    aspectRatio: props.options?.aspectRatio ? props.options.aspectRatio : 1.8,
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
        title: {
          display: false,
          text: `${units.value}`,
          color: '#666666',
          font: {
            size: 11,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          callback: function (value) {
            let formattedValue;
            if (props.unit === 'juta') {
              formattedValue = (value / 1000000).toFixed(0);
            } else if (props.unit === 'ribu') {
              formattedValue = (value / 1000).toFixed(0);
            } else if (props.unit === 'bilion') {
              formattedValue = (value / 1000000000).toFixed(0);
            } else if (props.unit === 'trillion') {
              formattedValue = (value / 1000000000000).toFixed(0);
            } else if (props.unit === 'per juta') {
              formattedValue = (value * 1000000).toFixed(0);
            } else if (props.unit === 'per ribu') {
              formattedValue = (value * 1000).toFixed(0);
            } else if (props.unit === 'per bilion') {
              formattedValue = (value * 1000000000).toFixed(0);
            } else if (props.unit === 'per trillion') {
              formattedValue = (value * 1000000000000).toFixed(0);
            } else {
              formattedValue = value.toFixed(0);
            }
            // Add thousand separators with periods
            return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          },
          color: "#666666",
          font: {
            size: 11,
          },
          padding: 8,
        },
        beginAtZero: isAutoScale.value,
        // Dynamic min/max based on user input
        min: isAutoScale.value ? undefined : (yAxisMin.value !== null ? Number(yAxisMin.value) : undefined),
        max: isAutoScale.value ? undefined : (yAxisMax.value !== null ? Number(yAxisMax.value) : undefined),
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

  return baseOptions
})

// Functions for y-scale control
const updateYScale = () => {
  if (yAxisMin.value !== null || yAxisMax.value !== null) {
    isAutoScale.value = false
  }
}

const resetYScale = () => {
  yAxisMin.value = null
  yAxisMax.value = null
  isAutoScale.value = true
}

</script>

<style scoped></style>