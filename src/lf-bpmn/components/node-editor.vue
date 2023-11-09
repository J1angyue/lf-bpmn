<template>
  <el-drawer
    close-on-click-modal
    :model-value="visible"
    @update:model-value="emits('update:visible', $event)"
    title="Node Editor"
  >
    <el-form label-position="top">
      <el-collapse>
        <CommentEditor
          :model-id="nodeId"
          @update:model-id="emits('update:nodeId', id)"
        />
      </el-collapse>
    </el-form>
  </el-drawer>
</template>

<script setup>
import CommentEditor from './common-editor.vue'

const lfRef = inject('lfRef')
const emits = defineEmits(['update:visible', 'update:nodeId'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  nodeId: {
    type: String,
    default: ''
  }
})

const nodeModel = ref(null)

watch(
  () => props.nodeId,
  () => {
    if (!props.visible || !props.nodeId) {
      nodeModel.value = null
      return
    }
    nodeModel.value = lfRef.value.getNodeModelById(props.nodeId)
  }
)
</script>
