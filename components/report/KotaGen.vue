<template>
  <div class="absolute w-full h-full">
    <div class="modal-overlay absolute z-10">
      <div class="mx-auto mt-2 overflow-y-auto h-[98vh]">
        <!-- <p class="text-white">{{ realData }}</p> -->
        <div class="grid grid-rows-2 gap-1 mx-auto flex-shrink-0">
          <div class="mx-auto" style="visibility:visible;">
            <div
              class="w-[210mm] absolute top-0 bg-black bg-opacity-25 hover:bg-opacity-75 hover:text-white p-2 mt-2 transition z-50">
              <div class="flex flex-row justify-end gap-6 ">
                <button type="button my-auto" class="py-1" @click="generatePDF">
                  <span class="flex items-center">
                    <Icon name="mdi:download-outline" size="24" />
                    Download
                  </span>
                </button>
                <button type="button" class="py-1 my-auto" @click="$emit('close-preview')">
                  <span class="flex items-center">
                    <Icon name="mdi:close-outline" size="24" />
                  </span>
                </button>
              </div>
            </div>
            <div class="pdf-content" id="pdfContent-1">
              <div class="content page-1">
                <p class="page-number text-center">1</p>
                <div class="p-2 flex mb-4">
                  <img src="~/assets/logo_copy.png" style="height: 6em;">
                  <div class="ml-8">
                    <p class="">Laporan Hasil Pengukuran</p>
                    <p class="">Produktivitas Makro: {{ props.kota === 'Kepulauan Seribu'? 'Kabupaten' : 'Kota' }} Administrasi {{ props.kota }}
                    </p>
                    <p class="">Tahun {{ props.rawdata.metadata.tahun[latestIndex] }} </p>
                    <p class="text-xs">GENERATED BY KALKUPRO VER 2.0 P3D JAKARTA {{ new Date().toLocaleDateString() }}
                    </p>

                  </div>
                </div>
                <div class="border border-black p-2 mb-4">
                  <p class="text-lg font-bold">Profil Wilayah</p>
                  <table class="w-full text-sm table-auto no-border">
                    <tbody>
                      <tr class="">
                        <td class="">1. Jumlah Penduduk Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">{{ realData.sensus.jumlah_penduduk[latestIndex].toLocaleString('id-ID') }}</td>
                      </tr>
                      <tr class="">
                        <td class="">2. Jumlah Angkatan Kerja Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">{{ realData.sensus.jumlah_angkatan_kerja[latestIndex].toLocaleString('id-ID') }}</td>
                      </tr>
                      <tr class="">
                        <td class="">3. Jumlah Tenaga Kerja Bekerja Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">{{ realData.agregat.jumlah_tenaga_kerja_bekerja[latestIndex].toLocaleString('id-ID') }}</td>
                      </tr>
                      <tr class="">
                        <td class="">4. Produk Domestik Regional Bruto (ADHK) Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">Rp {{ realData.agregat.pdrb_adhk[latestIndex].toLocaleString('id-ID') }}
                        </td>
                      </tr>
                      <tr class="">
                        <td class="">5. Upah Rata-Rata Tenaga Kerja Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">Rp {{ realData.agregat.jumlah_rata_rata_upah[latestIndex].toLocaleString('id-ID') }}</td>
                      </tr>
                      <tr class="">
                        <td class="">6. Jumlah Lapangan Usaha Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">{{ realData.jumlah_lapangan_usaha }}</td>
                      </tr>
                      <tr class="">
                        <td class="">7. Jumlah Jam Kerja Kab./Kota</td>
                        <td class="px-2 ">:</td>
                        <td class="">{{ realData.agregat.jumlah_rata_rata_jam_kerja[latestIndex].toLocaleString('id-ID') }} jam</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="border border-black p-2 mb-4">
                  <p class="text-lg font-bold">Hasil Pengukuran Produktivitas Makro</p>
                  <ol class="list-none ml-2 text-sm">
                    <li>
                      <p>1. Produktivitas Tenaga Kerja (juta/orang/tahun) :</p>
                      <div class="w-[120mm]">
                        <GraphReportingLineChart :chart-data="data_1" title="" :key="state" :millions="true"
                          :options="{ legends: false, datalabels: true }" />
                      </div>
                    </li>
                    <li>
                      <p>2. Pertumbuhan Produktivitas Tenaga Kerja yoy (%) :</p>
                      <div class="w-[120mm]">
                        <GraphReportingLineChart :chart-data="data_2" title="" :key="state" :millions="false"
                          :options="{ legends: false, datalabels: true }" />
                      </div>
                    </li>
                  </ol>
                </div>

              </div>

            </div>
            <div class="pdf-content" id="pdfContent-2">
              <div class="content page-2">
                <p class="page-number text-center">2</p>
                <div class="border border-black p-2 mb-4">
                  <ol class="list-none ml-2 text-sm" start="3">
                    <li>
                      <p>3. Produktivitas Upah :</p>
                      <div class="w-[120mm]">
                        <GraphReportingLineChart :chart-data="data_3" title="" :key="state" 
                          :options="{ legends: false, datalabels: true }" />
                      </div>
                    </li>
                    <li>
                      <p>4. Produktivitas Jam Kerja (juta/orang/jam) :</p>
                      <div class="w-[120mm]">
                        <GraphReportingLineChart :chart-data="data_4" title="" :millions="true" :key="state"
                          :options="{ legends: false, datalabels: true }" />
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div class="pdf-content" id="pdfContent-3">
              <div class="content page-3">
                <p class="page-number text-center">3</p>
                <div class="border border-black p-2 mb-2">
                  <p class="text-lg font-bold">Hasil Pengukuran Produktivitas Per Lapangan Usaha (Ringkasan):</p>
                  <ol class="list-none ml-2 text-sm mt-4">
                    <li class="">

                      <table class="w-full">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">1. Sektor Dengan Kontribusi Terbesar Pada PDRB :
                            </td>
                          </tr>
                          <tr>
                            <td class="px-2">{{ data_6["Sektor PDRB terbesar"][0] }}</td>
                            <td class="px-2 w-[60%]">{{ data_6["Sektor PDRB terbesar"][1] }}</td>
                            <td class="px-2 w-[35%]">{{ data_6["Sektor PDRB terbesar"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li class="">

                      <table class="w-full">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">2. Sektor Dengan Kontribusi Terbesar Pada
                              Penyerapan Tenaga Kerja :</td>
                          </tr>
                          <tr>
                            <td class="px-2">{{ data_6["Sektor Penyerapan TK terbesar"][0] }}</td>
                            <td class="px-2 w-[60%]">{{ data_6["Sektor Penyerapan TK terbesar"][1] }}</td>
                            <td class="px-2 w-[35%]">{{ data_6["Sektor Penyerapan TK terbesar"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li class="">

                      <table class="w-full">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">3. Sektor Dengan Produktivitas Tertinggi
                              (orang/tahun):</td>
                          </tr>
                          <tr>
                            <td class="px-2">{{ data_6["Sektor Produktivitas terbesar"][0] }}</td>
                            <td class="px-2 w-[60%]">{{ data_6["Sektor Produktivitas terbesar"][1] }}</td>
                            <td class="px-2 w-[35%]">{{ data_6["Sektor Produktivitas terbesar"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li class="">

                      <table class="w-full">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">4. Sektor Dengan Produktivitas Terendah
                              (orang/tahun):</td>
                          </tr>
                          <tr>
                            <td class="px-2">{{ data_6["Sektor Produktivitas terendah"][0] }}</td>
                            <td class="px-2 w-[60%]">{{ data_6["Sektor Produktivitas terendah"][1] }}</td>
                            <td class="px-2 w-[35%]">{{ data_6["Sektor Produktivitas terendah"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li class="">

                      <table class="w-full">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">5. Sektor Dengan Peningkatan Produktivitas
                              Tertinggi (%):</td>
                          </tr>
                          <tr>
                            <td class="px-2">{{ data_6["Sektor Peningkatan Produktivitas terbesar"][0] }}</td>
                            <td class="px-2 w-[60%]">{{ data_6["Sektor Peningkatan Produktivitas terbesar"][1] }}</td>
                            <td class="px-2 w-[35%]">{{ data_6["Sektor Peningkatan Produktivitas terbesar"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li class="">

                      <table class="w-full items-center">
                        <tbody>
                          <tr>
                            <td :colspan="3" class="pl-2 bg-slate-200">6. Sektor Dengan Peningkatan Produktivitas
                              Terendah (%)
                              :</td>
                          </tr>
                          <tr>
                            <td class="px-2 align-middle">{{ data_6["Sektor Peningkatan Produktivitas terendah"][0] }}
                            </td>
                            <td class="px-2 w-[60%] align-middle">
                              {{ data_6["Sektor Peningkatan Produktivitas terendah"][1] }}</td>
                            <td class="px-2 w-[35%] align-middle">
                              {{ data_6["Sektor Peningkatan Produktivitas terendah"][2] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                  </ol>

                  <p class="text-lg font-bold mt-2">Hasil Pengukuran Produktivitas Sektoral Per Lapangan Usaha (Dalam
                    Diagram)</p>
                  <p class="text-center text-sm">Tabel 1. Pengukuran Produktivitas Makro {{ props.kota === 'Kepulauan Seribu'? 'Kabupaten' : 'Kota' }} Administrasi {{ realData.nama }}</p>
                  <table class="w-full text-xs font-normal mt-4">
                    <tbody>
                      <tr class="">
                        <td class="w-[5%] text-center">No</td>
                        <td class="w-[5%] text-center">Kode</td>
                        <td class="w-[45%]">Deskripsi</td>
                        <td class="w-[7%] text-center">Tahun</td>
                        <td class="w-[30%]">Produktivitas (rp/orang/tahun)</td>
                      </tr>
                      <template v-for="(_, groupIndex) in 2">
                        <tr v-for="(_, yearIndex) in 5" :key="`group${groupIndex}-year${yearIndex}`">
                          <td class="text-center">{{ groupIndex * 5 + yearIndex + 1 }}</td>
                          <template v-if="yearIndex === 0">
                            <td class="text-center" :rowspan="5">{{ data_7['kode'][groupIndex * 5] }}
                            </td>
                            <td :rowspan="5">{{ data_7['deskripsi'][groupIndex * 5] }}</td>
                          </template>
                          <td class="text-center">{{ data_7['tahun'][groupIndex * 5 + yearIndex] }}</td>
                          <td class="text-end px-2">{{ data_7['produktivitas'][groupIndex * 5 + yearIndex
                          ] }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="pdf-content" id="pdfContent-4">
              <div class="content page-4">
                <p class="page-number text-center">4</p>
                <div class="border border-black p-2 mb-4">
                  <table class="w-full text-xs font-normal">
                    <tbody>
                      <tr class="">
                        <td class="w-[5%] text-center">No</td>
                        <td class="w-[5%] text-center">Kode</td>
                        <td class="w-[45%]">Deskripsi</td>
                        <td class="w-[7%] text-center">Tahun</td>
                        <td class="w-[30%]">Produktivitas (rp/orang/tahun)</td>
                      </tr>
                      <template v-for="(_, groupIndex) in 6">
                        <tr v-for="(_, yearIndex) in 5" :key="`group${groupIndex}-year${yearIndex}`">
                          <td class="text-center">{{ groupIndex * 5 + yearIndex + 11 }}</td>
                          <template v-if="yearIndex === 0">
                            <td class="text-center" :rowspan="5">{{ data_7['kode'][groupIndex * 5 + 10] }}
                            </td>
                            <td :rowspan="5">{{ data_7['deskripsi'][groupIndex * 5 + 10] }}</td>
                          </template>
                          <td class="text-center">{{ data_7['tahun'][groupIndex * 5 + yearIndex + 10] }}</td>
                          <td class="text-end px-2">{{ data_7['produktivitas'][groupIndex * 5 + yearIndex
                            + 10] }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="pdf-content" id="pdfContent-5">
              <div class="content page-5">
                <p class="page-number text-center">5</p>
                <div class="border border-black p-2 mb-4">
                  <table class="w-full text-xs font-normal">
                    <tbody>
                      <tr class="">
                        <td class="w-[5%] text-center">No</td>
                        <td class="w-[5%] text-center">Kode</td>
                        <td class="w-[45%]">Deskripsi</td>
                        <td class="w-[7%] text-center">Tahun</td>
                        <td class="w-[30%]">Produktivitas (rp/orang/tahun)</td>
                      </tr>
                      <template v-for="(_, groupIndex) in 6">
                        <tr v-for="(_, yearIndex) in 5" :key="`group${groupIndex}-year${yearIndex}`">
                          <td class="text-center">{{ groupIndex * 5 + yearIndex + 41 }}</td>
                          <template v-if="yearIndex === 0">
                            <td class="text-center" :rowspan="5">{{ data_7['kode'][groupIndex * 5 + 40] }}
                            </td>
                            <td :rowspan="5">{{ data_7['deskripsi'][groupIndex * 5 + 40] }}</td>
                          </template>
                          <td class="text-center">{{ data_7['tahun'][groupIndex * 5 + yearIndex + 40] }}</td>
                          <td class="text-end px-2">{{ data_7['produktivitas'][groupIndex * 5 + yearIndex
                            + 40] }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="pdf-content" id="pdfContent-6">
              <div class="content page-6">
                <p class="page-number text-center">6</p>
                <div class="border border-black p-2 mb-4">
                  <table class="w-full text-xs font-normal">
                    <tbody>
                      <tr class="">
                        <td class="w-[5%] text-center">No</td>
                        <td class="w-[5%] text-center">Kode</td>
                        <td class="w-[45%]">Deskripsi</td>
                        <td class="w-[7%] text-center">Tahun</td>
                        <td class="w-[30%]">Produktivitas (rp/orang/tahun)</td>
                      </tr>
                      <template v-for="(_, groupIndex) in 3">
                        <tr v-for="(_, yearIndex) in 5" :key="`group${groupIndex}-year${yearIndex}`">
                          <td class="text-center">{{ groupIndex * 5 + yearIndex + 71 }}</td>
                          <template v-if="yearIndex === 0">
                            <td class="text-center" :rowspan="5">{{ data_7['kode'][groupIndex * 5 + 70] }}
                            </td>
                            <td :rowspan="5">{{ data_7['deskripsi'][groupIndex * 5 + 70] }}</td>
                          </template>
                          <td class="text-center">{{ data_7['tahun'][groupIndex * 5 + yearIndex + 70] }}</td>
                          <td class="text-end px-2">{{ data_7['produktivitas'][groupIndex * 5 + yearIndex
                            + 70] }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
    <Loading v-if="loading" text="Generating Report..." />
  </div>

</template>

<script setup>
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { ChartColors } from '~/assets/helpers/colors'

const props = defineProps(["kota", "rawdata", "metadata"])

// const data1 = props.rawdata.data[props.kota]
// const data2 = props.rawdata.raw[props.kota]

const modal = ref({
  show: false,
})

const latestIndex = props.rawdata.metadata.tahun.length - 1

const realData = props.rawdata.kota.filter(x => x.nama === props.kota)[0]

const state = ref(0)

const loading = ref(false)

const data_1 = computed(() => {
  let dataset = {
    labels: props.rawdata.metadata.tahun.slice(-5),
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData = realData.agregat.pdrb_adhk.slice(-5)
  dataset.datasets[0].data = calcData
  return dataset
})

const data_2 = computed(() => {
  let dataset = {
    labels: props.rawdata.metadata.tahun.slice(-5),
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData = realData.agregat.jumlah_tenaga_kerja_bekerja.slice(-5)
  dataset.datasets[0].data = calcData
  return dataset
})

const data_3 = computed(() => {
  let dataset = {
    labels: props.rawdata.metadata.tahun.slice(-5),
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData = realData.agregat.jumlah_rata_rata_upah.slice(-5)
  dataset.datasets[0].data = calcData
  return dataset
})

const data_4 = computed(() => {
  let dataset = {
    labels: props.rawdata.metadata.tahun.slice(-5),
    datasets: [
      {
        label: "Produktivitas",
        data: null,
        backgroundColor: "#3867D6",
        borderRadius: 5,
      },
    ],
  }
  let calcData = realData.agregat.jumlah_rata_rata_jam_kerja.slice(-5)
  dataset.datasets[0].data = calcData
  return dataset
})

const data_6 = computed(() => {
  const lapanganUsaha = realData.lapangan_usaha;

  // Initialize objects to track max/min values
  let maxPDRB = { key: null, value: -Infinity };
  let maxTK = { key: null, value: -Infinity };
  let maxProduktivitas = { key: null, value: -Infinity };
  let minProduktivitas = { key: null, value: Infinity };
  let maxGrowth = { key: null, value: -Infinity };
  let minGrowth = { key: null, value: Infinity };

  // Find all metrics in one pass
  Object.entries(lapanganUsaha).forEach(([key, value]) => {
    // PDRB
    const lastPDRB = value.pdrb_adhk[latestIndex] || 0;
    if (lastPDRB > maxPDRB.value) {
      maxPDRB = { key, value: lastPDRB };
    }

    // Tenaga Kerja
    const lastTK = value.jumlah_tenaga_kerja_bekerja[latestIndex] || 0;
    if (lastTK > maxTK.value) {
      maxTK = { key, value: lastTK };
    }

    // Produktivitas
    const lastProduktivitas = value.produktivitas_tenaga_kerja[latestIndex] || 0;
    if (lastProduktivitas > maxProduktivitas.value) {
      maxProduktivitas = { key, value: lastProduktivitas };
    }
    if (lastProduktivitas < minProduktivitas.value) {
      minProduktivitas = { key, value: lastProduktivitas };
    }

    // Growth
    const lastGrowth = value.growth_produktivitas_tenaga_kerja[latestIndex] || 0;
    if (lastGrowth > maxGrowth.value) {
      maxGrowth = { key, value: lastGrowth };
    }
    if (lastGrowth < minGrowth.value) {
      minGrowth = { key, value: lastGrowth };
    }
  });

  // Get names from metadata
  const getNama = (key) => props.rawdata.metadata.lapangan_usaha.dict[key];

  return {
    "Sektor PDRB terbesar": {
      0: maxPDRB.key,
      1: getNama(maxPDRB.key),
      2: `Rp ${maxPDRB.value.toLocaleString('id-ID')}`
    },
    "Sektor Penyerapan TK terbesar": {
      0: maxTK.key,
      1: getNama(maxTK.key),
      2: maxTK.value.toLocaleString('id-ID')
    },
    "Sektor Produktivitas terbesar": {
      0: maxProduktivitas.key,
      1: getNama(maxProduktivitas.key),
      2: `Rp ${maxProduktivitas.value.toLocaleString('id-ID')}`
    },
    "Sektor Produktivitas terendah": {
      0: minProduktivitas.key,
      1: getNama(minProduktivitas.key),
      2: `Rp ${minProduktivitas.value.toLocaleString('id-ID')}`
    },
    "Sektor Peningkatan Produktivitas terbesar": {
      0: maxGrowth.key,
      1: getNama(maxGrowth.key),
      2: `${maxGrowth.value.toLocaleString('id-ID')}%`
    },
    "Sektor Peningkatan Produktivitas terendah": {
      0: minGrowth.key,
      1: getNama(minGrowth.key),
      2: `${minGrowth.value.toLocaleString('id-ID')}%`
    }
  };
})

const data_7 = computed(() => {
  let dataNew = realData.lapangan_usaha
  let compiledData = {
    kode: [],
    deskripsi: [],
    tahun: [],
    produktivitas: []
  }

  const kode = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M,N", "O", "P", "Q", "R,S,T,U"]
  const lastFiveYears = props.rawdata.metadata.tahun.slice(-5)

  for (let x of kode) {
    for (let i = 0; i < lastFiveYears.length; i++) {
      const yearIndex = props.rawdata.metadata.tahun.indexOf(lastFiveYears[i])
      compiledData.kode.push(x)
      compiledData.deskripsi.push(props.rawdata.metadata.lapangan_usaha.dict[x])
      compiledData.tahun.push(lastFiveYears[i])
      compiledData.produktivitas.push((dataNew[x]['produktivitas_tenaga_kerja'][yearIndex]))
    }
  }
  return compiledData
})

const generatePDF = async () => {
  try {
    loading.value = true
    let title = `[example] Sertifikat_Produktivitas.pdf`

    const doc = new jsPDF({
      orientation: "p",
      unit: 'mm',
      format: "a4",
      compress: true
    });

    for (let i = 1; i <= 6; i++) {
      let canvas = await html2canvas(document.getElementById(`pdfContent-${i}`), {
        scale: 2,
      });
      if (i > 1) doc.addPage();
      doc.addImage(canvas, 'PNG', 0, 0, 210, 297);
    }

    loading.value = false
    doc.save(title);
  } catch (error) {
    loading.value = false
    console.error('Error generating PDF:', error)
    throw error
  }
}


</script>

<style scoped>
.modal-overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  background-color: #000000da;
}

.close {
  cursor: pointer;
}

.pdf-content {
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: 0.5em;
  /* background-position: center center; */
  /* Set your desired background color */
  height: 297mm;
  width: 210mm;
}

.pdf-content-2 {
  background-color: #ffffff;
  /* background-color: #fffff6; */
  /* background-color: #b1b116; */
  background-repeat: no-repeat;
  background-size: contain;
  /* background-position: center center; */
  /* Set your desired background color */
  height: 297mm;
  width: 210mm;
}

.qr-ttd {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
  margin-top: 1.5em;
}

.content {
  padding: 4em 7em 3em;
  position: relative;
  height: 100%;
}

.title {
  font-family: 'Times New Roman', Times, serif;
  text-align: center;
}

.title-text {
  font-size: 1em;
}

.normal-text {
  font-family: 'Times New Roman', Times, serif;
  font-size: 1em;
  text-align: center;
}

.nomor-sertif {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  font-size: 1.25em;
  text-align: center;
  margin-top: 1.6em;
}

.perusahaan {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  font-size: 2em;
  text-align: center;
  margin-top: 1.5em;
  line-height: 1.2;
  height: 2.5em;
}

.table,
td {
  border: 1px solid;
  padding-bottom: 10px;
}

.content-2 {
  padding: 2em 3em 2em;
}

.header-2 {
  margin-left: auto;
  margin-right: auto;
  color: white;
  background-color: #c35752;
  border-radius: 10em;
  padding: 0em 1em 1em 1em;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.4em;
  font-weight: 600;
  text-align: center;
}

.no-border {
  border: none;
}

.no-border td {
  border: none;
}

.page-number {
  position: absolute;
  bottom: 40px;
  right: 50%;
  font-size: 1em;
}
</style>