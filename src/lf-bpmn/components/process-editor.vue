<template>
  <el-drawer
    close-on-click-modal
    title="流程编辑器"
    :model-value="visible"
    @update:model-value="emits('update:visible', $event)"
  >
    <el-form label-position="top">
      <el-form-item label="可执行">
        <el-switch
          :model-value="processFormModel.isExecutable"
          @update:model-value="updateProcessAttr('isExecutable', $event)"
        />
      </el-form-item>
      <el-form-item label="流程标识">
        <el-input
          :model-value="processFormModel.id"
          @update:model-value="updateProcessAttr('id', $event)"
        />
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input
          :model-value="processFormModel.name"
          @update:model-value="updateProcessAttr('name', $event)"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
const lfRef = inject('lfRef')
const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})

const processFormModel = ref({
  id: '',
  name: '',
  isExecutable: true
})

function resetFormModelByProcess() {
  if (!lfRef.value) {
    return
  }
  const { processAttributes } = lfRef.value.extension.BPMNAdapter
  // Object.keys(processFormModel.value).forEach((key) => (processFormModel.value[key] = processAttributes['-' + key]))
  processFormModel.value.id = processAttributes['-id'] || ''
  processFormModel.value.name = processAttributes['-name'] || ''
  processFormModel.value.isExecutable = Reflect.has(processAttributes, '-isExecutable') ? JSON.parse(processAttributes['-isExecutable']) : true
}

function updateProcessAttr(attrKey, value) {
  if (!lfRef.value) {
    return
  }
  const { processAttributes } = lfRef.value.extension.BPMNAdapter
  processFormModel.value[attrKey] = processAttributes['-' + attrKey] = value
}

watch(() => [props.visible, lfRef.value], resetFormModelByProcess, { immediate: true })
</script>
