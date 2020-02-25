<template>
  <div id="Writing">
    <div class="sider">
      <div class="right">
        <Button type="primary" @click="publishModal = true">发布</Button>
      </div>
    </div>
    <div class="container" ref="containerRef">
      <codemirror
        class="codemirror"
        ref="codemirror"
        :value="code"
        :options="options"
        @input="onCmCodeChange"
      ></codemirror>
      <div class="show">
        <div class="markdown-body" v-html="content"></div>
      </div>
    </div>

    <!-- 发布 -->
    <Modal v-model="publishModal" title="发布文章" footer-hide>
      <Form ref="editForm" :model="editForm">
        <FormItem prop="title" label="标题">
          <Input type="text" v-model="editForm.title"></Input>
        </FormItem>
        <FormItem prop="description" label="描述">
          <Input type="text" v-model="editForm.description"></Input>
        </FormItem>
        <FormItem prop="keywords" label="关键字">
          <Input type="text" v-model="editForm.keywords" placeholder="英文逗号隔开"></Input>
        </FormItem>
        <FormItem prop="state" label="状态">
          <RadioGroup v-model="editForm.state">
            <Radio :label="0">草稿</Radio>
            <Radio :label="1">发布</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="category_id" label="分类">
          <Select v-model="editForm.category_id">
            <Option v-for="(it, i) in categoryList" :value="it.id" :key="i">{{ it.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="tags" label="标签">
          <Select
            v-model="editForm.tags"
            filterable
            multiple
            allow-create
            @on-create="handleCreateTag"
          >
            <Option v-for="(it, i) in tagList" :value="it.name" :key="i">{{ it.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handlePublish">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// main
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

// language
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/css/css';

// theme
import 'codemirror/theme/monokai.css';

// addon
import 'codemirror/addon/selection/active-line.js';

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js';
import 'codemirror/addon/search/searchcursor.js';

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';

// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/keymap/sublime.js';

// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';

// markdown

import hljs from 'highlight.js';
import marked from 'marked';
marked.setOptions({
  breaks: true,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

import 'github-markdown-css';
import 'highlight.js/styles/github.css';

export default {
  components: {
    codemirror
  },
  computed: {
    codemirrorRef() {
      return this.$refs.codemirror;
    }
  },
  data() {
    return {
      editType: 'add',
      code: '',
      content: '',
      markedDelay: 200,
      delayTimer: null,
      options: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        mode: 'text/x-markdown',
        theme: 'monokai',
        extraKeys: { Tab: 'autocomplete' }
      },
      categoryList: [],
      tagList: [],
      publishModal: false,
      editForm: {
        title: '',
        description: '',
        thumb: '',
        content: '',
        keywords: '',
        state: 1,
        category_id: '',
        tags: []
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.codemirrorRef.codemirror.setSize(this.codemirrorRef.$el.clientWidth + 'px', this.$refs.containerRef.clientHeight + 'px');
  },
  methods: {
    async init() {
      await this.getCategory();
      await this.getTags();
      if (this.$route.query.id) {
        this.editType = 'edit';
        await this.getArticleDetail();
      } else {
        this.editType = 'add';
        this.setDraft();
      }
    },
    setDraft() {
      let draft = window.localStorage.getItem('draft');
      if (draft) {
        this.code = draft;
      }
    },
    onCmCodeChange(newCode) {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.code = newCode;
        this.content = marked(newCode);
        // 本地化草稿
        window.localStorage.setItem('draft', newCode);
      }, this.markedDelay);
    },
    async getArticleDetail() {
      let res = await this.$http(`/article/${this.$route.query.id}`);
      this.editForm = {
        title: res.result.data.title,
        description: res.result.data.description,
        thumb: res.result.data.thumb,
        keywords: res.result.data.keywords,
        state: 1,
        category_id: res.result.data.category ? res.result.data.category.id : '',
        tags: res.result.data.tags.split(',')
      };
      this.code = res.result.data.code;
    },
    async getCategory() {
      let res = await this.$http('/category');
      this.categoryList = res.result.data;
    },
    async getTags() {
      let res = await this.$http('/tag');
      this.tagList = res.result.data;
    },
    async handleCreateTag(val) {
      let res = await this.$http({
        url: '/tag',
        method: 'post',
        data: { name: val }
      });
    },
    async handlePublish() {
      let req = {
        ...this.editForm
      };
      req.tags = req.tags.join(',');
      req.code = this.code;
      req.content = this.content;
      let res = await this.$http({
        url: this.editType == 'add' ? '/article' : `/article/${this.$route.query.id}`,
        method: this.editType == 'add' ? 'post' : 'put',
        data: req
      });
      if (res.status == 'success') {
        this.handlePublish = false;
        this.$Message.success(this.editType == 'add' ? '发布成功' : '修改成功');
        window.localStorage.setItem('draft', '');
        this.$router.push('/article');
      } else {
        this.$Message.error(res.message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#Writing {
  width: calc(100vw - 286px);
  height: calc(100vh - 119px);
  .sider {
    height: 50px;
    line-height: 50px;
    width: 100%;
    position: relative;
    .right {
      position: absolute;
      right: 0;
      padding: 0 10px;
    }
  }
  .container {
    width: 100%;
    height: calc(100vh - 119px - 50px);
    display: flex;
  }
  .codemirror {
    width: 50%;
  }
  .show {
    margin: auto;
    width: 50%;
    background-color: #fff;
    height: 100%;
  }
}
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
  overflow-y: scroll;
  height: 100%;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
