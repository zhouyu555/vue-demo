<template>
  <div>
    <div>123</div>
    <el-upload
        ref="upload"
        class="upload-demo"
        :drag="true"
        :data="uploadVal"
        :action="action"
        :auto-upload="false"
        :multiple="false"
        :on-change="uploadChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传xlsx和xls文件，且不超过1M <span class="download" @click="download">下载模板</span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import {check} from '@/apis/upload'
import {calculateFileMd5ByDefaultChunkSize} from '@/utils/minioUpload'

export default {
  name: "UploadFile",
  data() {
    return {
      uploadVal: {},
      action: '',
      addPortVisible: true
    };
  },
  methods: {
    uploadChange(file) {
      calculateFileMd5ByDefaultChunkSize(file).then(e => {
        console.log(e)
        check(e, file)
      }).catch(e => {
        // 处理异常
        console.log(e);
      })
      // let fileSize = Number(file.size / 1024 / 1024)
      // if (fileSize > 1) {
      //   fileList.splice(0, 1)
      //   this.$message({
      //     type: 'info',
      //     message: '文件大小不可超过1M',
      //     showClose: true
      //   })
      //   return
      // }
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1)
      // }
      // this.uploadVal.groupIds = this.form.portGroupVal.toString()
      // this.uploadVal.file = file
    },
    download() {
      // exportExcel().then(res => {
      //   const filename = res.headers['content-disposition']
      //   const blob = new Blob([res.data])
      //   var downloadElement = document.createElement('a')
      //   var href = window.URL.createObjectURL(blob)
      //   downloadElement.href = href
      //   downloadElement.download = decodeURIComponent(filename.split('filename=')[1])
      //   document.body.appendChild(downloadElement)
      //   downloadElement.click()
      //   window.URL.revokeObjectURL(href)
      //   this.$refs.multipleTable.clearSelection()
      // })
    },
  }
}
</script>

<style scoped>

</style>
