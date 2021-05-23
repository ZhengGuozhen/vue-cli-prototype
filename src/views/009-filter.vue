<template>
  <div class='c-0'>
    <div class='category' v-for="category in data" :key="category.name">
      <div>{{category.name}}</div>

      <div class="items">
        <div class='item' v-for="item in category.items" :key="item.name">
          <div :style="{background:item.value?'red':'white'} " @click="itemClick(category, item)">{{item.name}}</div>
        </div>
      </div>

      <el-button @click="test">test</el-button>

    </div>
  </div>
</template>
<script>

export default {
  components: {},
  props: [],
  data() {
    return {
      data: [
        {
          name: '类别1',
          type: 'enum',
          items: [
            {
              name: '111',
              default: true,
              value: true,
            },
             {
              name: '222',
              default: true,
              value: true,
            }
          ]
        },
         {
          name: '类别2',
          type: 'enum',
          items: [
            {
              name: '33',
              default: false,
              value: false,
            },
             {
              name: '44',
              default: false,
              value: false,
            }
          ]
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    itemClick(category, item) {
      console.error(category.name, item.name)
      item.value = !item.value
    },
    test() {
      this.data[0].items[0].value = !this.data[0].items[0].value
    }
  },
};
</script>
<style lang="scss" scoped>

.category {
  border: solid red 1px;

  display: flex;
  flex-direction: column;

  .items {
    display: flex;
    flex-direction: row;

    .item {
      border: solid red 1px;
      margin: 10px;
    }
    
  }
}
</style>
