<template>
  <el-drawer
    close-on-click-modal
    title="顺序流编辑器"
    :model-value="visible"
    @update:model-value="emits('update:visible', $event)"
  >
    <el-form label-position="top">
      <el-collapse>
        <CommentEditor
          :model-id="edgeId"
          @update:model-id="emits('update:nodeId', id)"
        />
        <el-collapse-item title="顺序流属性">
          <el-form-item label="顺序流类型">
            <el-radio-group
              :model-value="formModel.sequenceFlowType"
              @update:model-value="updateFlowType"
            >
              <el-radio :label="SEQUENCE_FLOW_TYPE.NORMAL">普通顺序流</el-radio>
              <el-radio :label="SEQUENCE_FLOW_TYPE.CONDITION">条件顺序流</el-radio>
              <el-radio :label="SEQUENCE_FLOW_TYPE.DEFAULT">默认顺序流</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-show="formModel.sequenceFlowType === SEQUENCE_FLOW_TYPE.CONDITION"
            label="条件表达式"
          >
            <el-input
              clearable
              placeholder="表达式应当返回 boolean 值"
              :model-value="formModel.condition"
              @update:model-value="updateCondition"
            >
              <template #prepend>
                <el-checkbox
                  label="CDATA"
                  :true-label="BPMN_XML_TAGS.EXPRESSION_CDATA"
                  :false-label="BPMN_XML_TAGS.EXPRESSION_TEXT"
                  :model-value="formModel.expressionType"
                  @update:model-value="updateExpressionType"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-drawer>
</template>

<script setup>
import CommentEditor from './common-editor.vue'
import { SEQUENCE_FLOW_TYPE, BPMN_XML_TAGS, LF_PROPS_KEYS, getModel, getExpressionType } from '../helper'

const lfRef = inject('lfRef')
const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  edgeId: {
    type: String,
    default: ''
  }
})

const formModel = ref({
  sequenceFlowType: SEQUENCE_FLOW_TYPE.NORMAL,
  expressionType: BPMN_XML_TAGS.EXPRESSION_TEXT,
  condition: ''
})

function updateFlowType(type) {
  const edgeModel = getModel(lfRef.value, props.edgeId)
  if (!edgeModel) {
    return
  }
  const sourceNode = lfRef.value.getNodeModelById(edgeModel.sourceNodeId)

  formModel.value.sequenceFlowType = type
  formModel.value.condition = ''
  formModel.value.expressionType = BPMN_XML_TAGS.EXPRESSION_TEXT

  // `DEFAULT` 类型的连线应当设置源节点的 `default` 属性，属性值为连线的 `id`
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#default-sequence-flow
  if (type === SEQUENCE_FLOW_TYPE.DEFAULT) {
    sourceNode?.setProperties({ default: edgeModel.id })
    edgeModel.deleteProperty(BPMN_XML_TAGS.CONDITION_EXPRESSION)
    edgeModel.setProperties({ [LF_PROPS_KEYS.IS_DEFAULT_FLOW]: true })
    return
  }

  // 不是 `DEFAULT` 类型的顺序流时应当删除源节点的 `default` 属性
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#xml-representation-20
  sourceNode?.deleteProperty(SEQUENCE_FLOW_TYPE.DEFAULT)
  edgeModel.deleteProperty(LF_PROPS_KEYS.IS_DEFAULT_FLOW)

  // `CONDITION` 类型的连线应当设置表达式
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#conditional-sequence-flow
  if (type === SEQUENCE_FLOW_TYPE.CONDITION) {
    formModel.value.expressionType = BPMN_XML_TAGS.EXPRESSION_TEXT
    edgeModel.setProperties({
      [BPMN_XML_TAGS.CONDITION_EXPRESSION]: {
        'xsi:type': 'bpmn:tFormalExpression',
        [formModel.value.expressionType]: ''
      }
    })
    return
  }

  // 不是 `CONDITION` 类型的顺序流应当删除该连线的表达式
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#xml-representation-20
  edgeModel.deleteProperty(BPMN_XML_TAGS.CONDITION_EXPRESSION)

  // `NORMAL` 类型的连线不需要设置任何东西
  // if (type === SEQUENCE_FLOW_TYPE.NORMAL)
}

function updateExpressionType(type) {
  formModel.value.expressionType = type
  const edgeModel = getModel(lfRef.value, props.edgeId)
  if (!edgeModel) {
    return
  }
  const conditionExpression = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  const currentExpressionType = getExpressionType(conditionExpression)
  const expression = conditionExpression[currentExpressionType]
  Reflect.deleteProperty(conditionExpression, currentExpressionType)
  conditionExpression[type] = expression
}

function updateCondition(condition) {
  const edgeModel = getModel(lfRef.value, props.edgeId)
  const expressionTag = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  expressionTag[getExpressionType(expressionTag)] = formModel.value.condition = condition
}

function resetFormModel() {
  const edgeModel = getModel(lfRef.value, props.edgeId)

  formModel.value = {
    sequenceFlowType: SEQUENCE_FLOW_TYPE.NORMAL,
    expressionType: BPMN_XML_TAGS.EXPRESSION_TEXT,
    condition: ''
  }

  if (!edgeModel) {
    return
  }

  const expressionTag = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  formModel.value.expressionType = getExpressionType(expressionTag)

  // 是否是条件流转
  if (expressionTag) {
    formModel.value.sequenceFlowType = SEQUENCE_FLOW_TYPE.CONDITION
    formModel.value.condition = expressionTag[formModel.value.expressionType]
    return
  }

  // 是否是默认流转
  const defaultEdgeId = lfRef.value.getNodeModelById(edgeModel.sourceNodeId)?.properties[SEQUENCE_FLOW_TYPE.DEFAULT]
  if (defaultEdgeId && defaultEdgeId === props.edgeId) {
    formModel.value.sequenceFlowType = SEQUENCE_FLOW_TYPE.DEFAULT
    edgeModel.setProperties({ [LF_PROPS_KEYS.IS_DEFAULT_FLOW]: true })
    return
  }

  // return
}

watch(() => props.edgeId, resetFormModel)
</script>
