<template>
  <div>
    <div class="md:mx-auto mt-6 mx-auto flex">
      <div class="flex shrink-0 w-[3%]">
      </div>
      <div class="px-1 py-1 absolute flex top-5 left-[12%] items-center bg-blue-700 rounded-full z-10">
        <Icon name="mdi:arrow-left-circle" class="cursor-pointer rounded-full border border-white bg-white"
          @click="navigateTo('/')" size="32" />

        <p class="text-white cursor-pointer mr-2" @click="navigateTo('/')">Back</p>
      </div>
      <div class="h-full relative w-[92vw]">
        <p class="font-bold text-xl text-[#034EA2]">Upload Files</p>

        <div class="mt-4 w-full">
          <div class="border border-slate-200 rounded-lg p-6">
            <div class="flex flex-col gap-4">

              <p class="text-lg">Tentukan jenis file yang akan anda Upload</p>
              
              <!-- Template Type Selection -->
              <div class="flex gap-4 mb-4">
                <div class="flex items-center gap-2">
                  <input type="radio" id="province" v-model="templateType" value="province" class="text-[#034EA2]" />
                  <label for="province" class="text-sm font-medium">Template Provinsi</label>
                </div>
                <div class="flex items-center gap-2">
                  <input type="radio" id="city" v-model="templateType" value="city" class="text-[#034EA2]" />
                  <label for="city" class="text-sm font-medium">Template Kota</label>
                </div>
              </div>

              <div class="flex gap-4">

                <div class="border border-slate-200 rounded-lg p-6 mx-auto">
                  <div class="flex justify-between">
                    <p class="block text-md text-gray-700 mb-2 w-[20%]">
                      Pilih File Excel
                    </p>
                    <div class="flex mb-4 w-full justify-between">
                      <!-- Province Selection (shown when templateType is 'province') -->
                      <div v-if="templateType === 'province'" class="flex gap-2">
                        <select v-model="selectedProvince"
                          class="p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="" disabled>Pilih provinsi...</option>
                          <option v-for="province in provinces" :key="province.id" :value="province.id">
                            {{ province.nama_lengkap }}
                          </option>
                        </select>

                        <a class="text-[#034EA2] hover:underline cursor-pointer my-auto flex items-center w-[40%]"
                          @click="downloadTemplate">
                          <Icon name="mdi:download" size="6mm" class="text-[#034EA2] my-auto" />
                          Download Template
                        </a>
                      </div>

                      <!-- City Selection (shown when templateType is 'city') -->
                      <div v-if="templateType === 'city'" class="flex gap-2">
                        <select v-model="selectedProvinceForCity"
                          @change="getKotaList"
                          class="p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[200px]">
                          <option value="" disabled>Pilih provinsi...</option>
                          <option v-for="province in provinces" :key="province.id" :value="province.id">
                            {{ province.nama_lengkap }}
                          </option>
                        </select>

                        <select v-model="selectedCity"
                          :disabled="!selectedProvinceForCity || kotas.length === 0"
                          class="p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[200px]">
                          <option value="" disabled>Pilih kota...</option>
                          <option v-for="kota in kotas" :key="kota.id" :value="kota.id">
                            {{ kota.nama }}
                          </option>
                        </select>

                        <a class="text-[#034EA2] hover:underline cursor-pointer my-auto flex items-center"
                          :class="{ 'opacity-50 cursor-not-allowed': !selectedCity }"
                          @click="downloadCityTemplate">
                          <Icon name="mdi:download" size="6mm" class="text-[#034EA2] my-auto" />
                          Download Template
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="border-2 border-dashed border-green-700 bg-green-50 rounded-lg p-8 text-center relative">
                    <div class="flex flex-col items-center">
                      <Icon name="mdi:cloud-upload-outline" size="12mm"
                        class="my-auto flex-none text-green-700 self-center" />
                      <p class="mb-2 text-sm text-gray-500">Drag your file(s) or <span
                          class="text-green-700 hover:underline cursor-pointer">browse</span></p>
                      <p class="text-xs text-gray-500">Max 10 MB files are allowed</p>
                    </div>
                    <input type="file" accept=".xlsx,.xls"
                      class="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      @change="selectedFile = $event.target.files[0]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:mx-auto mt-6 mx-auto flex">
      <div class="shrink-0 w-[5%]"></div>
      <div class="border border-slate-200 rounded-lg p-6 w-[92vw] flex flex-col overflow-y-auto max-h-[300px] relative">
        <h2 class="text-[#034EA2] font-bold mb-4">Uploaded Files</h2>
        <table class="w-full">
          <thead>
            <tr class="text-left">
              <th class="py-2">File Name</th>
              <th class="py-2">Status</th>
              <th class="py-2">Processed On</th>
              <th class="py-2">User</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-slate-200" v-if="selectedFile">
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <Icon name="vscode-icons:file-type-excel" class="text-xl" />
                  <div>
                    <p class="font-medium">{{ selectedFile.name }}</p>
                    <!-- <p class="text-sm text-gray-500">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p> -->
                  </div>
                </div>
              </td>
              <td>
                READY
              </td>
              <td class="text-sm">{{ new Date().toLocaleString('en-US', {
                day: '2-digit', month: 'long', year:
                  'numeric', hour: 'numeric', minute: '2-digit', hour12: true
              }) }}</td>
              <td class="text-sm">Admin</td>
              <td>
                <div class="flex gap-2">
                  <button class="text-[#034EA2]">
                    <Icon name="material-symbols:refresh" />
                  </button>
                  <button class="text-red-500" @click="selectedFile = null">
                    <Icon name="material-symbols:delete-outline" />
                  </button>
                </div>
              </td>
            </tr>
            <tr class="border-t border-slate-200" v-for="item in uploaded" :key="item.id">
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <Icon name="vscode-icons:file-type-excel" class="text-xl" />
                  <div>
                    <p class="font-medium">{{ item.file_name }}</p>
                  </div>
                </div>
              </td>
              <td>
                {{ item.status }}
              </td>
              <td class="text-sm">{{ dateFormatter(item.created_at) }}</td>
              <td class="text-sm">Admin</td>
              <td>
                <div class="flex gap-2">
                  <button class="text-[#034EA2]">
                    <Icon name="material-symbols:download" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          class="absolute top-0 right-10 w-[10%] bg-[#034EA2] text-white py-2 rounded-lg mt-4 self-center hover:bg-[#023b7d] transition-all duration-300"
          @click="uploadFile">Kirim</button>
      </div>
    </div>
    <Popup v-if="modal.show === true" :title="modal.title" :message="modal.message" :type="modal.type"
      @close="modal.show = false" />
    <Loading v-if="loading" text="Uploading..." />
  </div>
