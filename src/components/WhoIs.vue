<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>WHOIS Lookup</v-card-title>

      <v-alert
        v-if="whoisData.error"
        type="error"
        class="mt-4"
        >{{ whoisData.error }}</v-alert
      >

      <v-card
        v-else
        class="mt-4"
      >
        <v-table dense>
          <tbody>
            <tr>
              <th colspan="2">Domain Information</th>
            </tr>
            <tr>
              <td>Domain Name</td>
              <td>{{ whoisData.domainName }}</td>
            </tr>
            <tr>
              <td>Registrar</td>
              <td>{{ whoisData.registrar }}</td>
            </tr>
            <tr>
              <td>Registration Date</td>
              <td>{{ whoisData.registrationDate }}</td>
            </tr>
            <tr>
              <td>Expiration Date</td>
              <td>{{ whoisData.expirationDate }}</td>
            </tr>
            <tr>
              <td>Estimated Age</td>
              <td>{{ whoisData.estimatedAge }}</td>
            </tr>
            <tr>
              <td>Hostnames</td>
              <td>{{ whoisData.formattedHostNames }}</td>
            </tr>
            <tr>
              <th colspan="2">Contact Information</th>
            </tr>
            <tr>
              <td>Registrant Name</td>
              <td>{{ whoisData.registrantName }}</td>
            </tr>
            <tr>
              <td>Technical Contact</td>
              <td>{{ whoisData.techContactName }}</td>
            </tr>
            <tr>
              <td>Admin Contact</td>
              <td>{{ whoisData.adminContactName }}</td>
            </tr>
            <tr>
              <td>Contact Email</td>
              <td>{{ whoisData.contactEmail }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: string | object
  error?: string
}>()
const whoisData = computed(() => {
  if (typeof props.data === 'string') {
    return JSON.parse(props.data)
  }
  return props.data
})
</script>
