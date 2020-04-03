import Home from '../views/Home';
import Category from '../views/Category';
import Article from '../views/Article';
import Writing from '../views/Writing';
import Tag from '../views/Tag';
import Setting from '../views/Setting';

import {
  DesktopOutlined,
  SortDescendingOutlined,
  TagOutlined,
  FolderOpenOutlined,
  SettingOutlined
} from '@ant-design/icons';

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
    icon: SortDescendingOutlined
  },
  {
    name: '标签管理',
    path: '/tag',
    component: Tag,
    icon: TagOutlined
  },
  {
    name: '站点设置',
    path: '/setting',
    component: Setting,
    icon: SettingOutlined
  }
];

export default routes;
