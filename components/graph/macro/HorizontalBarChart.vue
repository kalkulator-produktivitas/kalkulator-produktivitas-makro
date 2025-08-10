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
import DataLabels from 'chartjs-plugin-datalabels'
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
  chartData: any;
  paramKey: keyof ParameterProduktivitasMakro;
  options: any;
}>();

// Sort lapangan_usaha berdasarkan rata-rata nilai per tahun.
const sortedLapanganUsaha = computed(() => {
  // Check if chartData exists and has the required properties
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets) {
    return [];
  }
  
  // Calculate average for each lapangan usaha across all years
  const averages = props.chartData.labels.map((label: string, index: number) => {
    const values = props.chartData.datasets.map((dataset: any) => dataset.data[index]);
    const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
    
    return {
      kode: label,
      nama: label,
      data: values,
      avg: avg
    };
  });
  
  // Sort by average in descending order (highest first)
  averages.sort((a, b) => b.avg - a.avg);
  return averages;
})

const chartDataSorted = computed(() => {
  // Check if chartData exists and has the required properties
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  return {
    labels: sortedLapanganUsaha.value.map(v => v.nama),
    datasets: props.chartData.datasets.map((dataset: any, datasetIndex: number) => {
      return {
        axis: 'y',
        label: dataset.label,
        data: sortedLapanganUsaha.value.map(v => v.data[datasetIndex]),
        fill: false,
        backgroundColor: dataset.backgroundColor,
        borderWidth: 1,
        borderRadius: dataset.borderRadius
      }
    })
  }
})

// Function to wrap text to specified width (StackOverflow solution)
const formatLabel = (str: string, maxwidth: number): string[] => {
  var sections: string[] = [];
  var words = str.split(" ");
  var temp = "";

  words.forEach(function(item, index){
    if(temp.length > 0)
    {
      var concat = temp + ' ' + item;

      if(concat.length > maxwidth){
        sections.push(temp);
        temp = "";
      }
      else{
        if(index == (words.length-1)) {
          sections.push(concat);
          return;
        }
        else {
          temp = concat;
          return;
        }
      }
    }

    if(index == (words.length-1)) {
      sections.push(item);
      return;
    }

    if(item.length < maxwidth) {
      temp = item;
    }
    else {
      sections.push(item);
    }

  });

  return sections;
};

const chartOptions = {
  indexAxis: 'y' as any,
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 0.15,
  plugins: {
    datalabels: {
      display: props.options?.datalabels !== false,
      anchor: 'end',
      align: 'right',
      formatter: function (value) {
        if (props.options?.unit === 'juta') {
          return `${(value / 1000000).toFixed(2)}`;
        } else if (props.options?.unit === 'milyar') {
          return `${(value / 1000000000).toFixed(2)}`;
        } else if (props.options?.unit === 'ribu') {
          return `${(value / 1000).toFixed(2)}`;
        } else if (props.options?.unit === 'per ribu') {
          return `${(value * 1000).toFixed(2)}`;
        }  else if (props.options?.unit === 'per juta') {
          return `${(value * 1000000).toFixed(2)}`;
        } else {
          return `${value.toFixed(2)} ${props.options?.unit || ''}`;
        }
      },
      color: 'black',
      font: {
        weight: 'normal',
        size: 10
      }
    },
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
      display: false,
      ticks: {
        color: "#666666",
      },
    },
    y: {
      ticks: {
        callback: function (value: any, index: number) {
          const label = this.getLabelForValue(value);
          return formatLabel(label, 20).join('\n');
        },
        color: "#666666",
        maxRotation: 0,
        minRotation: 0,
        padding: 2,
        font: {
          size: 10,
        },
      },
      grid: {
        color: "#EDEDED",
      },
      // Increase left margin to accommodate longer labels
      afterFit: function(axis: any) {
        axis.width = Math.max(axis.width, 180);
      }
    },
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
      <div :style="{maxHeight: 100, height: 100 }" class="px-2">
                 <Bar :options="chartOptions" :data="chartDataSorted" :plugins="[DataLabels]" />
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