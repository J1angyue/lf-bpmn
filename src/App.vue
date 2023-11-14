<script setup>
import useLfBpmn from '@/lf-bpmn'

const { containerRef, Pattern, EdgeEditor, BpmnIO, NodeEditor, edgeDrawerVisible, nodeDrawerVisible, edgeId, nodeId } = useLfBpmn()
</script>

<template>
  <div
    ref="containerRef"
    class="h-full"
  ></div>
  <EdgeEditor
    v-model:visible="edgeDrawerVisible"
    v-model:edge-id="edgeId"
  />
  <NodeEditor
    v-model:visible="nodeDrawerVisible"
    v-model:node-id="nodeId"
  />
  <BpmnIO />
  <Pattern />
</template>

<style scoped>
.h-full {
  height: 100%;
}
</style>
