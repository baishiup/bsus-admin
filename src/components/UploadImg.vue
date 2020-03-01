<template>
  <div id="UploadImg">
    <Upload :before-upload="handleUpload" action>
      <Button type="primary">选择图片</Button>
    </Upload>
    <div class="show" v-if="value">
      <img :src="value" alt />
    </div>
  </div>
</template>

<script>
import settings from '../settings';

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      origin: this.value
    };
  },
  methods: {
    async handleUpload(file) {
      let reqformData = new FormData();
      let type = file.type.split('/')[1];
      let filename = new Date().valueOf() + '.' + type;
      reqformData.append('file', file);
      reqformData.append('key', filename);

      let token = await this.getQiniuToken();
      reqformData.append('token', token);

      let res = await this.$http.post(settings.qiniuUrl, reqformData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      this.$emit('input', `${settings.cdnUrl}/${res.key}`);

      return false;
    },
    async getQiniuToken() {
      let res = await this.$http('/qiniutoken');
      return res.result.data;
    }
  }
};
</script>
<style lang="less" scoped>
#UploadImg {
  background-color: #f8f8f9;
  padding: 10px;
  width: 100%;
  display: inline-block;
  //   box-sizing: border-box;
  border-radius: 6px;
  .show {
    img {
      width: 300px;
    }
  }
}
</style>