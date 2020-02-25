<template>
  <div id="Layout">
    <div class="sidebar">
      <SideBar></SideBar>
    </div>
    <div class="container">
      <Header class="header"></Header>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar';
import Header from './Header';
export default {
  components: {
    SideBar,
    Header
  }
};
</script>
<style lang="less" scoped>
#Layout {
  display: flex;
  .sidebar {
    background-color: #fff;
    width: 256px;
    min-height: 100vh;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
    position: fixed;
    z-index: 13;
  }
  .container {
    flex: 1;
    padding-left: 256px;
    position: relative;
    padding-top: 64px + 15px;
  }
  .header {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.main {
  padding: 0 15px 15px;
}
.info {
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  color: #17233d;
}
</style>
