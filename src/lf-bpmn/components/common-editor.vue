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
  <listener-list :model-id="modelId" />
  <listener-list
    v-if="isUserTask"
    collapse-title="任务监听器"
    :model-id="modelId"
    :listener-tag="BPMN_XML_TAGS.TASK_LISTENER"
  />
</template>

<script setup>
import { getModel, TASK_TYPE, BPMN_XML_TAGS } from '../helper'
import ListenerList from './listener-list.vue'

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
const isUserTask = ref(false)

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
    isUserTask.value = false
    return
  }
  formModel.value.id = model.id
  formModel.value.text = model.text.value
  isUserTask.value = model.type === TASK_TYPE.USER_TASK
}

watch(() => props.modelId, resetFormModelByModelId, { immediate: true })
</script>
