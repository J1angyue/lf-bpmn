import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import 'element-plus/es/components/collapse/style/css'
import 'element-plus/es/components/collapse-item/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/radio/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/row/style/css'
import 'element-plus/es/components/drawer/style/css'

import { useEpComponents } from './lf-bpmn'

const app = createApp(App)
app.use(useEpComponents)
app.mount('#app')
