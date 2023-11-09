<template>
  <el-drawer
    close-on-click-modal
    title="Edge properties Editor"
    :model-value="visible"
    @update:model-value="emits('update:visible', $event)"
  >
    <el-form label-position="top">
      <el-collapse>
        <CommentEditor
          :model-id="edgeId"
          @update:model-id="emits('update:nodeId', id)"
        />
        <el-collapse-item title="流转属性">
          <el-form-item label="流转类型">
            <el-radio-group
              :model-value="formModel.sequenceFlowType"
              @update:model-value="updateFlowType"
            >
              <el-radio :label="SEQUENCE_FLOW_TYPE.NORMAL">普通流转</el-radio>
              <el-radio :label="SEQUENCE_FLOW_TYPE.DEFAULT">默认流转</el-radio>
              <el-radio :label="SEQUENCE_FLOW_TYPE.CONDITION">条件流转</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-show="formModel.sequenceFlowType === SEQUENCE_FLOW_TYPE.CONDITION"
            label="条件表达式"
          >
            <el-input
              clearable
              :model-value="formModel.condition"
              @update:model-value="updateCondition"
            >
              <template #prepend>
                <el-select
                  :model-value="formModel.expressionType"
                  @update:model-value="updateExpressionType"
                  :clearable="false"
                >
                  <el-option
                    label="EL 表达式"
                    :value="BPMN_XML_TAGS.EXPRESSION_TEXT"
                  />
                  <el-option
                    label="CDATA 纯文本"
                    :value="BPMN_XML_TAGS.EXPRESSION_CDATA"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="多实例">
          <el-form-item label="回路特性">
            <!-- <el-select v-model="loopCharacteristics" @change="changeLoopCharacteristicsType">
              <el-option label="并行多重事件" value="ParallelMultiInstance" />
              <el-option label="时序多重事件" value="SequentialMultiInstance" />
              <el-option label="循环事件" value="StandardLoop" />
              <el-option label="无" value="Null" />
            </el-select> -->
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-drawer>
</template>

<script setup>
import CommentEditor from './common-editor.vue'
import { SEQUENCE_FLOW_TYPE, BPMN_XML_TAGS } from '../helper'

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

function getEdgeModel() {
  return lfRef.value.getEdgeModelById(props.edgeId)
}

function updateFlowType(type) {
  const edgeModel = getEdgeModel()
  if (!edgeModel) {
    return
  }
  const sourceNode = lfRef.value.getNodeModelById(edgeModel.sourceNodeId)

  formModel.value.sequenceFlowType = type

  // `DEFAULT` 类型的连线应当设置源节点的 `default` 属性，属性值为连线的 `id`
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#default-sequence-flow
  if (type === SEQUENCE_FLOW_TYPE.DEFAULT) {
    sourceNode?.setProperties({ default: edgeModel.id })
    edgeModel.deleteProperty(BPMN_XML_TAGS.CONDITION_EXPRESSION)
    return
  }

  // 不是 `DEFAULT` 类型的顺序流时应当删除源节点的 `default` 属性
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#xml-representation-20
  sourceNode?.deleteProperty(SEQUENCE_FLOW_TYPE.DEFAULT)

  // `CONDITION` 类型的连线应当设置表达式
  // https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#conditional-sequence-flow
  if (type === SEQUENCE_FLOW_TYPE.CONDITION) {
    formModel.value.expressionType = BPMN_XML_TAGS.EXPRESSION_TEXT
    edgeModel.setProperties({
      [BPMN_XML_TAGS.CONDITION_EXPRESSION]: {
        'xsi:type': 'tFormalExpression',
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

function getExpressionTypeFromEdge(edgeModel) {
  const conditionExpression = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  return conditionExpression?.hasOwnProperty(BPMN_XML_TAGS.EXPRESSION_TEXT) ? BPMN_XML_TAGS.EXPRESSION_TEXT : BPMN_XML_TAGS.EXPRESSION_CDATA
}

function updateExpressionType(type) {
  formModel.value.expressionType = type
  const edgeModel = getEdgeModel()
  if (!edgeModel) {
    return
  }
  const conditionExpression = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  const currentExpressionType = getExpressionTypeFromEdge(edgeModel)
  const expression = conditionExpression[currentExpressionType]
  delete conditionExpression[currentExpressionType]
  conditionExpression[type] = expression
}

function updateCondition(condition) {
  const edgeModel = getEdgeModel()
  const expressionTag = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  expressionTag[BPMN_XML_TAGS.EXPRESSION_TEXT] = formModel.value.condition = condition
}

function resetFormModel() {
  const edgeModel = getEdgeModel()

  formModel.value = {
    sequenceFlowType: SEQUENCE_FLOW_TYPE.NORMAL,
    expressionType: BPMN_XML_TAGS.EXPRESSION_TEXT,
    condition: ''
  }

  if (!edgeModel) {
    return
  }

  formModel.value.expressionType = getExpressionTypeFromEdge(edgeModel)

  // 是否是条件流转
  const expressionTag = edgeModel.properties[BPMN_XML_TAGS.CONDITION_EXPRESSION]
  if (expressionTag) {
    formModel.value.sequenceFlowType = SEQUENCE_FLOW_TYPE.CONDITION
    formModel.value.condition = expressionTag[BPMN_XML_TAGS.EXPRESSION_TEXT]
    return
  }

  // 是否是默认流转
  const defaultEdgeId = lfRef.value.getNodeModelById(edgeModel.sourceNodeId)?.properties[SEQUENCE_FLOW_TYPE.DEFAULT]
  if (defaultEdgeId && defaultEdgeId === props.edgeId) {
    formModel.value.sequenceFlowType = SEQUENCE_FLOW_TYPE.DEFAULT
    return
  }

  // return
}

watch(() => props.edgeId, resetFormModel)
</script>
