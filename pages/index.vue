<template>

  <div class="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
    <div class="max-w-2xl px-6">
      <h1 class="text-4xl font-bold mb-4 text-blue-800">Selamat Datang di Website Kalkulator Produktivitas</h1>
      <p class="text-gray-600 mb-8 text-lg">Silahkan pilih menu dibawah ini untuk melanjutkan</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button @click="navigateTo('/upload')"
          class="group p-6 bg-white shadow-lg hover:shadow-xl rounded-xl border-2 border-transparent hover:border-blue-500 transition-all">
          <div class="text-2xl mb-2">📤</div>
          <h2 class="font-bold text-xl mb-2 text-blue-800">Upload Data</h2>
          <p class="text-gray-500 text-sm">Buat laporan dan analisis produktivitas perusahaan</p>
        </button>

        <button @click="navigateTo('/navigasi')"
          class="group p-6 bg-white shadow-lg hover:shadow-xl rounded-xl border-2 border-transparent hover:border-blue-500 transition-all">
          <div class="text-2xl mb-2">📈</div>
          <h2 class="font-bold text-xl mb-2 text-blue-800">Dashboard Produktivitas</h2>
          <p class="text-gray-500 text-sm">Visualisasikan dan analisis tren produktivitas</p>
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
});


</script>

<style scoped></style>