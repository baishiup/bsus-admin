<template>
  <div id="Article">
    <Card :bordered="false">
      <Table :columns="columns" :data="dataSource"></Table>
      <Page style="margin-top:20px" :total="total" :page-size="pageSize" @on-change="onPageChange" />
    </Card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { Button, Tag } from 'view-design';

export default {
  data() {
    return {
      dataSource: [],
      total: 0,
      pageSize: 3,
      page: 1,
      columns: [
        {
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '分类',
          align: 'center',

          render: (h, { row }) => {
            return <span>{row.category == null ? '未分类' : <Tag color="default">{row.category.name}</Tag>}</span>;
          }
        },
        {
          title: '标签',
          align: 'center',

          render: (h, { row }) => {
            return <div style="padding:5px 0;">{row.tags ? row.tags.split(',').map((x, i) => <Tag key={i}>{x}</Tag>) : ''}</div>;
          }
        },
        {
          title: '修改时间',
          width: 140,
          align: 'center',
          render: (h, { row }) => {
            return <span>{dayjs(row.updatedAt).format('YYYY-MM-DD')}</span>;
          }
        },
        {
          title: '操作',
          width: 130,
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <Button size="small" type="primary" style="margin-right:5px" on-click={_ => this.handleUpdate(row)}>
                  编辑
                </Button>
                <Button size="small" type="error" on-click={_ => this.handleDelete(row)}>
                  删除
                </Button>
              </div>
            );
          }
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData(index = 1) {
      this.page = index;

      let res = await this.$http(`/article?page=${this.page}&pageSize=${this.pageSize}`);

      this.dataSource = res.result.data;
      this.total = res.result.attribute.count;
    },
    onPageChange(index) {
      this.getData(index);
    },
    handleUpdate(row) {
      this.$router.push(`/writing?id=${row.id}`);
    },
    async handleDelete(row) {
      let res = await this.$http({
        method: 'delete',
        url: `/article/${row.id}`
      });
      if (res.status == 'success') {
        this.$Message.success('删除成功');
        this.getData();
      } else {
        this.$Message.error(res.message);
      }
    }
  }
};
</script>

<style></style>
