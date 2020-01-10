<template>
  <div class="main">
    <div id="map"></div>
  </div>
</template>

<script>
import * as maptalks from 'maptalks';
import { CesiumLayer } from '../lib/maptalks/maptalks.cesium';
export default {
  name: 'maptalks-cesium',
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
      debugger
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
      const cesiumLayer = new CesiumLayer("cesium", { gray: false }).addTo(map);
      //获取cesium scene对象
      const scene = cesiumLayer.getCesiumScene();
      console.log(Cesium)

      const maptms = new Cesium.createTileMapServiceImageryProvider({
        url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
      });
      scene.imageryLayers.addImageryProvider(maptms);

      // 加载terrain高程数据
      scene.terrainProvider = new Cesium.createWorldTerrain();
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
