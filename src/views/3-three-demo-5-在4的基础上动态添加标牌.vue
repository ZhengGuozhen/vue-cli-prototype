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
      style="z-index: 999;right:0"
      :lockView="false"
      :mask="false"
    >
      <template v-slot:title>
        <span>title</span>
      </template>
      <template v-slot>
        <el-button @click="test1">test1</el-button>
        <el-button @click="test2">test2</el-button>
        <el-button @click="deleteConn">deleteConn</el-button>
        <el-button @click="addConn">addConn</el-button>
        <el-button @click="deleteItem">deleteItem</el-button>
        <el-button @click="addItem">addItem</el-button>
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
      modal: true,
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    const that = this

    // performance test

    // 优化大量div的插入性能
    // https://chrisdeo.github.io/2019/07/22/%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%A4%A7%E9%87%8FDIV%E6%8F%92%E5%85%A5%E9%97%AE%E9%A2%98/
    // var fragment = document.createDocumentFragment();
    // document.body.appendChild(fragment)

    this.tips = []
    const length = 2
    for (let i = 0; i < length; i++) {
      const d = document.createElement("div");
      d.id = "tip-" + i;
      d.className = "item";
      d.textContent = "tip-" + i;

      document.body.appendChild(d)
      // fragment.appendChild(d);

      this.tips.push(d)

      if( i >= length/2) {
        d.style.top = '100px'
      }
    }

    // 单纯拖动，jsplumb和dragAbsolute效率差不多，dragMatrix效率略高
    // for (let i = 0; i < 1000; i++) {
    //   const d = document.createElement("div");
    //   d.id = "absoluteDragBox-" + i;
    //   d.className = "item";
    //   d.textContent = "absoluteDragBox-" + i;
    //   d.style.top = '200px'

    //   document.body.appendChild(d)
    //   dragAbsolute(d);
    // }




    const tips = this.tips

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
    // 渲染一次
    function render() {
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }
    render()
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
      // earthDiv.style.marginTop = "-1em";
      const earthLabel = new CSS2DObject(earthDiv);
      // earthLabel.position.set(0, EARTH_RADIUS, 0);
      // @zgz
      earthLabel.position.set(0, 0, 0);
      earth.add(earthLabel);

      const moonDiv = document.createElement("div");
      // @zgz
      moonDiv.id = "moon";
      moonDiv.className = "label";
      moonDiv.textContent = "Moon";
      // moonDiv.style.marginTop = "-1em";
      const moonLabel = new CSS2DObject(moonDiv);
      // moonLabel.position.set(0, MOON_RADIUS, 0);
      // @zgz
      moonLabel.position.set(0, 0, 0);
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

      // earth.position.set(Math.sin(elapsed) * 2, 0, Math.cos(elapsed) * 5);
      moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // @zgz
      // 使用matrix修正连接线位置有误差
      // const el = document.getElementById("earth");
      // const el2 = document.getElementById("jsplumb1");
      // var style = window.getComputedStyle(el);
      // var matrix = new WebKitCSSMatrix(style.transform);
      // el2.style.transform = el.style.transform;
      // if (el.conn) {
      //   el.conn.connector.svg.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px)`;
      // }

      

      // performance test
      a()
    }

    function a (){
      const el = document.getElementById("earth");

      for (let i = 0; i < tips.length; i++) {
        // 这里的getComputedStyle、WebKitCSSMatrix计算耗时严重
        // tips[i].style.transform = el.style.transform;
        // var style = window.getComputedStyle(el);
        // var matrix = new WebKitCSSMatrix(style.transform);
        // if (tips[i].conn) {
        //   tips[i].conn.connector.svg.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px)`;
        // }


        tips[i].style.transform = el.style.transform;
        if (tips[i].conn) {
          // console.log(tips[i].conn)
          // console.log(tips[i].conn.connector.getDisplayElements())
          
          // tips[i].conn.connector.svg.style.transform = 'translate(50%, 50%)' + el.style.transform;
          
          let elements = tips[i].conn.connector.getDisplayElements()

          elements.forEach(e => {
            e.style.transform = 'translate(50%, 50%)' + el.style.transform;
          });
        
        }

      }


    }
//////////////////////////////////////////////////////////////////


