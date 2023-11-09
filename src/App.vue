<script setup>
import useLfBpmn from '@/lf-bpmn'

const { lfRef, containerRef, Pattern, EdgeEditor, BpmnIO, NodeEditor } = useLfBpmn()

const edgeId = ref('')
const edgeDrawerVisible = ref(false)

const nodeId = ref('')
const nodeDrawerVisible = ref(false)

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

onMounted(initEvents)
provide('lfRef', lfRef)
</script>

<template>
  <div ref="containerRef" class="h-full"></div>
  <EdgeEditor v-model:visible="edgeDrawerVisible" v-model:edge-id="edgeId" />
  <NodeEditor v-model:visible="nodeDrawerVisible" v-model:node-id="nodeId" />
  <BpmnIO />
  <Pattern />
</template>

<style scoped></style>
