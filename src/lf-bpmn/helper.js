export const SEQUENCE_FLOW_TYPE = {
  NORMAL: 'normal',
  DEFAULT: 'default',
  CONDITION: 'condition'
}

export const MULTI_INSTANCE_TYPE = {
  PARALLEL: 'parallel',
  SEQUENTIAL: 'sequential'
}

export const BPMN_XML_TAGS = {
  CONDITION_EXPRESSION: 'bpmn:conditionExpression',
  MULTI_INSTANCE: 'bpmn:multiInstanceLoopCharacteristics',
  COMPLETE_CONDITION: 'bpmn:completionCondition',
  EXPRESSION_TEXT: '#text',
  EXPRESSION_CDATA: '#cdata-section'
}

export const BPMN_XML_ATTRS = {
  // 多实例是否是顺序执行（否则是并行执行）
  IS_SEQUENTIAL: 'isSequential'
}

export function getModel(lf, id) {
  return lf.getModelById(id)
}

export function getExpressionType(properties) {
  return properties?.hasOwnProperty(BPMN_XML_TAGS.EXPRESSION_TEXT) ? BPMN_XML_TAGS.EXPRESSION_TEXT : BPMN_XML_TAGS.EXPRESSION_CDATA
}
