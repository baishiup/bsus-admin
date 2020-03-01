<template>
  <div id="Category">
    <Card :bordered="false">
      <Button type="primary" style="margin-bottom:10px" @click="handleAdd">新增</Button>
      <Table :columns="columns" :data="dataSource"></Table>
    </Card>
    <!-- 编辑 -->
    <Modal v-model="editModal" :title="editType == ENUMEDITTYPE.ADD ? '新增' : '编辑'" footer-hide>
      <Form ref="editForm" :model="editForm">
        <FormItem prop="name" label="分类名称">
          <Input type="text" v-model="editForm.name"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { Button } from 'view-design';
export default {
  data() {
    return {
      dataSource: [],
      ENUMEDITTYPE: {
        ADD: 0,
        UPDATE: 1
      },
      editType: 0,
      editModal: false,
      editForm: {
        name: ''
      },
      columns: [
        {
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '分类名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '修改时间',
          align: 'center',
          render: (h, { row }) => <span>{dayjs(row.updatedAt).format('YYYY-MM-DD')}</span>
        },
        {
          title: '文章数',
          align: 'center',
          render: (h, { row }) => <span>{row.articles.length}</span>
        },
        {
          title: '操作',
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <Button type="primary" style="margin-right:7px" on-click={_ => this.handleUpdate(row)}>
                  编辑
                </Button>
                <Button type="error" on-click={_ => this.handleDelete(row)}>
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
    this.init();
  },
  methods: {
    async init() {
      this.getData();
    },
    async getData() {
      let res = await this.$http('/category');
      this.dataSource = res.result.data;
    },
    async handleSubmit() {
      let res = await this.$http({
        url: `/category${this.editType == this.ENUMEDITTYPE.UPDATE ? '/' + this.editForm.id : ''}`,
        method: this.editType == this.ENUMEDITTYPE.ADD ? 'post' : 'put',
        data: { ...this.editForm }
      });
      if (res.status == 'success') {
        this.$Message.success(res.message);
        this.editModal = false;
        this.getData();
      } else {
        this.$Message.error(res.message);
      }
    },
    handleAdd() {
      this.editType = this.ENUMEDITTYPE.ADD;
      this.editForm = Object.assign({}, { name: '' });
      this.editModal = true;
    },
    handleUpdate(row) {
      this.editType = this.ENUMEDITTYPE.UPDATE;
      this.editForm = Object.assign({}, row);
      this.editModal = true;
    },
    async handleDelete(row) {
      // TODO 有文章不能删
      let res = await this.$http({
        method: 'delete',
        url: `/category/${row.id}`
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
