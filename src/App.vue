<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->

      <router-link
        v-for="item in views"
        :key="item.path"
        :to="item.path"
        >{{ item.name }}</router-link
      >
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      views: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    // 根据views路径下的vue文件生成router-link
    const modulesFiles = require.context("./views", true, /\.vue$/);
    const modules = modulesFiles.keys().reduce((modules, modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
      const value = modulesFiles(modulePath);
      modules[moduleName] = value.default;
      return modules;
    }, {});
    Object.keys(modules).forEach((k) => {
      this.views.push({
        path: "/" + k,
        name: k,
      });
    });
    // console.log(this.views);
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  background: skyblue;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
