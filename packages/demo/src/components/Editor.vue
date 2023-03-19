<template>
  <pre><code>{{ JSON.stringify(tokens) }}</code></pre>
  <div class="wrapper">
    <pre id="text-view"><code class="highlight" v-html="rendered"></code></pre>

    <textarea
      id="text-editor"
      ref="editor"
      v-model="editorText"
      spellcheck="false"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Renderer, Tokenizer } from 'calc-parser';

export default defineComponent({
  setup() {
    const renderer = new Renderer()
    const tokenizer = new Tokenizer()

    const editor = ref<HTMLTextAreaElement>()
    const editorText = ref('1 + (2 - 3) * 4')
    const tokens = computed(() => {
      return Array.from(tokenizer.tokenize(editorText.value))
    })


    const rendered = computed(() => renderer.renderHtml(editorText.value))

    return {
      editor,
      editorText,
      rendered,
      tokens
    }
  }
})
</script>

<style lang="scss">
:root {
  --bg-color: #282A35;
  --caret-color: #F8F8F2;
  --regular-text: #F8F8F2;
  --numeric-literal-color: #FF79C6;
  --operator-color: #8BE9FD;
  --paren-color: #F1FA8C;
}

* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  overflow: clip;
  background-color: var(--bg-color);
}

#text-editor,
#text-view,
#text-view > code.highlight {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.2;
  overflow-x: visible;
  white-space: nowrap;
}

#text-editor {
  z-index: 1;
  background: transparent;
  color: transparent;
  outline: none;
  box-shadow: none;
  caret-color: var(--caret-color);
  resize: none;
}

#text-view {
  z-index: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: var(--regular-text);
}

.highlight {
  :deep(.number) {
    font-weight: bold;
    color: var(--numeric-literal-color);
  }

  :deep(.operator) {
    color: var(--operator-color);
  }

  :deep(.paren) {
    color: var(--paren-color);
  }
}
</style>
