// @zgz

<template>
  <div id="c0" class="c-0">
    <!-- modal的拖动是通过修改top、left实现，效率不高 -->
    <vxe-modal
      v-model="modal"
      id="myModal6"
      width="200"
      height="100"
      min-width="50"
      min-height="50"
      resize
      remember
      storage
      transfer
      style="z-index: 999"
      :lockView="false"
      :mask="false" 
    >
      <template v-slot:title>
        <span>title</span>
      </template>
      <template v-slot>
        <span>zgz</span>
      </template>
    </vxe-modal>

    <div id="container"></div>
  </div>
</template>
<script>
/* eslint-disable */

import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
export default {
  components: {},
  props: [],
  data() {
    return {
      modal: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {

    const container = document.getElementById('container')
    const bpEarth = document.getElementById('bpEarth')

    let camera, scene, renderer, labelRenderer;

    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();

    let moon;

    init();
    animate();

    function init() {
      const EARTH_RADIUS = 1;
      const MOON_RADIUS = 0.27;

      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        200
      );
      camera.position.set(10, 5, 20);

      scene = new THREE.Scene();

      scene.background = new THREE.Color(0xf0f0f0);

      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(0, 0, 1);
      scene.add(dirLight);

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      //

      const earthGeometry = new THREE.SphereBufferGeometry(
        EARTH_RADIUS,
        16,
        16
      );
      const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load("/textures/planets/earth_atmos_2048.jpg"),
        specularMap: textureLoader.load(
          "/textures/planets/earth_specular_2048.jpg"
        ),
        normalMap: textureLoader.load(
          "/textures/planets/earth_normal_2048.jpg"
        ),
        normalScale: new THREE.Vector2(0.85, 0.85),
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      const moonGeometry = new THREE.SphereBufferGeometry(MOON_RADIUS, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load("/textures/planets/moon_1024.jpg"),
      });
      moon = new THREE.Mesh(moonGeometry, moonMaterial);
      scene.add(moon);

      //

      const earthDiv = document.createElement("div");
      // @zgz
      earthDiv.id = "earth"
      earthDiv.className = "label";
      earthDiv.textContent = "Earth";
      earthDiv.style.marginTop = "-1em";
      const earthLabel = new CSS2DObject(earthDiv);
      earthLabel.position.set(0, EARTH_RADIUS, 0);
      earth.add(earthLabel);

      const moonDiv = document.createElement("div");
      // @zgz
      moonDiv.id = "moon"
      moonDiv.className = "label";
      moonDiv.textContent = "Moon";
      moonDiv.style.marginTop = "-1em";
      const moonLabel = new CSS2DObject(moonDiv);
      moonLabel.position.set(0, MOON_RADIUS, 0);
      moon.add(moonLabel);

      // @zgz
      console.log(container.clientWidth, container.clientHeight)
      console.log(container.clientTop, container.clientLeft)
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = container.clientTop;
      renderer.domElement.style.left = container.clientLeft;
      container.appendChild(renderer.domElement);

      // @zgz
      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(container.clientWidth, container.clientHeight);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = container.clientTop;
      labelRenderer.domElement.style.left = container.clientLeft;
      container.appendChild(labelRenderer.domElement);

      const controls = new OrbitControls(camera, labelRenderer.domElement);
      controls.minDistance = 5;
      controls.maxDistance = 100;

      //

      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);

      labelRenderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // @zgz

    }

  },
  methods: {
  },
};
</script>
<style scoped>

#app {
  height: 0;
  margin: 0!important;
}

.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
}

#container {
  width: 400px;
  height: 300px;
  border: solid red 1px;
  z-index: 1;
}

</style>
