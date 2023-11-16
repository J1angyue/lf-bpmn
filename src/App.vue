<script setup>
import useLfBpmn from '@/lf-bpmn'

const { containerRef, Pattern, EdgeEditor, NodeEditor, ProcessEditor, edgeDrawerVisible, nodeDrawerVisible, processDrawerVisible, edgeId, nodeId } =
  useLfBpmn()
</script>

<template>
  <div class="h-full flex">
    <Pattern />
    <div
      ref="containerRef"
      class="flex-1"
      @click="processDrawerVisible = true"
    ></div>
    <ProcessEditor v-model:visible="processDrawerVisible" />
    <NodeEditor
      v-model:visible="nodeDrawerVisible"
      v-model:node-id="nodeId"
    />
    <EdgeEditor
      v-model:visible="edgeDrawerVisible"
      v-model:edge-id="edgeId"
    />
  </div>
</template>

<style scoped>
.h-full {
  height: 100%;
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
</style>
