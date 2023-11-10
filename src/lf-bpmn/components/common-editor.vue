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
import { getModel } from '../helper'

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

function updatelId(id) {
  const model = getModel(lfRef.value, props.modelId)
  if (model) {
    model.id = id
  }
  formModel.value.id = id
  emits('id-changed', id)
  emits('update:model-id', id)
}

function updateText(text) {
  const model = getModel(lfRef.value, props.modelId)
  model?.updateText(text, (formModel.value.text = text))
  emits('text-changed', text)
}

function resetFormModelByModelId() {
  formModel.value = {
    id: '',
    text: ''
  }
  const model = getModel(lfRef.value, props.modelId)
  if (!model) {
    return
  }
  formModel.value.id = model.id
  formModel.value.text = model.text.value
}

watch(() => props.modelId, resetFormModelByModelId, { immediate: true })
</script>
