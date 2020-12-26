import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/0-Home.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

// 根据views路径下的vue文件生成routes
const modulesFiles = require.context("../views", true, /\.vue$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
// console.log(modules);
Object.keys(modules).forEach((k) => {
  routes.push({
    path: "/" + k,
    name: k,
    component: () =>
      import(`../views/${k}.vue`),
  });
});
// console.log(routes);

const router = new VueRouter({
  routes,
});

export default router;
