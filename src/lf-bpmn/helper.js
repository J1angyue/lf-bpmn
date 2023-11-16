export const SEQUENCE_FLOW_TYPE = {
  NORMAL: 'normal',
  DEFAULT: 'default',
  CONDITION: 'condition'
}

export const MULTI_INSTANCE_TYPE = {
  NONE: 'none',
  PARALLEL: 'parallel',
  SEQUENTIAL: 'sequential'
}

export const TASK_TYPE = {
  USER_TASK: 'bpmn:userTask'
}

export const BPMN_XML_TAGS = {
  CONDITION_EXPRESSION: 'bpmn:conditionExpression',
  MULTI_INSTANCE: 'bpmn:multiInstanceLoopCharacteristics',
  COMPLETE_CONDITION: 'bpmn:completionCondition',
  EXTENSION_ELEMENTS: 'bpmn:extensionElements',
  EXEC_LISTENER: 'flowable:executionListener',
  TASK_LISTENER: 'flowable:taskListener',
  FIELD: 'flowable:field',
  EXPRESSION_TEXT: '#text',
  EXPRESSION_CDATA: '#cdata-section'
}

export const EVENT_NAME = {
  START: 'start',
  END: 'end',
  TAKE: 'take'
}

export const BPMN_XML_ATTRS = {
  // 多实例是否是顺序执行（否则是并行执行）
  IS_SEQUENTIAL: 'isSequential',
  JAVA_CLASS: 'class',
  EXPRESSION: 'expression',
  DELEGATE_EXPRESSION: 'delegateExpression',
  STRING_VALUE: 'stringValue'
}

export const LF_PROPS_KEYS = {
  MULTI_INSTANCE: 'multiInstanceType',
  IS_DEFAULT_FLOW: 'isDefaultFlow'
}

const LISTENER_TYPE_LIST = [BPMN_XML_ATTRS.JAVA_CLASS, BPMN_XML_ATTRS.EXPRESSION, BPMN_XML_ATTRS.DELEGATE_EXPRESSION]

export function getModel(lf, id) {
  return lf.getModelById(id)
}

export function getExpressionType(properties) {
  return properties?.hasOwnProperty(BPMN_XML_TAGS.EXPRESSION_TEXT) ? BPMN_XML_TAGS.EXPRESSION_TEXT : BPMN_XML_TAGS.EXPRESSION_CDATA
}

export function getListenerType(properties) {
  return Object.keys(properties).find((type) => LISTENER_TYPE_LIST.includes(type))
}
