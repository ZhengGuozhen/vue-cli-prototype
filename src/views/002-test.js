// 测试多个组件import同一个js
// 此js内的语句只执行一次
// 各个组件import此js后，取得的a是同一个对象

const a = {}
console.log(a)

export default a;