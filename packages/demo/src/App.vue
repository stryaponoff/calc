<template>
  <div class="container">
    <div class="col">
      <textarea v-model="code"></textarea>
      <div>Result: {{ result }}</div>
    </div>
    <div class="col">
      <vue-json-pretty v-if="!parsed.isError" :data="parsed.value" />
      <code class="has-error" v-else>{{ parsed.value }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Interpreter, Parser } from 'calc-parser';
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    VueJsonPretty,
  },
  setup() {
    const parser = new Parser()
    const interpreter = new Interpreter()

    const code = ref('')
    const parsed = computed(() => {
      try {
        const value = parser.parse(code.value)
        return {
          isError: false,
          value: value,
        }
      } catch (e) {
        return {
          isError: true,
          value: e instanceof Error ? e.message : 'Unknown error',
        }
      }
    })

    const result = computed(() => {
      if (!parsed.value.isError) {
        return interpreter.eval(parsed.value.value as any)
      }

      return null
    })

    return {
      code,
      parsed,
      result,
    }
  }
})

</script>

<style lang="scss" scoped>
:deep(.vjs-value-string) {
  color: darkblue;
}

.has-error {
  color: #ff0000;
}

.container {
  display: flex;
  flex-direction: row;
}

.col {
  flex: 1;
}
</style>
