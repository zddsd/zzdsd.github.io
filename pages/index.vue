<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-wide">WHOIS 域名查询</h1>
      <form @submit.prevent="submitQuery" class="mb-4">
        <input
          v-model="domain"
          placeholder="请输入域名（例如：example.com）"
          class="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition rounded-lg px-4 py-3 w-full text-lg mb-4 outline-none"
        />
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-semibold py-3 rounded-lg shadow-md transition"
          :disabled="loading"
        >
          {{ loading ? '查询中…' : '查询' }}
        </button>
      </form>
      <div v-if="error" class="text-red-500 text-center font-medium mb-2">{{ error }}</div>
      <div v-if="result" class="mt-4 p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap text-sm text-gray-800 max-h-96 overflow-auto shadow-inner">
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const domain = ref('')
const result = ref('')
const loading = ref(false)
const error = ref('')

async function submitQuery() {
  if (!domain.value) {
    error.value = '请输入域名'
    return
  }
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain.value)}`)
    const data = await res.json()
    if (data.success) {
      result.value = data.data
    } else {
      error.value = data.message || '查询失败'
    }
  } catch (e) {
    error.value = (e as Error).message || '网络错误'
  } finally {
    loading.value = false
  }
}
</script> 