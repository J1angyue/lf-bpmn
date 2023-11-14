<template>
  <el-drawer
    title="Listener editor"
    :model-value="visible"
    @update:model-value="emits('update:visible', $event)"
  >
    <el-form-item label="监听事件">
      <el-radio-group
        :model-value="listener.event"
        @update:model-value="emits('update:event', $event)"
      >
        <el-radio :label="EVENT_NAME.START">开始</el-radio>
        <el-radio :label="EVENT_NAME.END">结束</el-radio>
        <el-radio :label="EVENT_NAME.TAKE">执行</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="listener.event"
      label="监听器类型"
    >
      <el-radio-group
        :model-value="listener.type"
        @update:model-value="emits('update:type', $event)"
      >
        <el-radio :label="BPMN_XML_ATTRS.JAVA_CLASS">Java 类</el-radio>
        <el-radio :label="BPMN_XML_ATTRS.EXPRESSION">表达式</el-radio>
        <el-radio :label="BPMN_XML_ATTRS.DELEGATE_EXPRESSION">委托表达式</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="listener.type"
      label="监听器表达式"
    >
      <el-input
        :model-value="listener.expression"
        @update:model-value="emits('update:expression', $event)"
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <el-row
          class="flex-1"
          justify="space-between"
        >
          <div>注入字段</div>
          <el-button
            link
            type="primary"
            @click.stop="newField"
            >添加字段</el-button
          >
        </el-row>
        <el-table
          border
          stripe
          :data="fieldList"
          @row-click="setCurrField"
        >
          <el-table-column
            align="center"
            prop="name"
            label="字段名"
          >
            <template #default="{ row, $index }">
              <el-input
                v-if="currField === row"
                :model-value="row.name"
                @update:model-value="updateFieldName($event, $index)"
              />
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="expression"
            label="字段值"
          >
            <template #default="{ row, $index }">
              <el-input
                v-if="currField === row"
                :model-value="row.expression"
                @update:model-value="updateFieldExpression($event, $index)"
              />
              <span v-else>{{ row.expression }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="type"
            label="值类型"
          >
            <template #default="{ row, $index }">
              <el-select
                v-if="currField === row"
                :model-value="row.type"
                @update:model-value="updateFieldExpType($event, $index)"
              >
                <el-option
                  label="表达式"
                  :value="BPMN_XML_ATTRS.EXPRESSION"
                />
                <el-option
                  label="字符文本"
                  :value="BPMN_XML_ATTRS.STRING_VALUE"
                />
              </el-select>
              <span v-else>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template #default="{ $index }">
              <el-button
                link
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form-item>
  </el-drawer>
</template>

<script setup>
import { EVENT_NAME, BPMN_XML_ATTRS, BPMN_XML_TAGS } from '../helper'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  listener: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:visible', 'update:event', 'update:type', 'update:expression', 'update:fields'])

const fieldList = ref([])
const currField = ref(null)

function getListenerFields() {
  if (!props.listener) {
    return
  }

  let fields = props.listener[BPMN_XML_TAGS.FIELD]
  if (!fields) {
    props.listener[BPMN_XML_TAGS.FIELD] = []
    fields = props.listener[BPMN_XML_TAGS.FIELD]
  } else if (!Array.isArray(fields)) {
    props.listener[BPMN_XML_TAGS.FIELD] = [fields]
  }

  return fields
}

function getFieldExpType(field) {
  const fieldKeys = Object.keys(field)
  return [BPMN_XML_ATTRS.STRING_VALUE, BPMN_XML_ATTRS.EXPRESSION].find((attr) => fieldKeys.includes(attr))
}

function setCurrField(field) {
  currField.value = field
}

function newField() {
  const fields = getListenerFields()
  if (!fields) {
    return
  }
  currField.value = reactive({
    name: '',
    expression: '',
    type: BPMN_XML_ATTRS.EXPRESSION
  })
  fieldList.value.push(currField.value)
  fields.push({
    name: '',
    [currField.value.type]: ''
  })
  emits('update:fields', fields)
}

function updateFieldName(name, index) {
  const fields = getListenerFields()
  if (!fields || !fields.length) {
    return
  }
  const field = fields[index]
  if (!field) {
    return
  }
  field.name = currField.value.name = name
  emits('update:fields', fields)
}

function updateFieldExpression(expression, index) {
  const fields = getListenerFields()
  if (!fields || !fields.length) {
    return
  }
  const field = fields[index]
  if (!field) {
    return
  }
  currField.value.expression = expression
  field[currField.value.type] = expression
  emits('update:fields', fields)
}

function updateFieldExpType(type, index) {
  const fields = getListenerFields()
  if (!fields || !fields.length) {
    return
  }
  const field = fields[index]
  if (!field) {
    return
  }
  Reflect.deleteProperty(field, currField.value.type)
  currField.value.type = type
  field[type] = currField.value.expression
}

function resetFieldsByListener() {
  const fields = getListenerFields()
  if (!fields) {
    fieldList.value = []
  }
  fieldList.value = fields.map((field) => ({
    name: field.name,
    expression: field[getFieldExpType(field)],
    type: getFieldExpType(field)
  }))
}

watch(() => props.listener, resetFieldsByListener, { deep: false })
</script>

<style scoped>
.flex-1 {
  flex: 1;
}
</style>
