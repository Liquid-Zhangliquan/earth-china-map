<template>
  <div class="pbody">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
export default {
  name: 'cesium-earth',
  data() {
    return {
      x: 113,
      viewer: null
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
      const viewer = new Cesium.Viewer('cesiumContainer', {
        //关闭地球的2D，就是只用3D
        geocoder: false, 
        homeButton: false, 
        fullscreenButton: false,
        scene3DOnly: true,
        baseLayerPicker: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        allowDataSourcesToSuspendAnimation: false,
        skyBox: new Cesium.SkyBox({
          sources: {
            positiveX: './static/skyBox/sky_px.jpg',
            negativeX: './static/skyBox/sky_mx.jpg',
            positiveY: './static/skyBox/sky_py.jpg',
            negativeY: './static/skyBox/sky_my.jpg',
            positiveZ: './static/skyBox/sky_pz.jpg',
            negativeZ: './static/skyBox/sky_mz.jpg'
          },
          show: true
        })
      });
      this.viewer = viewer;
      // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
      viewer.scene.screenSpaceCameraController.enableRotate = false;
      // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
      viewer.scene.screenSpaceCameraController.enableTranslate = false;
      // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
      viewer.scene.screenSpaceCameraController.enableZoom = false;
      // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
      viewer.scene.screenSpaceCameraController.enableTilt = false;
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权

      var initialPosition = new Cesium.Cartesian3.fromDegrees(113.42, 34.16, 32000000);
      var homeCameraView = {
        destination: initialPosition
      };
      viewer.scene.camera.setView(homeCameraView);

      this.rotate();
    },
    rotate() {
      this.x = this.x + 0.3;
      if (this.x >= 178.5) {
        this.x = -180;
      }
      this.viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(this.x, 30, 32000000)
      });
      requestAnimationFrame(this.rotate);
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