</template>

<script setup>
const global = useRuntimeConfig();
import { getUploadsList, postUpload, getTemplate, getTemplateKota } from '~/_service/upload/uploads';
import { getProvince, getCity } from '~/_service/navigasi/nav';
import { useRequest } from '~/composables/useRequest';
import { ErrorApiResponse } from '~/_service/http/schema';

const selectedFile = ref(null);

const uploadList = useRequest(getUploadsList);
const upload = useRequest(postUpload);
const template = useRequest(getTemplate);
const templateKota = useRequest(getTemplateKota);
const uploaded = ref([]);

// Template type selection
const templateType = ref('province')

const selectedProvince = ref('')
const selectedProvinceForCity = ref('')
const selectedCity = ref('')

const provinceList = useRequest(getProvince);
const kotaList = useRequest(getCity);
const provinces = ref([])
const kotas = ref([])

try {
  const res = await provinceList.call()
  provinces.value = res.list
} catch (e) {
  if (e instanceof ErrorApiResponse) {
    console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
  } else {
    console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
  }
}

const modal = ref({
  show: false,
  type: '',
  message: '',
  status: undefined
})

const loading = ref(false);

try {
  const res = await uploadList.call()
  uploaded.value = res.list
} catch (e) {
  if (e instanceof ErrorApiResponse) {
    // console.log(e);
    console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
    modal.value.type = 'ERROR'
    modal.value.message = e.message
    modal.value.show = true
    loading.value = false
  } else {
    // console.log(e);
    console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
    modal.value.type = 'ERROR'
    modal.value.message = 'UNKNOWN ERROR: '
    modal.value.show = true
    loading.value = false
  }
}

