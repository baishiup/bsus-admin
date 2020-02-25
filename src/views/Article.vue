<template>
  <div id="Article">
    <Card :bordered="false">
      <Table :columns="columns" :data="dataSource"></Table>
    </Card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { Button } from 'view-design';

export default {
  data() {
    return {
      dataSource: [],
      columns: [
        {
          type: 'index',
          align:'center',
          width:60
        },
        {
          title:'标题',
          key:'title'
        },
        {
          title:'描述',
          key:'description'
        },
        {
          title:'分类',
          render:(h,{row})=>{
            console.log(row.category)
            return row.category == null?'未分类':row.category.name
          }
        },
        {
          title:'标签',
          render:(h,{row})=>{
            return row.tags.split(',')
          }
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$http('/article');
      console.log(res);
      this.dataSource = res.result.data;
    }
  }
};
</script>

<style></style>
