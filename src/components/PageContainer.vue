<template>
  <div
    class="chat-container"
    :key="id"
  >
    <v-card
      class="messages"
      ref="messagesContainer"
    >
      <GetErrorSuccess class="ma-3" />

      <v-list>
        <v-list-item
          v-for="(message, index) in messages"
          v-if="messages?.length"
          :key="index"
          class="message-item"
          :class="{
            'user-message': message.type === 'user',
            'bot-message': message.type !== 'user',
          }"
        >
          <template v-if="message.type === 'bot'">
            <v-icon class="bot-icon">mdi-robot</v-icon>

            <template v-if="currentPage === CONSTANTS?.pages?.image">
              <ImageMessage :fileName="message.content" />
            </template>
            <template v-else-if="currentPage === CONSTANTS?.pages?.audio">
              <AudioMessage :fileName="message.content" />
            </template>
            <template v-else>
              <div v-html="formatMessage(message.content)"></div>
            </template>
            <small>{{ moment(message?.time).fromNow() }}</small>
          </template>
          <template v-if="message.type === 'whois'">
            <WhoIs :data="message.content" />
          </template>
          <template v-else>
            <div v-html="formatMessage(message.content)"></div>
            <small>{{ moment(message?.time).fromNow() }}</small>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
  <div class="input-container">
    <textarea
      v-model="messageInput"
      @keydown="handleKeyDown"
      type="text"
      placeholder="Type your message here or your domain name..."
      class="message-input"
      rows="4"
    />

    <div
      class="right"
      :class="{ audio: currentPage === CONSTANTS.pages.audio }"
    >
      <template v-if="currentPage === CONSTANTS.pages.audio">
        <div>
          <v-autocomplete
            label="Speed"
            :items="CONSTANTS?.audio?.speeds || []"
            v-model="speed"
          />
        </div>
        <div>
          <v-autocomplete
            label="Voices"
            :items="CONSTANTS?.audio?.voices || []"
            v-model="voice"
          />
          <v-autocomplete
            label="Format"
            :items="CONSTANTS?.audio?.formats || []"
            v-model="format"
          />
        </div>
      </template>
      <div>
        <v-autocomplete
          label="Models"
          :items="CONSTANTS?.models?.[currentPage] || []"
          v-model="model"
        />
        <VBtn
          @click="sendMessage"
          class="send-button"
          :loading="mainStore.isLoading"
          :disabled="messageInput.trim() === ''"
        >
          Send
        </VBtn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useChatStore, useMainStore } from '@/stores'
import { computed, ref } from 'vue'
import CONSTANTS from '@/CONSTANTS'
import moment from 'moment/moment'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const mainStore = useMainStore()

const currentPage = computed(() => route.name?.replace('/', '') ?? '')
const id = computed(() => (route.query.id as string) || '')
const messages = computed(() => chatStore.getChatsById(id.value, currentPage.value))
const messageInput = ref<string>('')
const messagesContainer = ref<HTMLElement | null>(null)
const model = ref<string>(CONSTANTS.defaultModels[currentPage.value] || '')
const voice = ref<string>(CONSTANTS.audio.defaultVoice || '')
const format = ref<string>(CONSTANTS.audio.defaultFormat || '')
const speed = ref<number>(CONSTANTS.audio.defaultSpeed || 1)

/**
 * Send a message.
 */
const sendMessage = () => {
  const data = {
    id: id.value,
    content: messageInput.value,
    model: model.value,
    page: currentPage.value,
    type: 'user',
    voice: voice.value,
    format: format.value,
    speed: speed.value,
  }

  if (messageInput.value.trim() !== '') {
    chatStore.addMessageToChat(data)
    messageInput.value = ''
    scrollMessagesToBottom()
  }
}

/**
 * Scroll to the bottom of the messages container.
 */
const scrollMessagesToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 0)
}

/**
 * Handle key down events in the message input.
 * @param event - The keyboard event.
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

/**
 * Format a message by replacing newlines with HTML line breaks.
 * @param message - The message to format.
 * @returns The formatted message.
 */
const formatMessage = (message: string): string => {
  return message.replace(/\n/g, '<br>')
}

/**
 * Check if the title ID exists in the store.
 * @param newVal - The new title ID.
 */
const checkTheTitleId = (newVal: string = route.query.id as string) => {
  chatStore.isTheTitleExist(newVal, currentPage.value)
}

watch(id, newVal => {
  checkTheTitleId(newVal)
})

onMounted(() => {
  checkTheTitleId()
  scrollMessagesToBottom()

  if (!route.query.id) {
    const lastTitleId = chatStore.getLastTitleId(currentPage.value)
    router.push({ path: currentPage.value, query: { id: lastTitleId } })
  }
})
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-height: calc(100dvh - 150px);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding-right: 20px; /* Adjust for scrollbar width */
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  position: absolute;
  bottom: 0;
  height: 150px;
  width: 100%;

  .message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    resize: none;
  }

  .right {
    width: 150px;

    &.audio {
      width: 300px;
      display: flex;
      justify-content: space-between;

      & > div:not(:last-child) {
        margin-right: 10px;
      }

      & > div {
        flex: 1;
      }
    }

    .send-button {
      width: 100%;
      padding: 10px 20px;
      border: 1px solid #007bff;
      border-radius: 5px;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}

.user-message {
  text-align: right;
  border-radius: 10px;
  padding: 8px;
  margin: 5px;
}

.bot-message {
  text-align: left;
  margin-left: 30px; /* Create space for bot icon */
}

.bot-icon {
  margin-right: 10px;
  color: #757575;
}
</style>
