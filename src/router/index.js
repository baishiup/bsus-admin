import Vue from 'vue';
import Router from 'vue-router';
import verify from './verify';

Vue.use(Router);

export const routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: '/',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页', iconType: 'ios-home' }
      },
      {
        path: '/writing',
        component: () => import('../views/Writing.vue'),
        meta: { title: '写文章', iconType: 'ios-brush' }
      },
      {
        path: '/article',
        component: () => import('../views/Article.vue'),
        meta: { title: '文章管理', iconType: 'ios-paper' }
      },
      {
        path: '/category',
        component: () => import('../views/Category.vue'),
        meta: { title: '分类管理', iconType: 'ios-keypad' }
      }
    ]
  }
];

export const listRoutes = _ => {
  return JSON.parse(JSON.stringify(routes))
    .reduce((a, b) => {
      return a.concat(b.children && b.children.length ? b.children : b);
    }, [])
    .filter(x => x.path !== '/login');
};

export const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  verify(to, from, next);
});
