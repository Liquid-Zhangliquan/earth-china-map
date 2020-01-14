<template>
  <div class="main">
    <div id="map"></div>
  </div>
</template>

<script>
import * as maptalks from 'maptalks';
// import * as THREE from 'three';
// import GLTFLoader from 'three-gltf-loader';
import { ThreeLayer } from 'maptalks.three';
export default {
  name: 'maptalks-three',
  data() {
    return {
      polygons: [],
      limitLines: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      debugger;
      const map = new maptalks.Map('map', {
        center: [116.96331820577404, 36.256177496939216],
        zoom: 15,
        pitch: 64,
        bearing: -48,
        attribution: false,
        doubleClickZoom: false,
        baseLayer: new maptalks.TileLayer('googlemap', {
          style: 'Satellite',
          urlTemplate: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
        })
      });
      window.MlogMap = map;
      map.on('zoomend', e => {});
      const threeLayer = new ThreeLayer('t', {
        forceRenderOnMoving: true,
        forceRenderOnZooming: true,
        forceRenderOnRotating: true,
        opacity: 0.6
      }).addTo(map);
      threeLayer.prepareToDraw = function(gl, scene, camera) {
        // const light = new THREE.DirectionalLight(new THREE.Color('rgb(255, 255, 255)'));
        // light.position.set(-1, 0, 1);
        gl.setPixelRatio(window.devicePixelRatio);
        scene.add(new THREE.AmbientLight(0xffffff));// soft white light
        // 加载 glTF 格式的模型
        let loader = new THREE.GLTFLoader(); /*实例化加载器*/

        loader.load(
          './static/data/dxg.glb',
          function(obj) {
            console.log(obj);
            const v = threeLayer.coordinateToVector3(new maptalks.Coordinate(116.96331820577404, 36.256177496939216));
            obj.scene.position.x = v.x;
            obj.scene.position.y = v.y;
            obj.scene.position.z = 0;
            obj.scene.rotateX(Math.PI / 2.);
            scene.add(obj.scene);
            threeLayer.renderScene();
          },
          function(xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          function(error) {
            console.log('load error!' + error);
          }
        );
      };
    }
  }
};
</script>

<style>
.main {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  background: url('../assets/images/bg.jpg') 50% no-repeat;
  background-size: cover;
}
#map {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
