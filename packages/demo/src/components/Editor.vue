<template>
  <div class="text-editor__wrapper">
    <div
      v-once
      ref="editor"
      class="text-editor__input highlight"
      contenteditable="true"
      spellcheck="false"
      autocorrect="off"
      autocapitalize="off"
      translate="no"
      @input="onInput"
    >
      {{ value }}
    </div>

    <div class="text-editor__result">
      {{ result }}
    </div>
  </div>
</template>

<script lang="ts">
import type { Ref } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { Renderer, Parser, Interpreter } from 'calc-parser'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: {
    'update:modelValue': (value: string) => true,
  },
  setup(props, context) {
    const renderer = new Renderer()
    const parser = new Parser()
    const interpreter = new Interpreter()

    const editor = ref() as Ref<HTMLTextAreaElement>
    const editorText = ref(props.value)

    watch(() => editorText.value, value => {
      context.emit('update:modelValue', value)
    })

    const result = computed(() => {
      try {
        const r = interpreter.eval(parser.parse(editorText.value))
        if (Array.isArray(r) && r.length && typeof r[0] === 'number') {
          const val = r[0]

          if (Number.isInteger(val)) {
            return val.toFixed(0)
          }
          return val.toFixed(2)
        }
      } catch {
        // Do nothing
      }

      return ''
    })


    const rendered = computed(() => renderer.renderHtml(editorText.value))

    const onInput = () => {
      updateEditor()
    }

    const getTextSegments = (element: Node) => {
      const textSegments: Array<{ text: string, node: Node }> = []

      Array.from(element.childNodes).forEach(node => {
        switch (node.nodeType) {
          case Node.TEXT_NODE: {
            const text = node.nodeValue ?? ''
            textSegments.push({ text, node })
            break
          }

          case Node.ELEMENT_NODE: {
            textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)))
            break
          }

          default:
            throw new Error(`Unexpected node type: ${node.nodeType}`)
        }
      })

      return textSegments
    }

    const updateEditor = () => {
      const sel = window.getSelection()
      if (!sel) {
        return
      }

      const textSegments = getTextSegments(editor.value)
      const textContent = textSegments.map(({ text }) => text).join('')
        .replaceAll(/&times;|\u00d7/g, '*')
        .replaceAll(/&divide;|\u00f7/g, '/')
        .replaceAll(/&plus;/g, '+')
        .replaceAll(/&minus;|\u2212/g, '-')

      let anchorIndex = null
      let focusIndex = null
      let currentIndex = 0
      textSegments.forEach(({ text, node }) => {
        if (node === sel.anchorNode) {
          anchorIndex = currentIndex + sel.anchorOffset
        }
        if (node === sel.focusNode) {
          focusIndex = currentIndex + sel.focusOffset
        }
        currentIndex += text.length
      })

      editorText.value = textContent // TODO: Remove this
      editor.value.innerHTML = renderer.renderHtml(textContent)

      restoreSelection(anchorIndex ?? 0, focusIndex ?? 0)
    }

    const restoreSelection = (absoluteAnchorIndex: number, absoluteFocusIndex: number) => {
      const sel = window.getSelection()
      if (!sel) {
        return
      }

      const textSegments = getTextSegments(editor.value)
      let anchorNode: Node = editor.value
      let anchorIndex = 0
      let focusNode: Node = editor.value
      let focusIndex = 0
      let currentIndex = 0
      textSegments.forEach(({ text, node }) => {
        const startIndexOfNode = currentIndex
        const endIndexOfNode = startIndexOfNode + text.length
        if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
          anchorNode = node
          anchorIndex = absoluteAnchorIndex - startIndexOfNode
        }
        if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
          focusNode = node
          focusIndex = absoluteFocusIndex - startIndexOfNode
        }
        currentIndex += text.length
      })

      sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex)
    }

    // const pasteAsPlainText = (event: ClipboardEvent) => {
    //   event.preventDefault()
    //   const text = event.clipboardData?.getData('text/plain')
    //   document.execCommand('insertHTML', false, text);
    // }
    //
    // onMounted(() => {
    //   if (editor.value) {
    //     editor.value.addEventListener('paste', pasteAsPlainText)
    //   }
    // })
    //
    // onUnmounted(() => {
    //   if (editor.value) {
    //     editor.value.removeEventListener('paste', pasteAsPlainText)
    //   }
    // })

    return {
      editor,
      editorText,
      rendered,
      result,
      onInput,
    }
  }
})
</script>

<style lang="scss">
:root {
  --bg-color: #282A35;
  --caret-color: #F8F8F2;
  --regular-text-color: #F8F8F2;
  --result-text-color: #5AF78E;
  --numeric-literal-color: #FF79C6;
  --operator-color: #8BE9FD;
  --paren-color: #F1FA8C;
}

* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.text-editor__wrapper {
  background-color: var(--bg-color);
  display: flex;
  flex-direction: row;
}

.text-editor__result,
.text-editor__input {
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.2;
  caret-color: var(--caret-color);
}

.text-editor__result {
  color: var(--result-text-color);
}

.text-editor__input {
  flex: 1;
  box-shadow: none;
  outline: none;
  color: var(--regular-text-color);
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
