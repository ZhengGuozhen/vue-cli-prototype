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
    const cameraInitial = 0.2;

    // console.log('container size', WIDTH, HEIGHT);

    let camera, scene, renderer, css2dRenderer;

    const clock = new THREE.Clock();

    let controls;

    let MOUSE = {};

    let data = [];

    init();
    animate();

    function init() {
      // camera = new THREE.PerspectiveCamera(
      //   45,
      //   window.innerWidth / window.innerHeight,
      //   1,
      //   100000
      // );

      camera = new THREE.OrthographicCamera(
        WIDTH / -2,
        WIDTH / 2,
        HEIGHT / 2,
        HEIGHT / -2,
        0.001,
        100000
      );

      // 重要一行，设置后controls的rotation操作围绕z轴
      camera.up.set( 0, 0, 1 );

      camera.position.set(0, 0, 1000);

      scene = new THREE.Scene();

      scene.background = new THREE.Color(0xf0f0f0);

      // const dirLight = new THREE.DirectionalLight(0xffffff);
      // dirLight.position.set(0, 0, 1);
      // scene.add(dirLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const axesHelper = new THREE.AxesHelper(1000);
      scene.add(axesHelper);

      const grid = new THREE.GridHelper(WIDTH, 10);
      scene.add(grid);
      grid.rotation.x = Math.PI / 2.0
      grid.position.x = WIDTH / 2

      //
      const texture = new THREE.TextureLoader().load(
        "/textures/planets/earth_atmos_4096.jpg"
      );
      const geometry = new THREE.BoxGeometry(WIDTH/100, WIDTH/100, WIDTH/100);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      for (let i = 0; i < 10000; i++) {
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position.set(i * 10, Math.sin(i/100) * 100, 0);

        data.push(mesh)
      }

      //

      // css2d
      // const earthDiv = document.createElement("div");
      // earthDiv.id = "earth"
      // earthDiv.className = "label";
      // earthDiv.textContent = "Earth";
      // earthDiv.style.marginTop = "-1em";
      // const earthLabel = new CSS2DObject(earthDiv);
      // earthLabel.position.set(0, EARTH_RADIUS, 0);
      // earth.add(earthLabel);

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
    
    function onWheel(e) {
      // console.log(e.wheelDelta)

      let d = e.wheelDelta

      data.forEach(v => {
        if (d < 0) {
          v.position.x /= 1.1
        } else {
          v.position.x *= 1.1
        }
      });

      if (d < 0) {
        camera.position.x /= 1.1
      } else {
        camera.position.x *= 1.1
      }
      camera.position.y = 0
      camera.position.z = 1000
      camera.updateProjectionMatrix()
    }

    function onMousedown(e) {
      // console.log(e)

      MOUSE.mousedown = true
      MOUSE.x = e.clientX
      MOUSE.y = e.clientY
      MOUSE.cameraX = camera.position.x
    }

    function onMousemove(e) {
      // console.log(e)

      let dx = 0
      if (MOUSE.mousedown) {
        // draging

        dx = e.clientX - MOUSE.x

        // console.log(dx)

        camera.position.x = MOUSE.cameraX - dx
        camera.updateProjectionMatrix()
      }
    }

    function onMouseup(e) {
      // console.log(e)
      MOUSE.mousedown = false
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
</style>
