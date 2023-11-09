<template>
  <div class="graph-io">
    <span title="下载 XML" @click="downloadXml">
      <img src="../assets/download.png" alt="下载XML" />
    </span>
    <span class="download-img" title="下载图片" @click="downloadImage">
      <img src="../assets/img.png" alt="下载图片" />
    </span>
    <span class="upload-xml" title="上传 XML">
      <input type="file" class="upload" @change="uploadXml" />
      <img src="../assets/upload.png" alt="上传XML" />
    </span>
  </div>
</template>

<script setup>
const lfRef = inject('lfRef')

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.click();
}

function downloadXml() {
  const data = lfRef.value.getGraphData();
  download('lf-bpmn' + Date.now() + '.xml', data);
}

function uploadXml(ev) {
  const file = ev.target.files[0];
  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target) {
      const xml = event.target.result;
      lfRef.value.render(xml);
    }
    reader.onload = null
  }
  reader.readAsText(file);
}

</script>

<style scoped>
.graph-io {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .3);
  padding: 10px;
  display: flex;
}

.graph-io>span {
  margin: 0 5px;
  cursor: pointer;
}

.upload-xml {
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
}

.upload {
  position: absolute;
  z-index: 99;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>