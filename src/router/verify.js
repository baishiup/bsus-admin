export default (to, from, next) => {
  if (window.localStorage.getItem('token')) {
    next();
  } else {
    /\/login/.test(to.path) ? next() : next('/login');
  }
};
