// @zgz

<template>
  <div class="d3-demo-7-1"></div>
</template>
<script>
import * as d3 from "d3";
const data = [99, 71, 78, 25, 36, 92];
export default {
  components: {},
  props: [],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", 500)
      .attr("height", 270)
      .append("g")
      .attr("transform", "translate(0, 10)");
    const x = d3.scaleLinear().range([0, 430]);
    const y = d3.scaleLinear().range([210, 0]);
    d3.axisLeft().scale(x);
    d3.axisTop().scale(y);
    x.domain(d3.extent(data, (d, i) => i));
    y.domain([0, d3.max(data, (d) => d)]);
    const createPath = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d));
    svg.append("path").attr("d", createPath(data));
  },
  methods: {},
};
</script>
<style scoped>
</style>
<style lang="scss">
// 避免class名称污染
.d3-demo-7-1 svg {
  margin: 25px;
  path {
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
  }
}
</style>
