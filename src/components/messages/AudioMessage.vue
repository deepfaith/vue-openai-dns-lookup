<template>
  <audio
    v-if="audio"
    class="d-block mt-3"
    :src="audio"
    controls
  ></audio>
</template>

<script setup lang="ts">

import { defineProps, onMounted, ref, Ref } from 'vue'
import { fetchFile } from '@/services'

interface Props {
  fileName: string
}

const props = defineProps<Props>()
const audio: Ref<string | null> = ref(null)

onMounted(() => {
  fetchFile({ fileName: props.fileName }).then((res: string) => {
    audio.value = res
  })
})
</script>
