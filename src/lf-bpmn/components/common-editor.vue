<template>
  <el-collapse-item
    title="常规属性"
    name="常规属性"
  >
    <el-form-item label="ID">
      <el-input
        :model-value="formModel.id"
        @update:model-value="updatelId"
      ></el-input>
    </el-form-item>
    <el-form-item label="Name">
      <el-input
        :model-value="formModel.text"
        @update:model-value="updateText"
      ></el-input>
    </el-form-item>
  </el-collapse-item>
</template>

<script setup>
const emits = defineEmits(['id-changed', 'text-changed', 'update:model-id'])
const props = defineProps({
  modelId: {
    type: String,
    required: true
  }
})

const lfRef = inject('lfRef')

const formModel = ref({
  id: '',
  text: ''
})

function getModel() {
  return lfRef.value.getModelById(props.modelId)
}

function updatelId(id) {
  const model = getModel()
  if (model) {
    model.id = id
  }
  formModel.value.id = id
  emits('id-changed', id)
  emits('update:model-id', id)
}

function updateText(text) {
  const model = getModel()
  model?.updateText(text, (formModel.value.text = text))
  emits('text-changed', text)
}

function resetFormModelByModelId() {
  formModel.value = {
    id: '',
    text: ''
  }
  const model = getModel()
  if (!model) {
    return
  }
  formModel.value.id = model.id
  formModel.value.text = model.text.value
}

watch(() => props.modelId, resetFormModelByModelId, { immediate: true })
</script>
