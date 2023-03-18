<template>
  <div>{{ JSON.stringify(lines) }}</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const editorText = ref('')
    const lines = computed<string[]>(() => {
      return []
    })

    return {
      editorText,
      lines,
    }
  }
})
</script>

<style lang="scss">
</style>
