<template>
  <div id="Login" @keydown.enter="handleSubmit" :style="`background-image: url(${curBg})`">
    <Card class="loginbox" :bordered="false">
      <p slot="title">
        <Icon type="log-in"></Icon>
        欢迎登录
      </p>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules" @keydown.native.enter.prevent="_ => false">
          <FormItem prop="username">
            <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="ios-lock"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem>
            <Button @click.prevent="handleSubmit" type="primary" long :loading="loading">
              <span v-if="loading">登录中</span>
              <span v-else>登录</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgList: [
        require('../../static/login1.jpg'),
        require('../../static/login2.jpg'),
        require('../../static/login3.jpg'),
        require('../../static/login4.jpg'),
        require('../../static/login5.jpg')
      ],

      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    };
  },
  computed: {
    curBg() {
      return this.bgList[Math.round(Math.random() * this.bgList.length)];
    }
  },
  methods: {
    async handleSubmit() {
      const res = await this.$http('/login', { params: this.form });
      if (res.status == 'success') {
        this.$Notice.success({
          title: `欢迎回来，${this.form.username}`
        });
        window.localStorage.setItem('token', res.result.data.token);
        this.$router.push('/');
      } else {
        this.$Message.error(res.message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#Login {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}
.loginbox {
  position: absolute;
  right: 160px;
  top: 50%;
  transform: translateY(-60%);
  width: 300px;
}
</style>