// return

    // @zgz
    let plumbIns = jsPlumb.getInstance();
    plumbIns.ready(function () {
      that.plumbIns = plumbIns

      // plumbIns.draggable("earth");// 无效
      // plumbIns.draggable("moon");// 无效

      // var conn = plumbIns.connect({
      //   source: "earth",
      //   target: "jsplumb1",
      //   endpoint: "Blank",
      //   anchor: ["Center"],
      //   connector: ["Straight"],
      // });
      // plumbIns.draggable("jsplumb1");
      // plumbIns.draggable('jsplumb2')

      // document.getElementById("earth").conn = conn;



// 优化jsplumb速度，无明显效果
// that.setSuspendDrawing(true);
// 。。。
// that.setSuspendDrawing(false,true);

// 优化jsplumb速度，无明显效果
// var fragment = document.createDocumentFragment();
// jsPlumb.setContainer(fragment)
// 。。。
// document.body.appendChild(fragment)

// 优化jsplumb速度，无明显效果
plumbIns.batch(()=> {

      // performance test
      // source和target互换对性能影响很大
      // 同一个element作为source连接多个element会卡
      for (let i = 0; i < tips.length; i++) {
        // 都和earth连接
        var conn = plumbIns.connect({
          source: tips[i],
          target: "earth",
          endpoint: "Blank",
          // anchor: ["Center"],// 实际上会在右下角，原因暂不明确
          anchor: ["TopLeft"],// 实际上会在中间，原因暂不明确
          connector: ["Straight"],
          overlays:[ 
              [ "Label", { label:"fasdasdasdasdoo", location:0.5, id: ("asas"+i) } ]
            ],
        });
        tips[i].conn = conn;

        // 前一半和后一半连接
        // if (i < tips.length/2) {
        //   var conn = plumbIns.connect({
        //     // source: "jsplumb2",
        //     source: tips[i],
        //     // target: "earth",
        //     target: tips[i + tips.length/2],
        //     endpoint: "Blank",
        //     anchor: ["Center"],
        //     connector: ["Straight"],
        //   });

        //   tips[i].conn = conn;
        // }



        plumbIns.draggable(tips[i])

      }

})

    });// plumbIns.ready()



  },
  methods: {
    test1: function() {
    },
    test2: function() {
      document.getElementById("earth").style.top = "100px"
    },
    deleteConn: function(e) {
      // console.log(this.plumbIns)
      // console.log(this.tips[0].conn)
      // console.log(this.plumbIns.getAllConnections())

      // 删除连接线，tip还在
      this.plumbIns.deleteConnection(this.tips[0].conn);

      // 删除tip和连接线
      // this.plumbIns.remove(this.tips[0])
      // 删除后tip还在，但是调式的element中已看不到tip
      // console.log(this.tips[0])

      this.tips[0].conn = null
    },
    addConn: function(e) {
      this.tips[0].conn = this.plumbIns.connect({
        source: this.tips[0],
        target: "earth",
        endpoint: "Blank",
        anchor: ["TopLeft"],
        connector: ["Straight"],
      });
    },
    deleteItem: function(e) {
      const i = 0
      this.plumbIns.remove(this.tips[i])
      this.tips.splice(i, 1)
    },
    addItem: function(e) {
      const d = document.createElement("div");
      d.id = "tip-" + new Date();
      d.className = "item";
      d.textContent = d.id;
      document.body.appendChild(d)

      d.conn = this.plumbIns.connect({
        source: d,
        target: "earth",
        endpoint: "Blank",
        anchor: ["TopLeft"],
        connector: ["Straight"],
      });
      this.plumbIns.draggable(d)
      
      this.tips.push(d)
    }
  },
};
</script>

<style>
#app {
  height: 0;
  margin: 0 !important;
}

.label {
  /* display: none; */
  /* height: 1px; */
  /* width: 1px; */
  color: #fff;
  font-family: sans-serif;
  padding: 10px;
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
  display: none;
  left: 200px;
}
#absoluteDragBox2 {
  display: none;
  left: 0;
}

.item {
  width: 50px;
  height: 50px;
  border: solid red 1px;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 999;
}
#jsplumb1 {
  left: 0px;
}
#jsplumb2 {
  left: 100px;
}
</style>
