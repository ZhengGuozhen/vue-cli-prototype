// @zgz

<template>
  <div id="container"></div>
</template>
<script>
/* eslint-disable */

import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

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
    let container = document.getElementById("container");

    let WIDTH = container.offsetWidth;
    let HEIGHT = container.offsetHeight;
    let aspect = WIDTH / HEIGHT;
    // console.log("container size", WIDTH, HEIGHT);

    let camera, scene, renderer, css2dRenderer;

    const clock = new THREE.Clock();

    let controls;

    let MOUSE = {};

    let data = [[], []];
    let dataObjects = [];

    let groupCoordinate = new THREE.Group();

    // 数据x值与world坐标之间的转换，线性关系
    let DATA_WORLD = {
      // world.x = data.x * a + b
      a: 1,
      b: 0,
    };
    function dataToWorld_x(x) {
      return x * DATA_WORLD.a + DATA_WORLD.b;
    }
    function worldToData_x(x) {
      return (x - DATA_WORLD.b) / DATA_WORLD.a;
    }
    function dataToWorld_y(y) {
      // y = 1,2,3...
      return (HEIGHT / 2 / (data.length + 1)) * y;
    }

    // 测试数据
    for (let i = 0; i < 1000; i++) {
      data[0].push({ x: i * 100, y: 1 });
    }
    for (let i = 0; i < 10; i++) {
      data[1].push({ x: i * 10, y: 2 });
    }

    init();
    animate();

    function init() {
      // 透视相机
      // camera = new THREE.PerspectiveCamera(
      //   45,
      //   window.innerWidth / window.innerHeight,
      //   1,
      //   100000
      // );

      // 正交相机
      camera = new THREE.OrthographicCamera(
        WIDTH / -2,
        WIDTH / 2,
        HEIGHT / 2,
        HEIGHT / -2,
        0.001,
        100000
      );

      // 重要一行，设置后controls的rotation操作围绕z轴
      camera.up.set(0, 0, 1);

      camera.position.set(0, 0, 1000);

      scene = new THREE.Scene();

      // 背景颜色
      scene.background = new THREE.Color(0xf0f0f0);

      // const dirLight = new THREE.DirectionalLight(0xffffff);
      // dirLight.position.set(0, 0, 1);
      // scene.add(dirLight);

      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      // const axesHelper = new THREE.AxesHelper(1000);
      // scene.add(axesHelper);

      // 网格
      const grid = new THREE.GridHelper(WIDTH, 10);
      grid.rotation.x = Math.PI / 2.0;
      grid.position.x = WIDTH / 2;
      // scene.add(grid);

      // 物体公用资源
      const texture = new THREE.TextureLoader().load(
        // "/textures/planets/earth_atmos_4096.jpg"
        "/image/flag_cn.png"
      );
      const geometry = new THREE.BoxGeometry(
        WIDTH / 20,
        WIDTH / 20,
        WIDTH / 20
      );
      const material = new THREE.MeshBasicMaterial({ map: texture });

      // 新建data对应的object
      data.flat(1).forEach((d) => {
        let mesh = new THREE.Mesh(geometry, material);

        // object内保存数据
        mesh.__data = d;

        scene.add(mesh);

        dataObjects.push(mesh);
      });
      updateDataObject();

      // 坐标系
      {
        const material = new THREE.LineBasicMaterial({
          color: 0x000000,
        });

        // y轴
        const yAxis = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, HEIGHT / 2, 0),
            new THREE.Vector3(0, -HEIGHT / 2, 0),
          ]),
          material
        );
        groupCoordinate.add(yAxis);

        // 时间轴
        const xAxis = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-WIDTH / 2, 0, 0),
            new THREE.Vector3(WIDTH / 2, 0, 0),
          ]),
          material
        );
        groupCoordinate.add(xAxis);

        // 类目轴
        const dataNum = data.length;
        for (let i = 0; i < dataNum; i++) {
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-WIDTH / 2, 0, 0),
              new THREE.Vector3(WIDTH / 2, 0, 0),
            ]),
            material
          );
          line.position.y = (HEIGHT / 2 / (dataNum + 1)) * (i + 1);

          // 标签
          const label = document.createElement("div");
          label.id = "category" + i;
          label.className = "categoryLabel";
          label.textContent = label.id;
          const labelObject = new CSS2DObject(label);
          labelObject.position.set(0, 0, 0);
          line.add(labelObject);

          groupCoordinate.add(line);
        }

        // 刻度
        const markNum = 13; // 奇数
        const materialMark = new THREE.LineBasicMaterial({
          color: 0xff0000,
        });
        for (let i = 0; i < markNum; i++) {
          const mark = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, HEIGHT / 50, 0),
              new THREE.Vector3(0, 0, 0),
            ]),
            materialMark
          );
          mark.position.x = -WIDTH / 2 + (WIDTH / (markNum + 1)) * (i + 1);

          // 刻度标签
          const markLabel = document.createElement("div");
          markLabel.id = "mark" + i;
          markLabel.className = "markLabel";
          markLabel.textContent = markLabel.id;
          const markLabelObject = new CSS2DObject(markLabel);
          markLabelObject.position.set(0, -10, 0);
          mark.add(markLabelObject);
          mark.__type = "mark";
          mark.__label = markLabelObject;

          groupCoordinate.add(mark);
        }

        scene.add(groupCoordinate);
      }

      //
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      container.appendChild(renderer.domElement);

      css2dRenderer = new CSS2DRenderer();
      css2dRenderer.setSize(WIDTH, HEIGHT);
      css2dRenderer.domElement.style.position = "absolute";
      css2dRenderer.domElement.style.top = "0";
      css2dRenderer.domElement.style.left = "0";
      container.appendChild(css2dRenderer.domElement);

      // 自行实现control
      // controls = new OrbitControls(camera, css2dRenderer.domElement);
      // controls.enableRotate = false;
      // controls.enableZoom = false;

      //

      window.addEventListener("resize", onWindowResize, false);

      container.addEventListener("wheel", onWheel);
      container.addEventListener("mousedown", onMousedown);
      container.addEventListener("mousemove", onMousemove);
      container.addEventListener("mouseup", onMouseup);
    }

    // 更新object位置
    function updateDataObject() {
      dataObjects.forEach((mesh) => {
        mesh.position.set(
          dataToWorld_x(mesh.__data.x),
          dataToWorld_y(mesh.__data.y),
          0
        );
      });
    }

    // 更新刻度值
    function updateMark() {
      // console.log(groupCoordinate);
      groupCoordinate.children.forEach((v) => {
        // console.log(v.labelObject)
        if (v.__type === "mark") {
          let x = groupCoordinate.localToWorld(v.position.clone()).x;
          v.__label.element.textContent = worldToData_x(x).toFixed(2);
        }
      });
    }

    function onWheel(e) {
      // 缩放x轴

      let d = e.wheelDelta;

      // 更新线性关系
      if (d < 0) {
        DATA_WORLD.a /= 1.1;
      } else {
        DATA_WORLD.a *= 1.1;
      }
      
      // 更新物体位置
      updateDataObject();

      // 更新camera位置
      if (d < 0) {
        camera.position.x /= 1.1;
      } else {
        camera.position.x *= 1.1;
      }
      camera.position.y = 0;
      camera.position.z = 1000;
      camera.updateProjectionMatrix();

      // 坐标系绘图在屏幕的位置不变
      groupCoordinate.position.x = camera.position.x;
      updateMark();
    }

    function onMousedown(e) {
      MOUSE.mousedown = true;
      MOUSE.x = e.clientX;
      MOUSE.y = e.clientY;
      MOUSE.cameraX = camera.position.x;
    }

    function onMousemove(e) {
      
      // 拖动
      if (MOUSE.mousedown) {
        let dx = e.clientX - MOUSE.x;
        // console.log(dx)

        camera.position.x = MOUSE.cameraX - dx;
        camera.updateProjectionMatrix();

        // 坐标系绘图在屏幕的位置不变
        groupCoordinate.position.x = camera.position.x;
        updateMark();
      }
    }

    function onMouseup(e) {
      MOUSE.mousedown = false;
    }

    function onWindowResize() {
      WIDTH = container.offsetWidth;
      HEIGHT = container.offsetHeight;
      aspect = WIDTH / HEIGHT;

      renderer.setSize(WIDTH, HEIGHT);
      css2dRenderer.setSize(WIDTH, HEIGHT);

      camera.left = WIDTH / -2;
      camera.right = WIDTH / 2;
      camera.top = HEIGHT / 2;
      camera.bottom = HEIGHT / -2;
      camera.updateProjectionMatrix();
    }

    // todo 改为按需渲染
    function animate() {
      requestAnimationFrame(animate);

      // const elapsed = clock.getElapsedTime();
      // moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

      renderer.render(scene, camera);
      css2dRenderer.render(scene, camera);

      // controls.update();
    }
  },
  methods: {},
};
</script>
<style scoped>
#container {
  width: 100%;
  height: 100vh;
}

#container >>> .categoryLabel {
  border: solid red 1px;
  background: gray;
}
</style>
