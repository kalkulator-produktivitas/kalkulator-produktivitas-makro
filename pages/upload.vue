<template>
  <div>
    <div class="md:mx-auto mt-6 mx-auto flex">
      <div class="shrink-0 w-[5%]"></div>
      <div class="h-full relative w-[92vw]">
        <p class="font-bold text-xl text-[#034EA2]">Upload Files</p>

        <div class="mt-4 w-full">
          <div class="border border-slate-200 rounded-lg p-6">
            <div class="flex flex-col gap-4">

              <p class="text-lg">Tentukan jenis file yang akan anda Upload</p>
              <div class="flex gap-4">
                <div class="border border-slate-200 rounded-lg p-6 w-[50%]">
                  <p class="block text-md text-gray-700 mb-2">
                    Pilih file CSV
                  </p>
                  <div class="border-2 border-dashed border-[#034EA2] rounded-lg p-8 text-center bg-blue-50 relative">
                    <div class="flex flex-col items-center">
                      <Icon name="mdi:cloud-upload-outline" size="12mm"
                        class="my-auto flex-none text-[#034EA2] self-center" />
                      <p class="mb-2 text-sm text-gray-500">Drag your file(s) or <span
                          class="text-[#034EA2] hover:underline cursor-pointer">browse</span></p>
                      <p class="text-xs text-gray-500">Max 10 MB files are allowed</p>
                    </div>
                    <input type="file" accept=".csv" class="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                  </div>
                </div>

                <div class="border border-slate-200 rounded-lg p-6 w-[50%]">
                  <label class="block text-md text-gray-700 mb-2">
                    Pilih File Excel
                  </label>
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
      <div class="border border-slate-200 rounded-lg p-6 w-[92vw]">
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
            <tr class="border-t border-slate-200">
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <Icon name="vscode-icons:file-type-excel" class="text-xl" />
                  <div>
                    <p class="font-medium">File Laporan 1.csv</p>
                    <p class="text-sm text-gray-500">500kb</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div class="bg-[#034EA2] h-2 rounded-full" style="width: 60%"></div>
                  </div>
                  <span class="text-sm">60%</span>
                </div>
              </td>
              <td class="text-sm">05 December 2024 10:35 a.m</td>
              <td class="text-sm">Albert Einstein</td>
              <td>
                <div class="flex gap-2">
                  <button class="text-[#034EA2]">
                    <Icon name="material-symbols:refresh" />
                  </button>
                  <button class="text-red-500">
                    <Icon name="material-symbols:delete-outline" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Example of failed upload -->
            <tr class="border-t border-slate-200">
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <Icon name="vscode-icons:file-type-excel" class="text-xl" />
                  <div>
                    <p class="font-medium">File Laporan 2.xls</p>
                    <p class="text-sm text-gray-500">120kb</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Upload Failed</span>
              </td>
              <td class="text-sm">05 December 2024 10:27 a.m</td>
              <td class="text-sm">Albert Einstein</td>
              <td>
                <div class="flex gap-2">
                  <button class="text-[#034EA2]">
                    <Icon name="material-symbols:refresh" />
                  </button>
                  <button class="text-red-500">
                    <Icon name="material-symbols:delete-outline" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="w-full bg-[#034EA2] text-white py-2 rounded-lg mt-4">Upload</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null);
const uploadedFiles = ref([
  {
    name: 'File Laporan 1.csv',
    size: '500kb',
    status: 'uploading',
    progress: 60,
    processedOn: '05 December 2024 10:35 a.m',
    user: 'Albert Einstein'
  },
  {
    name: 'File Laporan 2.xls',
    size: '120kb',
    status: 'failed',
    processedOn: '05 December 2024 10:27 a.m',
    user: 'Albert Einstein'
  }
]);
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
