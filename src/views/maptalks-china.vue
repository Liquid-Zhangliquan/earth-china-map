<template>
  <div id="cesiumContainer"></div>
</template>

<script>

export default {
  name: 'maptalks-china',
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.cesiumInit();
    },
    cesiumInit() {
      const viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: false, // 底图切换控件
        animation: false, // 控制场景动画的播放速度控件
        terrainProvider: new Cesium.createWorldTerrain() // 世界地形
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url:
        //     "https://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=39a4ceb78b2abd7a076551494f1c4fd0",
        //   layer: "tdtImgBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false
        // })
        // infoBox : false,
        // selectionIndicator : false,
        // shadows : true,
        // shouldAnimate : true
      };

      const viewer = new Cesium.Viewer('cesiumContainer', viewerOption);
      viewer.scene.globe.enableLighting = true;
      // viewer.scene.globe.depthTestAgainstTerrain = true; // 防止模型漂移
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权
      this.viewer = viewer;
      window.viewer = viewer;

      this.initCameraEnd();
      this.initScenePick();

      // 飞行至指定位置
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(currentView.lon, currentView.lat, currentView.height),
        orientation: currentView.orientation
      });
    },
    initCameraEnd() {
      this.camera = viewer.camera;
      viewer.scene.camera.moveEnd.addEventListener(evt => {
        const camera = this.camera;
        const heading = camera.heading;
        const pitch = camera.pitch;
        const roll = camera.roll;
        const position = camera.position;
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        console.log(longitude + ',' + latitude + ',' + height + ',' + heading + ',' + pitch + ',' + roll);
      });
    },
    initScenePick() {
      const me = this;
      const scene = viewer.scene;
      const points = [];
      const points2 = [];
      const points3 = [];
      const positions = [];
      this.sceneEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      this.sceneEventHandler.setInputAction(movement => {
        const ray = viewer.camera.getPickRay(movement.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        const worldPostion = scene.pickPosition(movement.position);
        const cartographic1 = Cesium.Cartographic.fromCartesian(worldPostion);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
};
</script>

<style>
.pbody {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
#cesiumContainer {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