const dateFormatter = (date) => {
  return new Date(date).toLocaleString('en-US', {
    day: '2-digit', month: 'long', year:
      'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  })
}

const uploadFile = async () => {
  try {
    if (!selectedFile.value) {
      modal.value.type = 'ERROR'
      modal.value.message = 'Please select a file first'
      modal.value.show = true
      return
    }

    loading.value = true
    // Create FormData and append the file
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Pass the FormData to the upload call
    await upload.call(formData, "dki_jakarta")

    // Refresh the list after successful upload
    const res = await uploadList.call("dki_jakarta")
    uploaded.value = res.list


    modal.value.type = 'SUCCESS'
    modal.value.message = 'File berhasil diunggah'
    modal.value.show = true


    // Clear the selected file
    selectedFile.value = null
  } catch (e) {
    if (e instanceof ErrorApiResponse) {
      console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
      modal.value.type = 'ERROR'
      modal.value.message = e.message
      modal.value.show = true
      loading.value = false
    } else {
      console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
      modal.value.type = 'ERROR'
      modal.value.message = 'UNKNOWN ERROR: '
      modal.value.show = true
      loading.value = false
    }
  } finally {
    loading.value = false
  }
}

const getKotaList = async () => {
  try {
    if (!selectedProvinceForCity.value) {
      kotas.value = []
      selectedCity.value = ''
      return
    }
    
    const res = await kotaList.call(selectedProvinceForCity.value)
    kotas.value = res.list
    selectedCity.value = '' // Reset city selection when province changes
  } catch (e) {
    if (e instanceof ErrorApiResponse) {
      console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
      modal.value.type = 'ERROR'
      modal.value.message = e.message
      modal.value.show = true
      loading.value = false
    } else {
      console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
      modal.value.type = 'ERROR'
      modal.value.message = 'UNKNOWN ERROR: '
      modal.value.show = true
      loading.value = false
    }
  } finally {
    loading.value = false
  }
}

const downloadTemplate = async () => {
  try {
    if (selectedProvince.value === '') {
      throw new Error('Please select province');
    }

    const response = await fetch(`${global.public.goURL}/v1/makro/files/template?id_provinsi=${selectedProvince.value}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('ERROR: ', (error)?.message ?? 'Unknown Error')
    modal.value.type = 'ERROR'
    modal.value.message = error.message ? error.message : 'Unknown Error'
    modal.value.show = true
    loading.value = false
  }
}

const downloadCityTemplate = async () => {
  try {
    if (selectedCity.value === '') {
      throw new Error('Please select city');
    }

    const response = await fetch(`${global.public.goURL}/v1/makro/files/template/kota?id_kota=${selectedCity.value}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to download city template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_kota.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('ERROR: ', (error)?.message ?? 'Unknown Error')
    modal.value.type = 'ERROR'
    modal.value.message = error.message ? error.message : 'Unknown Error'
    modal.value.show = true
    loading.value = false
  }
}

// Watch for template type changes and reset selections
watch(templateType, (newType) => {
  if (newType === 'province') {
    selectedProvinceForCity.value = ''
    selectedCity.value = ''
    kotas.value = []
  } else if (newType === 'city') {
    selectedProvince.value = ''
  }
})
</script>

<style scoped>
/* Customize scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #034EA2;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #023b7d;
}
</style>
