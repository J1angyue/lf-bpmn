import LogicFlow from '@logicflow/core'
import { BpmnXmlAdapter, BPMNAdapter, BpmnElement, Menu } from '@logicflow/extension'

import Pattern from './components/pattern.vue'
import EdgeEditor from './components/edge-editor.vue'
import BpmnIO from './components/io.vue'
import NodeEditor from './components/node-editor.vue'

LogicFlow.use(BpmnXmlAdapter)
LogicFlow.use(BPMNAdapter)
LogicFlow.use(BpmnElement)
LogicFlow.use(Menu)

export default function useLfBpmn() {
  const lfRef = shallowRef()
  const containerRef = shallowRef()

  onMounted(() => {
    lfRef.value = new LogicFlow({
      container: containerRef.value,
      grid: true
    })
    lfRef.value.render()
  })

  return {
    lfRef,
    containerRef,
    Pattern,
    BpmnIO,
    EdgeEditor,
    NodeEditor
  }
}
