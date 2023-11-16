<template>
  <el-collapse
    class="pattern-collapse"
    :model-value="openedCollapses"
  >
    <el-collapse-item
      v-for="collapse in collapseList"
      :title="collapse.collapseTitle"
      :name="collapse.collapseTitle"
    >
      <div
        v-for="pattern in collapse.patterns"
        :key="pattern.text"
        class="pattern-item"
        @mousedown="startDrag(pattern)"
      >
        <img
          :src="pattern.icon"
          :alt="pattern.icon"
          class="icon"
        />
        <span class="text">{{ pattern.text }}</span>
      </div>
    </el-collapse-item>
    <el-collapse-item
      title="IO"
      name="IO"
    >
      <div
        class="pattern-item"
        @click="areaSelect"
      >
        <img
          src="../assets/io.area-select.png"
          alt="io.import.png"
          class="icon"
        />
        <span class="text">区选</span>
      </div>
      <div class="pattern-item">
        <img
          src="../assets/io.import.png"
          alt="io.import.png"
          class="icon"
        />
        <span class="text">导入</span>
        <input
          type="file"
          class="uploader"
          @change="importXML"
        />
      </div>
      <div
        class="pattern-item"
        @click="exportXML"
      >
        <img
          src="../assets/io.export.png"
          alt="io.import.png"
          class="icon"
        />
        <span class="text">导出</span>
      </div>
      <div
        class="pattern-item"
        @click="logXML"
      >
        <img
          src="../assets/io.log.png"
          alt="io.log.png"
          class="icon"
        />
        <span class="text">输出</span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import startEvent from '../assets/event.start.png'
import endEvent from '../assets/event.end.png'

import userTask from '../assets/task.user.png'
import serviceTask from '../assets/task.service.png'

import exclusiveGateway from '../assets/gateway.exclusive.png'
import inclusiveGateway from '../assets/gateway.inclusive.png'
import parallelGateway from '../assets/gateway.parallel.png'

import subProcess from '../assets/subprocess.expanded.png'

const lfRef = inject('lfRef')

const collapseList = reactive([
  {
    collapseTitle: '事件',
    patterns: [
      {
        type: 'bpmn:startEvent',
        text: '开始',
        icon: startEvent
      },
      {
        type: 'bpmn:endEvent',
        text: '结束',
        icon: endEvent
      }
      // {
      //   type: 'bpmn:boundaryEvent',
      //   text: '边界事件'
      // },
      // {
      //   type: 'bpmn:intermediateCatchEvent',
      //   text: '中间事件'
      // }
    ]
  },
  {
    collapseTitle: '任务',
    patterns: [
      {
        text: '用户任务',
        type: 'bpmn:userTask',
        icon: userTask
      },
      {
        type: 'bpmn:serviceTask',
        text: '服务任务',
        icon: serviceTask
      }
    ]
  },
  {
    collapseTitle: '网关',
    patterns: [
      {
        text: '并行网关',
        type: 'bpmn:parallelGateway',
        icon: exclusiveGateway
      },
      {
        text: '排他网关',
        type: 'bpmn:exclusiveGateway',
        icon: inclusiveGateway
      },
      {
        text: '包容网关',
        type: 'bpmn:inclusiveGateway',
        icon: parallelGateway
      }
    ]
  },
  {
    collapseTitle: '子流程',
    patterns: [
      {
        text: '嵌入子流程',
        type: 'bpmn:subProcess',
        icon: subProcess
      }
    ]
  }
])

const openedCollapses = computed(() => collapseList.map((c) => c.collapseTitle).concat('IO'))

function startDrag(pattern) {
  if (!lfRef.value) {
    return
  }
  lfRef.value.dnd.startDrag(pattern)
}

function importXML(ev) {
  const file = ev.target.files[0]
  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target) {
      const xml = event.target.result
      lfRef.value.render(xml)
    }
    reader.onload = null
  }
  reader.readAsText(file)
  ev.target.value = ''
}

function exportXML() {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(lfRef.value.getGraphData()))
  element.setAttribute('download', 'lf-bpmn-' + Date.now() + '.xml')
  element.click()
}

function areaSelect() {
  lfRef.value.extension.selectionSelect.openSelectionSelect()
  lfRef.value.once('selection:selected', () => lfRef.value.extension.selectionSelect.closeSelectionSelect())
}

function logXML() {
  console.log(lfRef.value.getGraphData())
  console.log(lfRef.value.getGraphRawData())
}
</script>

<style scoped>
.pattern-collapse {
  min-width: 150px;
  width: 15%;
  user-select: none;
}
.pattern-collapse .pattern-item {
  text-align: center;
  cursor: pointer;
  position: relative;
}
.pattern-collapse .pattern-item .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: text-top;
  margin: 0 10px;
}
.pattern-collapse .pattern-item .text {
  font-size: 16px;
}
.pattern-collapse .pattern-item .uploader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}
:deep(.el-collapse-item__header) {
  padding: 0 0 0 8px;
}
</style>
