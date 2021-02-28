// @zgz

<template>
  <div></div>
</template>
<script>
/* eslint-disable */

import * as THREE from "three/build/three.module.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    let camera, scene, renderer;

    let mouseX = 0,
      mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
      const container = document.createElement("div");
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      camera.position.y = 20;

      // scene

      scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      camera.add(pointLight);
      scene.add(camera);

      const grid = new THREE.GridHelper(10, 10);
      scene.add(grid);

      // model

      const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
      };

      const onError = function () {};

      const manager = new THREE.LoadingManager();
      manager.addHandler(/\.dds$/i, new DDSLoader());

      // comment in the following line and import TGALoader if your asset uses TGA textures
      // manager.addHandler( /\.tga$/i, new TGALoader() );

      new MTLLoader(manager)
        .setPath("/model-3d/ship_16/")
        .load("hm2.mtl", function (materials) {
          materials.preload();

          new OBJLoader(manager)
            .setMaterials(materials)
            .setPath("/model-3d/ship_16/")
            .load(
              "hm2.obj",
              function (object) {
                object.position.y = 1;
                scene.add(object);
              },
              onProgress,
              onError
            );
        });

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      // document.addEventListener( 'mousemove', onDocumentMouseMove );

      //

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) / 2;
      mouseY = (event.clientY - windowHalfY) / 2;
    }

    //

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      // camera.position.x += ( mouseX - camera.position.x ) * .05;
      // camera.position.y += ( - mouseY - camera.position.y ) * .05;

      // camera.lookAt( scene.position );

      renderer.render(scene, camera);
    }
  },
  methods: {},
};
</script>
<style scoped></style>
