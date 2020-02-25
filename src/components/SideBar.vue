<template>
  <div id="SideBar">
    <div class="head"></div>
    <Menu :active-name="0" width="auto">
      <MenuItem v-for="(it, i) in menus" :key="i" :name="i" :to="it.path">
        <Icon :type="it.meta.iconType" />
        {{ it.meta.title }}
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import { listRoutes } from '../router';

export default {
  data() {
    return {
      menus: listRoutes()
    };
  }
};
</script>
<style lang="less" scoped>
#SideBar {
  width: 100%;
  min-height: 100%;
  .head {
    height: 64px;
    border-bottom: 1px solid #f5f7f9;
  }
}
</style>
