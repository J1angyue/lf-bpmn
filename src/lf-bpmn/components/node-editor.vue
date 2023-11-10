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
          @update:model-id="emits('update:node-id', id)"
        />
        <!-- TODO: 网关与事件不能设置为多实例 -->
        <el-collapse-item title="多实例">
          <el-form-item
            label-position="left"
            label="是否多实例"
          >
            <el-switch
              :model-value="formModel.isMulTiInstance"
              @update:model-value="updateMulInsType"
            />
          </el-form-item>
          <template v-if="formModel.isMulTiInstance">
            <el-form-item label="实例执行方式">
              <el-radio-group
                :model-value="formModel.isSequential"
                @update:model-value="updateIsSequential"
              >
                <el-radio :label="false">并行执行</el-radio>
                <el-radio :label="true">顺序执行</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="完成条件">
              <el-input
                :model-value="formModel.completionCondition"
                @update:model-value="updateCompletionCondition"
              >
                <template #prepend>
                  <el-checkbox
                    label="CDATA"
                    :true-label="BPMN_XML_TAGS.EXPRESSION_CDATA"
                    :false-label="BPMN_XML_TAGS.EXPRESSION_TEXT"
                    :model-value="formModel.completionConditionType"
                    @update:model-value="updateCompletionConditionType"
                  />
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { getModel, BPMN_XML_TAGS, getExpressionType } from '../helper'
import CommentEditor from './common-editor.vue'

const lfRef = inject('lfRef')
const emits = defineEmits(['update:visible', 'update:node-id'])
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

const formModel = ref({
  isMulTiInstance: false,
  isSequential: false,
  completionCondition: '',
  completionConditionType: BPMN_XML_TAGS.EXPRESSION_TEXT
})

// 设置是否多实例
// https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs#xml-representation-34
function updateMulInsType(isMulTiInstance) {
  const nodeModel = getModel(lfRef.value, props.nodeId)
  if (!nodeModel) {
    return
  }

  formModel.value.isMulTiInstance = isMulTiInstance
  formModel.value.isSequential = false

  // 不是多实例时应当移除 <multiInstanceLoopCharacteristics /> 标签
  if (!isMulTiInstance) {
    nodeModel.deleteProperty(BPMN_XML_TAGS.MULTI_INSTANCE)
    return
  }

  // 多实例时应当添加 <multiInstanceLoopCharacteristics /> 标签
  nodeModel.setProperties({
    [BPMN_XML_TAGS.MULTI_INSTANCE]: {
      isSequential: formModel.value.isSequential
    }
  })
}

// 设置多实例串行还是并行
function updateIsSequential(isSequential) {
  const nodeModel = getModel(lfRef.value, props.nodeId)
  if (!nodeModel) {
    return
  }
  const multiInsTag = nodeModel.properties[BPMN_XML_TAGS.MULTI_INSTANCE]
  if (!multiInsTag) {
    return
  }
  multiInsTag.isSequential = formModel.value.isSequential = isSequential
}

// 获取多实例的完成条件属性，多实例没有完成条件时就设置一个并返回
// 因为 proxy，设置、获取时必须要操作 model.properites，不能操作源对象（缓存、解构等），否则返回后设置不上属性
function getCompleteConditionProps(nodeModel, conditionType = BPMN_XML_TAGS.EXPRESSION_TEXT) {
  const mulInsProperties = nodeModel.properties[BPMN_XML_TAGS.MULTI_INSTANCE]
  if (!mulInsProperties[BPMN_XML_TAGS.COMPLETE_CONDITION]) {
    mulInsProperties[BPMN_XML_TAGS.COMPLETE_CONDITION] = {
      'xsi:type': 'bpmn:tFormalExpression',
      [conditionType]: formModel.value.completionCondition
    }
    formModel.value.completionConditionType = conditionType
  }
  return mulInsProperties[BPMN_XML_TAGS.COMPLETE_CONDITION]
}

// 设置表完成条件表达式
function updateCompletionCondition(condition) {
  const nodeModel = getModel(lfRef.value, props.nodeId)
  if (!nodeModel) {
    return
  }

  if (!condition) {
    Reflect.deleteProperty(nodeModel.properties[BPMN_XML_TAGS.MULTI_INSTANCE], BPMN_XML_TAGS.COMPLETE_CONDITION)
    formModel.value.completionCondition = ''
    formModel.value.completionConditionType = BPMN_XML_TAGS.EXPRESSION_TEXT
    return
  }

  const completeConditionProps = getCompleteConditionProps(nodeModel)
  // 更新 properties 内的表达式
  completeConditionProps[getExpressionType(completeConditionProps)] = condition
  // 更新页面显示
  formModel.value.completionCondition = condition
}

// 设置完成条件表达式是否 #cdata，否则 #text
function updateCompletionConditionType(type) {
  const nodeModel = getModel(lfRef.value, props.nodeId)
  if (!nodeModel) {
    return
  }

  const completeConditionProps = getCompleteConditionProps(nodeModel, type)
  // 保存 properties 上的表达式字符串
  formModel.value.completionCondition = completeConditionProps[getExpressionType(completeConditionProps)] || ''
  // 删除现有的 #cdata 或 #text 属性（同时也会删除其值，所以删除前需要先保存）
  Reflect.deleteProperty(completeConditionProps, getExpressionType(completeConditionProps))
  // 设置新的 #cdata 或 #text 属性及原有的表达式字符串
  completeConditionProps[type] = formModel.value.completionCondition
  // 更新页面显示
  formModel.value.completionConditionType = type
}
</script>
