<template>
  <el-collapse-item :name="listenerTag">
    <template #title>
      <el-row
        class="flex-1"
        justify="space-between"
      >
        <div>{{ collapseTitle }}</div>
        <el-button
          link
          type="primary"
          @click.stop="createListener"
          >添加</el-button
        >
      </el-row>
    </template>
    <el-table
      border
      stripe
      :data="listenerList"
    >
      <el-table-column
        align="center"
        prop="event"
        label="监听事件"
      />
      <el-table-column
        align="center"
        prop="type"
        label="监听器类型"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template #default="{ row, $index }">
          <el-button
            link
            type="primary"
            @click="updateListener(row)"
          >
            修改
          </el-button>
          <el-button
            link
            type="danger"
            @click="confirmDelListener($index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-collapse-item>
  <listener-editor
    v-model:visible="listenerEditorVisible"
    :listener="currListener"
    @update:event="updateListenerEvent"
    @update:type="updateListenerType"
    @update:expression="updateExpression"
    @update:fields="updateFields"
  />
</template>

<script setup>
import { getModel, BPMN_XML_TAGS, getListenerType } from '../helper'
import ListenerEditor from './listener-editor.vue'

const lfRef = inject('lfRef')
const listenerList = ref([])
const currListener = ref(newListener())
const listenerEditorVisible = ref(false)

const props = defineProps({
  modelId: {
    type: String,
    required: true
  },
  collapseTitle: {
    type: String,
    default: '执行监听器'
  },
  listenerTag: {
    type: String,
    default: BPMN_XML_TAGS.EXEC_LISTENER
  }
})

function newListener() {
  return {
    event: '',
    type: '',
    expression: ''
  }
}

// 获取 <extensionElements /> 下的 监听器，没有 <extensionElements /> 时创建一个
function getModelListeners() {
  const model = getModel(lfRef.value, props.modelId)
  if (!model) {
    return
  }

  let extEl = model.properties[BPMN_XML_TAGS.EXTENSION_ELEMENTS]
  // 没有 extensionElements 时创建一个
  if (!extEl) {
    // 不能连等
    model.properties[BPMN_XML_TAGS.EXTENSION_ELEMENTS] = {
      [props.listenerTag]: []
    }
    // 应当使用 lf 代理对象而不是原对象
    extEl = model.properties[BPMN_XML_TAGS.EXTENSION_ELEMENTS]
  }

  let listeners = extEl[props.listenerTag]
  if (!listeners) {
    extEl[props.listenerTag] = []
    listeners = extEl[props.listenerTag]
  } else if (!Array.isArray(listeners)) {
    extEl[props.listenerTag] = [listeners]
    listeners = extEl[props.listenerTag]
  }
  return listeners
}

function getListener() {
  const listeners = getModelListeners()
  if (!listeners) {
    return
  }
  return listeners[listenerList.value.indexOf(currListener.value)]
}

function createListener() {
  const model = getModel(lfRef.value, props.modelId)
  if (!model) {
    return
  }

  currListener.value = reactive(newListener())
  listenerList.value.push(currListener.value)

  const listeners = getModelListeners()
  listeners?.push({})

  listenerEditorVisible.value = true
}

function confirmDelListener(index) {
  if (!window.confirm('确认删除该监听器吗？')) {
    return
  }
  const listener = getModelListeners()
  if (!listener) {
    return
  }
  listener.splice(index, 1)
  listenerList.value.splice(index, 1)
}

function updateListenerEvent(event) {
  currListener.value.event = event
  const listener = getListener()
  if (!listener) {
    return
  }
  currListener.value.event = listener.event = event
}

function updateListenerType(type) {
  const listener = getListener()
  if (!listener) {
    return
  }
  const currListenerType = getListenerType(listener)
  const expression = listener[currListenerType] || ''
  if (currListenerType) {
    Reflect.deleteProperty(listener, currListenerType)
  }
  listener[type] = expression
  currListener.value.type = type
}

function updateExpression(expression) {
  const listener = getListener()
  if (!listener) {
    return
  }
  const type = getListenerType(listener)
  if (!type) {
    return
  }
  listener[type] = expression
  currListener.value.expression = expression
}

function updateListener(listener) {
  currListener.value = listener
  listenerEditorVisible.value = true
}

function resetListenersByModel() {
  const listeners = getModelListeners()

  if (!Array.isArray(listeners) || !listeners.length) {
    listenerList.value = []
    return
  }

  listenerList.value = listeners.map((listener) => ({
    event: listener.event,
    type: getListenerType(listener),
    expression: listener[getListenerType(listener)],
    [BPMN_XML_TAGS.FIELD]: listener[BPMN_XML_TAGS.FIELD]
  }))
}

function updateFields(fields) {
  const listener = getListener()
  if (!listener) {
    return
  }
  listener[BPMN_XML_TAGS.FIELD] = fields
  currListener.value[BPMN_XML_TAGS.FIELD] = fields
}

watch(() => props.modelId, resetListenersByModel, { immediate: true })
</script>
