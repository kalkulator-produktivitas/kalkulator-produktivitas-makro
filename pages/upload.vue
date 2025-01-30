<template>
  <div>
    <div class="md:mx-auto mt-6 mx-auto flex">
      <div class="flex shrink-0 w-[3%]">
      </div>
      <div class="px-1 py-1 absolute flex bottom-5 left-5 items-center bg-blue-700 rounded-full">
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
              <div class="flex gap-4">
                <div class="border border-slate-200 rounded-lg p-6 w-[50%]">
                  <div class="flex justify-between">
                    <p class="block text-md text-gray-700 mb-2">
                      Pilih File CSV
                    </p>
                    <div class="flex items-center">
                      <a class="text-[#034EA2] hover:underline cursor-pointer my-auto flex items-center" href="/files/template_analisis_makro.xlsx"
                        download>
                        <Icon name="mdi:download" size="6mm" class=" text-[#034EA2] my-auto" />
                        Download Template
                      </a>
                    </div>
                  </div>

                  <div class="border-2 border-dashed border-[#034EA2] rounded-lg p-8 text-center bg-blue-50 relative">
                    <div class="flex flex-col items-center">
                      <Icon name="mdi:cloud-upload-outline" size="12mm"
                        class="my-auto flex-none text-[#034EA2] self-center" />
                      <p class="mb-2 text-sm text-gray-500">Drag your file(s) or <span
                          class="text-[#034EA2] hover:underline cursor-pointer">browse</span></p>
                      <p class="text-xs text-gray-500">Max 10 MB files are allowed</p>
                    </div>
                    <input type="file" accept=".csv" class="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      @change="selectedFile = $event.target.files[0]" />
                  </div>
                </div>

                <div class="border border-slate-200 rounded-lg p-6 w-[50%]">
                  <div class="flex justify-between">
                    <p class="block text-md text-gray-700 mb-2">
                      Pilih File Excel
                    </p>
                    <div class="flex">
                      <a class="text-[#034EA2] hover:underline cursor-pointer my-auto flex items-center" href="/files/template_analisis_makro.xlsx"
                        download>
                        <Icon name="mdi:download" size="6mm" class=" text-[#034EA2] my-auto" />
                        Download Template
                      </a>
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
      <div class="border border-slate-200 rounded-lg p-6 w-[92vw] flex flex-col">
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
                    <p class="text-sm text-gray-500">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
                  </div>
                </div>
              </td>
              <td>
                Terunggah
              </td>
              <td class="text-sm">{{ new Date().toLocaleString('en-US', {
                day: '2-digit', month: 'long', year:
                  'numeric', hour: 'numeric', minute: '2-digit', hour12: true
              }) }}</td>
              <td class="text-sm">Rizal Herwanto</td>
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

          </tbody>
        </table>
        <button
          class="w-[10%] bg-[#034EA2] text-white py-2 rounded-lg mt-4 self-center hover:bg-[#023b7d] transition-all duration-300"
          @click="uploadFile">Kirim</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null);
const uploadFile = () => {
  console.log(selectedFile.value);
}

const downloadTemplate = () => {
  const link = document.createElement('a');
  link.href = '/template_analisis_makro.xlsx';
  link.download = 'template_analisis_makro.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
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
