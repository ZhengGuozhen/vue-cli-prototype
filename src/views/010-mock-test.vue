<template>
  <div>
    <el-button @click="get">get</el-button>
    <el-button @click="post">post</el-button>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  components: {},
  props: [],
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    get() {
      axios.get('/mock/test', {
        params: {
          ID: 12345
        }
      })
      .then(function (response) {
        console.log(response);
      })
    },
    post() {
      axios.post('/mock/test', {
        data: {
          ID: 12345
        }
      })
      .then(function (response) {
        console.log(response);
      })
    }
  },
};
</script>
<style scoped></style>
