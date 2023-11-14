import {
  ElCollapse,
  ElCollapseItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElRow,
  ElDrawer
} from 'element-plus'

const epComponents = [
  ElCollapse,
  ElCollapseItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElRow,
  ElDrawer
]

export default function useEpComponents(app) {
  epComponents.forEach((comp) => app.component(comp.name, comp))
}
