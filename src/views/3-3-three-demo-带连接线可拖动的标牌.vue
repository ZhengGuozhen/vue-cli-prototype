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

    <div class="drag-box drag-box-translate3d" id="matrixDragBox">
      Matrix Drag
    </div>
    <div class="drag-box drag-box-translate3d" id="matrixDragBox2">
      Matrix Drag2
    </div>
    <div class="drag-box drag-box-absolute" id="absoluteDragBox">
      Absolute Drag
    </div>
    <div class="drag-box drag-box-absolute" id="absoluteDragBox2">
      Absolute Drag2
    </div>

    <div id="jsplumb1" class="item">jsplumb1</div>
    <div id="jsplumb2" class="item">jsplumb2</div>
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

import dragMatrix from "./drag/drag.matrix";
import dragAbsolute from "./drag/drag.absolute";

import { jsPlumb } from "jsplumb";

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


    dragMatrix(document.getElementById("matrixDragBox"));
    dragMatrix(document.getElementById("matrixDragBox2"));
    dragAbsolute(document.getElementById("absoluteDragBox"));
    dragAbsolute(document.getElementById("absoluteDragBox2"));



//////////////////////////////////////////////////////////////////
    let camera, scene, renderer, labelRenderer;

    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();

    let earth, moon;

    init();
    animate();

    function init() {
      const EARTH_RADIUS = 1;
      const MOON_RADIUS = 0.27;

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      camera.position.set(10, 5, 20);

      scene = new THREE.Scene();

      scene.background = new THREE.Color(0xaaaaaa);

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
      earth = new THREE.Mesh(earthGeometry, earthMaterial);
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
      earthDiv.id = "earth";
      earthDiv.className = "label";
      earthDiv.textContent = "Earth";
      earthDiv.style.marginTop = "-1em";
      const earthLabel = new CSS2DObject(earthDiv);
      earthLabel.position.set(0, EARTH_RADIUS, 0);
      earth.add(earthLabel);

      const moonDiv = document.createElement("div");
      // @zgz
      moonDiv.id = "moon";
      moonDiv.className = "label";
      moonDiv.textContent = "Moon";
      moonDiv.style.marginTop = "-1em";
      const moonLabel = new CSS2DObject(moonDiv);
      moonLabel.position.set(0, MOON_RADIUS, 0);
      moon.add(moonLabel);

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = "0px";
      document.body.appendChild(labelRenderer.domElement);

      const controls = new OrbitControls(camera, labelRenderer.domElement);
      controls.minDistance = 5;
      controls.maxDistance = 100;

      //

      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      earth.position.set(Math.sin(elapsed) * 2, 0, Math.cos(elapsed) * 5);
      moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // @zgz
      const el = document.getElementById("earth");
      const el2 = document.getElementById("jsplumb1");
      // console.log(document.getElementById('moon').style.transform)
      // const t = el.style.transform
      // document.getElementById('absoluteDragBox2').style.transform = t
      // document.getElementById('jsplumb2').style.transform = t

      // console.log(document.getElementById('earth').style.transform)
      // let a = window.getComputedStyle(document.getElementById('earth')).transform
      // console.log(a)

      var style = window.getComputedStyle(el);
      var matrix = new WebKitCSSMatrix(style.transform);
      // console.log('matrix: ', matrix);
      // console.log('translateX: ', matrix.m41);
      // console.log('translateY: ', matrix.m42);
      // el2.style.top = matrix.m42 + 'px'
      // el2.style.left = matrix.m41 + 'px'
      el2.style.transform = el.style.transform;

      if (el.conn) {
        // console.log(el.conn.connector);
        // console.log(el.conn.connector.svg.style.transform)
        // console.log(el.style.transform)
        // el.conn.connector.svg.style.transform = el.style.transform;
        el.conn.connector.svg.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px)`;
      }

    }
//////////////////////////////////////////////////////////////////



    // @zgz
    this.plumbIns = jsPlumb.getInstance();
    const that = this.plumbIns;
    this.plumbIns.ready(function () {
      // that.connect({
      //   source:  'jsplumb1' ,
      //   target:  'jsplumb2' ,
      //   endpoint: 'Rectangle',
      // })
      // that.draggable('jsplumb1')
      // that.draggable('jsplumb2')

      var conn = that.connect({
        source: "earth",
        target: "jsplumb1",
        endpoint: "Blank",
        anchor: ["Center"],
        connector: ["Straight"],
      });
      that.draggable("earth");
      that.draggable("jsplumb1");
      that.draggable('jsplumb2')

      document.getElementById("earth").conn = conn;
      // console.log(document.getElementById('earth'))
      // console.log(conn.connector.svg.style)
    });


    
  },
  methods: {},
};
</script>

<style>
#app {
  height: 0;
  margin: 0 !important;
}

.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
}

.drag-box {
  width: 50px;
  border: solid red 1px;
  z-index: 999;
}

.drag-box-translate3d {
  transform: translate3d(0, 0, 1px);
  -moz-transform: translate3d(0, 0, 1px);
  -webkit-transform: translate3d(0, 0, 1px);
  will-change: transform;
  -moz-will-change: transform;
  -webkit-will-change: transform;
}
.drag-box-absolute {
  position: absolute;
  left: 0;
  top: 0;
  will-change: top, left;
  -moz-will-change: top, left;
  -webkit-will-change: top, left;
}
#matrixDragBox {
  /* left: 150px; */
  display: none;
}
#matrixDragBox2 {
  /* left: 200px; */
  display: none;
}
#absoluteDragBox {
  left: 100px;
}
#absoluteDragBox2 {
  left: 0;
}

.item {
  width: 50px;
  border: solid red 1px;
  position: absolute;
  left: 0px;
  z-index: 999;
}
#jsplumb1 {
  left: 0px;
}
#jsplumb2 {
  left: 100px;
}
</style>
