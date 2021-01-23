<template>
  <div>
    <div id="container"></div>
    <div id="control"></div>
  </div>
</template>
<script>
/* eslint-disable */

import * as THREE from "three/build/three.module.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  components: {},
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
let stats;

			let scene, renderer;

			let mouseX = 0, mouseY = 0;

			let windowWidth, windowHeight;

			const views = [
				{
					left: 0,
					bottom: 0,
					width: 1,
					height: 1.0,
					background: new THREE.Color( 0.5, 0.5, 0.5 ),
					eye: [ 0, 1000, 0 ],
					up: [ 0, 1, 0 ],
					fov: 70,
					updateCamera: function ( camera, scene, mouseX ) {

					//   camera.position.x += mouseX * 0.05;
					//   camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
					//   camera.lookAt( scene.position );

					},
					controls: null
				},
				{
					left: 0,
					bottom: 0,
					width: 300,
					height: 300,
					background: new THREE.Color( 0.2, 0.2, 0.2 ),
					eye: [ 0, 1000, 0 ],
					up: [ 0, 1, 0 ],
					fov: 70,
					updateCamera: function ( camera, scene, mouseX ) {

					//   camera.position.x = 0;
					//   camera.position.y = 1000;
					//   camera.position.z = 0;
					//   camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
					//   camera.lookAt( 0,0,0 );

					},
					controls: null
				}
			];

			init();
			animate();

			function init() {

				const container = document.getElementById( 'container' );

				

				scene = new THREE.Scene();
				
				// @zgz
				const grid = new THREE.GridHelper( 1000, 1000 );
				scene.add( grid );

				const light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 0, 1 );
				scene.add( light );

				// shadow

				const canvas = document.createElement( 'canvas' );
				canvas.width = 128;
				canvas.height = 128;

				const context = canvas.getContext( '2d' );
				const gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
				gradient.addColorStop( 0.1, 'rgba(0,0,0,0.15)' );
				gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

				context.fillStyle = gradient;
				context.fillRect( 0, 0, canvas.width, canvas.height );

				const shadowTexture = new THREE.CanvasTexture( canvas );

				const shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture, transparent: true } );
				const shadowGeo = new THREE.PlaneBufferGeometry( 300, 300, 1, 1 );

				let shadowMesh;

				shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				shadowMesh.position.y = - 250;
				shadowMesh.rotation.x = - Math.PI / 2;
				scene.add( shadowMesh );

				shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				shadowMesh.position.x = - 400;
				shadowMesh.position.y = - 250;
				shadowMesh.rotation.x = - Math.PI / 2;
				scene.add( shadowMesh );

				shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				shadowMesh.position.x = 400;
				shadowMesh.position.y = - 250;
				shadowMesh.rotation.x = - Math.PI / 2;
				scene.add( shadowMesh );

				const radius = 200;

				const geometry1 = new THREE.IcosahedronBufferGeometry( radius, 1 );

				const count = geometry1.attributes.position.count;
				geometry1.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );

				const geometry2 = geometry1.clone();
				const geometry3 = geometry1.clone();

				const color = new THREE.Color();
				const positions1 = geometry1.attributes.position;
				const positions2 = geometry2.attributes.position;
				const positions3 = geometry3.attributes.position;
				const colors1 = geometry1.attributes.color;
				const colors2 = geometry2.attributes.color;
				const colors3 = geometry3.attributes.color;

				for ( let i = 0; i < count; i ++ ) {

					color.setHSL( ( positions1.getY( i ) / radius + 1 ) / 2, 1.0, 0.5 );
					colors1.setXYZ( i, color.r, color.g, color.b );

					color.setHSL( 0, ( positions2.getY( i ) / radius + 1 ) / 2, 0.5 );
					colors2.setXYZ( i, color.r, color.g, color.b );

					color.setRGB( 1, 0.8 - ( positions3.getY( i ) / radius + 1 ) / 2, 0 );
					colors3.setXYZ( i, color.r, color.g, color.b );

				}

				const material = new THREE.MeshPhongMaterial( {
					color: 0xffffff,
					flatShading: true,
					vertexColors: true,
					shininess: 0
				} );

				const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );

				let mesh = new THREE.Mesh( geometry1, material );
				let wireframe = new THREE.Mesh( geometry1, wireframeMaterial );
				mesh.add( wireframe );
				mesh.position.x = - 400;
				mesh.rotation.x = - 1.87;
				scene.add( mesh );

				mesh = new THREE.Mesh( geometry2, material );
				wireframe = new THREE.Mesh( geometry2, wireframeMaterial );
				mesh.add( wireframe );
				mesh.position.x = 400;
				scene.add( mesh );

				 mesh = new THREE.Mesh( geometry3, material );
				wireframe = new THREE.Mesh( geometry3, wireframeMaterial );
				mesh.add( wireframe );
				scene.add( mesh );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				container.appendChild( stats.dom );

				// document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				// @zgz
				{
					const view = views[ 0 ];
					const camera = new THREE.PerspectiveCamera( view.fov, view.width / view.height, 1, 10000 );
					camera.position.fromArray( view.eye );
					camera.up.fromArray( view.up );
					view.camera = camera;

					view.controls = new OrbitControls( camera, renderer.domElement );
				}
				{
					const view = views[ 1 ];
					// const camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
					let frustumSize = 3000;
					const aspect = view.width / view.height;
					const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 10000 );

					camera.position.fromArray( view.eye );
					camera.up.fromArray( view.up );
					view.camera = camera;

					// view.controls = new OrbitControls( camera, renderer.domElement );
					view.controls = new OrbitControls( camera, document.getElementById('control') );
					view.controls.enableRotate = false
				}

			}

			// function onDocumentMouseMove( event ) {

			// 	mouseX = ( event.clientX - windowWidth / 2 );
			// 	mouseY = ( event.clientY - windowHeight / 2 );

			// }

			function updateSize() {

				if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

					windowWidth = window.innerWidth;
					windowHeight = window.innerHeight;

					renderer.setSize( windowWidth, windowHeight );

				}

			}

			function animate() {

				render();
				stats.update();

				requestAnimationFrame( animate );

			}

			function render() {

				updateSize();

				{
					const view = views[ 0 ];
					const camera = view.camera;

					view.updateCamera( camera, scene, mouseX, mouseY );

					const left = Math.floor( windowWidth * view.left );
					const bottom = Math.floor( windowHeight * view.bottom );
					const width = Math.floor( windowWidth * view.width );
					const height = Math.floor( windowHeight * view.height );

					renderer.setViewport( left, bottom, width, height );
					renderer.setScissor( left, bottom, width, height );
					renderer.setScissorTest( true );
					renderer.setClearColor( view.background );

					camera.aspect = width / height;
					camera.updateProjectionMatrix();

					renderer.render( scene, camera );
        }
        {
					const view = views[ 1 ];
					const camera = view.camera;

					view.updateCamera( camera, scene, mouseX, mouseY );

					const left = view.left;
					const bottom = view.bottom;
					const width = view.width;
					const height = view.height;

					renderer.setViewport( left, bottom, width, height );
					renderer.setScissor( left, bottom, width, height );
					renderer.setScissorTest( true );
					renderer.setClearColor( view.background );

					camera.aspect = width / height;
					camera.updateProjectionMatrix();

					renderer.render( scene, camera );
				}

			}
  },
  methods: {},
};
</script>
<style scoped>
#control {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 300px;
  width: 300px;
  border: solid red 1px;
}
</style>
