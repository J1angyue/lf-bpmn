import LogicFlow from '@logicflow/core'
import { BPMNAdapter, BPMNElements, Menu, SelectionSelect } from '@logicflow/extension'
import useEpComponents from './ep-components'

import Pattern from './components/pattern.vue'
import EdgeEditor from './components/edge-editor.vue'
import NodeEditor from './components/node-editor.vue'
import ProcessEditor from './components/process-editor.vue'

LogicFlow.use(BPMNAdapter)
LogicFlow.use(BPMNElements)
LogicFlow.use(Menu)
LogicFlow.use(SelectionSelect)

export { useEpComponents }

export default function useLfBpmn() {
  const lfRef = shallowRef()
  const containerRef = shallowRef()

  const edgeId = ref('')
  const edgeDrawerVisible = ref(false)

  const nodeId = ref('')
  const nodeDrawerVisible = ref(false)

  const processDrawerVisible = ref(true)

  function initEvents() {
    lfRef.value.on('edge:click', ({ data }) => {
      edgeId.value = data.id
      edgeDrawerVisible.value = true
      nodeDrawerVisible.value = false
    })

    lfRef.value.on('node:click', ({ data }) => {
      nodeId.value = data.id
      nodeDrawerVisible.value = true
      edgeDrawerVisible.value = false
    })
  }

  provide('lfRef', lfRef)

  onMounted(() => {
    lfRef.value = new LogicFlow({
      container: containerRef.value,
      grid: true
    })
    lfRef.value.render()
    initEvents()
  })

  return {
    lfRef,
    containerRef,
    nodeId,
    edgeId,
    edgeDrawerVisible,
    nodeDrawerVisible,
    processDrawerVisible,
    Pattern,
    EdgeEditor,
    NodeEditor,
    ProcessEditor
  }
}
