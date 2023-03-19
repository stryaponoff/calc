<template>
  <div class="wrapper">
    <div class="text-view" v-html="rendered" />
    <textarea class="text-editor" ref="editor" v-model="editorText" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Renderer } from 'calc-parser';

export default defineComponent({
  setup() {
    const renderer = new Renderer()

    const editor = ref<HTMLTextAreaElement>()
    const editorText = ref('')


    const rendered = computed(() => renderer.render(editorText.value))

    return {
      editor,
      editorText,
      rendered,
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  position: relative;
}

.text-editor {
  flex: 1;
  border: 1px solid blue;
  opacity: 0;
}

.text-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  pointer-events: none;
}
</style>
