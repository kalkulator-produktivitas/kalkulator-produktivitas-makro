<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Pilih Provinsi
      </h1>
      
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">
          Provinsi
        </label>
        <select 
          v-model="selectedProvince"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Pilih provinsi...</option>
          <option v-for="province in provinces" :key="province.id" :value="province.id">
            {{ province.nama_lengkap }}
          </option>
        </select>

        <button 
          @click="handleSubmit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          :disabled="!selectedProvince"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
});

import { getProvince } from '~/_service/navigasi/nav';
import { useRequest } from '~/composables/useRequest';
import { ErrorApiResponse } from '~/_service/http/schema';

const selectedProvince = ref('')

const provinceList = useRequest(getProvince);

const provinces = ref([

])

try {
  const res = await provinceList.call()
  provinces.value = res.list
  console.log(res.list);
} catch (e) {
  if (e instanceof ErrorApiResponse) {
    console.error(`ERROR | code: ${e.code} | message: ${e.message}`)
  } else {
    console.error('UNKNOWN ERROR: ', (e)?.message ?? 'Unknown Error')
  }
}


const handleSubmit = () => {
  if (selectedProvince.value) {
    // Handle the province selection
    navigateTo('/dashboard')
    // You can add navigation or other logic here
  }
}
</script>

<style scoped></style>