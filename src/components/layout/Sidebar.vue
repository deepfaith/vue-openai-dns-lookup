<template>
  <VNavigationDrawer
    class="bg-deep-purple"
    theme="dark"
    permanent
  >
    <VList>
      <VListItem
        v-for="link in menuLinks"
        :key="link.title"
        @click="router.push(link.to)"
        :prepend-icon="link.icon"
        :to="link.to"
        :title="link.title"
        link
      />

      <VListItem
        v-for="title in titles"
        :key="title.id"
        @click="router.push(`/${currentPage}?id=${title.id}`)"
        prepend-icon="mdi-text"
        :to="`/${currentPage}?id=${title.id}`"
        :title="title.id"
        v-if="currentPage !== ''"
        title
      />
    </VList>

    <template v-slot:append>
      <VListItem
        v-if="currentPage !== ''"
        @click="newChat"
        prepend-icon="mdi-plus"
        title="New Chat"
        link
      />
      <div
        v-else
        class="pa-2 text-center"
      >
        DNS Lookup AI Tool
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup>
import { useChatStore } from '@/stores'
const chatStore = useChatStore()
const route = useRoute()
const router = useRouter()

const menuLinks = computed(() => {
  const ids = ['text', 'image', 'audio'].reduce(
    (acc, page) => ({
      ...acc,
      [page]: chatStore.getLastTitleId(page) ? `${page}?id=${chatStore.getLastTitleId(page)}` : page,
    }),
    {},
  )

  return [{ icon: 'mdi-view-dashboard', title: 'Dashboard', to: '/' }]
})

const currentPage = computed(() => route?.name?.replace('/', ''))
const chatId = computed(() => route?.query?.id)

const titles = computed(() => chatStore.getTitlesByPage({ page: currentPage.value }))

const newChat = async () => {
  const id = chatStore.createChatTitle({ page: currentPage.value })
  await router.push(`/text?id=${id}`)
}
</script>

<style scoped lang="scss">
.messages {
  a {
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    display: block;

    &:before {
      content: '•';
      margin-right: 10px;
    }

    &.active {
      color: white;
    }
  }
}
</style>
