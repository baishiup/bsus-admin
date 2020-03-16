import Home from '../views/Home';
import Category from '../views/Category';
import Article from '../views/Article';
import Writing from '../views/Writing';

import { DesktopOutlined, PaperClipOutlined, EditOutlined, FolderOpenOutlined } from '@ant-design/icons';

type routes = {
  name: string;
  path: string;
  component: any;
  invisibleMenu?: undefined | Boolean;
  icon?: any;
};

const routes: Array<routes> = [
  {
    name: '首页',
    path: '/',
    component: Home,
    icon: DesktopOutlined
  },
  {
    name: '写文章',
    path: '/writing',
    invisibleMenu: true,
    component: Writing
  },
  {
    name: '文章管理',
    path: '/article',
    component: Article,
    icon: FolderOpenOutlined
  },
  {
    name: '分类管理',
    path: '/category',
    component: Category,
    icon: PaperClipOutlined
  }
];

export default routes;
