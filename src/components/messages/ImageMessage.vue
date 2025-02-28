<template>
  <img
    class="d-block mt-3"
    v-if="image"
    :src="image"
  />
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { fetchFile } from '@/services'


interface Props {
  fileName: string
}

const props = defineProps<Props>()

const image = ref<string | null>(null)

/**
 * Fetches an image file on component mount.
 */
onMounted(() => {
  fetchFile({ fileName: props.fileName }).then((img: string) => {
    image.value = img
  })
})
</script>
