<template>
  <div class="pbody">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
export default {
  name: 'cesium-earth',
  data() {
    return {};
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
        terrainProvider: new Cesium.createWorldTerrain(), // 世界地形
        selectionIndicator: false, // 追踪entity
        infoBox: false // 默认弹窗
      };

      const viewer = new Cesium.Viewer('cesiumContainer', viewerOption);
      // viewer.scene.globe.enableLighting = true;
      // viewer.scene.globe.depthTestAgainstTerrain = true; // 防止模型漂移
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权
      window.viewer = viewer;

      this.initCameraEnd();
      this.initScenePick();
      this.initClickHandle();
      this.initMoveHandle();
      this.loadGeojson('china');

      // 飞行至指定位置
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(113.42192637406042, 29.96121312975188, 10864227.521069918),
        orientation: {
          heading: 6.166585806532539,
          pitch: -1.547499811469332,
          roll: 0
        }
      });
    },
    loadGeojson(key) {
      const url = '../static/data/' + key + '.json';
      viewer.dataSources.removeAll();
      // viewer.entities.removeAll();
      const promise = Cesium.GeoJsonDataSource.load(url);
      promise.then(dataSource => {
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        const colorHash = {};
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          const name = entity.name;
          const color = colorHash[name];
          if (!color) {
            color = Cesium.Color.fromRandom({
              alpha: 0
            });
            colorHash[name] = color;
          }
          entity.pickType = key;
          entity.polygon.material = color;
          entity.polygon.outline = true;
          (entity.polygon.outlineWidth = 100), (entity.polygon.outlineColor = Cesium.Color.fromBytes(0, 173, 255, 255));
          entity.polygon.extrudedHeight = 10000.0;
          // viewer.entities.add(entity)
        }
      });
      key !== 'china' ? viewer.flyTo(promise) : null;
    },
    initClickHandle() {
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(movement => {
        const pick = viewer.scene.pick(movement.position);
        if (Cesium.defined(pick) && pick.id.pickType === 'china') {
          const adcode = pick.id.properties.adcode._value;
          const name = pick.id.properties.name._value;
          alert(name);
          this.loadGeojson(adcode);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    initMoveHandle() {
      debugger
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(movement => {
        const pick = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pick) && pick.id.pickType === 'china') {
          const entity = pick.id;
          const name = entity.properties.name._value;
          if (this.focusEntity) {
            if (this.focusEntity.id === entity.id) return;
          }
          const color = Cesium.Color.fromRandom({
            alpha: 0
          });
          const entities = viewer.dataSources._dataSources[0].entities.values
          // const entities = viewer.entities.values;
          entities.map((_entity) => {
            _entity.polygon.material = color;
          })
          const HldColor = Cesium.Color.YELLOW;
          entity.polygon.material = HldColor;
          this.focusEntity = entity;
        } else if(this.focusEntity) {
          // const color = Cesium.Color.fromRandom({
          //   alpha: 0
          // });
          // this.focusEntity.polygon.material = color;
          // this.focusEntity = null
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
