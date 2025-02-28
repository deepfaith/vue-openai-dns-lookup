<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard title="DNS Lookup AI Tool">
          <VList>
            <VListItem
              v-for="item in chatStore.getChatsByPage({ page, limit: 50 })"
              :to="`/${page}?id=${item.id}`"
              :key="item.id"
              prepend-icon="mdi-message-processing"
            >
              <VListItemTitle
                v-if="item.id"
                v-text="item.id"
              />
            </VListItem>
          </VList>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useChatStore } from '../stores'
import CONSTANTS from '../CONSTANTS'

const chatStore = useChatStore()
const pages = Object.keys(CONSTANTS.pages)
const page = 'text'
</script>
