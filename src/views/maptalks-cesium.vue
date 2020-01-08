<template>
  <div class="main">
    <div id="map"></div>
  </div>
</template>

<script>
import * as maptalks from 'maptalks';
// import { CesiumLayer } from "./lib/maptalks/maptalks.cesium";
const edgeColor = '#4682B4';
const polygonColors = ['#C0C0C0', '#058bde'];
const altitude = 35000;
export default {
  name: 'maptalks-china',
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
      const map = new maptalks.Map('map', {
        center: [111.13810910424957, 36.04256912706856],
        zoom: 5,
        pitch: 45,
        bearing: -10.8,
        attribution: false,
        doubleClickZoom: false
        // baseLayer: new maptalks.TileLayer('base', {
        //   urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        //   subdomains: ['a', 'b', 'c', 'd'],
        //   attribution: false
        // })
      });
      window.MlogMap = map;
      map.on('zoomend', e => {

      });
    },
    
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
