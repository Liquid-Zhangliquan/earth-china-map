<template>
  <div class="main">
    <div id="map"></div>
  </div>
</template>

<script>
import * as maptalks from 'maptalks';
const edgeColor = '#4682B4';
const polygonColors = ['#C0C0C0', '#058bde'];
const altitude = 35000;
export default {
  name: 'maptalks-china',
  data() {
    return {
      mapKey: 'china'
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
        minZoom: 4,
        maxZoom: 9,
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
        const zoom = e.target.getZoom();
        if (zoom < 6 && this.mapKey !== 'china') {
          this.drawWall('china');
          this.drawRegion('china');
        }
      });
      this.drawWall('china');
      this.drawRegion('china');
    },
    drawLimitLines(idx, coordinates, properties) {
      const outLine = new maptalks.MultiLineString(coordinates, {
        symbol: {
          lineColor: edgeColor,
          lineWidth: 1,
          textPlacement: 'vertex'
        },
        properties: {
          altitude: altitude,
          index: idx,
          id: properties.id,
          properties: properties
        }
      });
      this.limitLines.push(outLine);
    },
    drawBorderLines(coordinates, properties) {
      let limitLines = [];
      for (let i = 0; i < 1; i++) {
        // 要素多了会影响 要素polygon 单击事件的响应
        const outLine = new maptalks.MultiLineString(coordinates, {
          symbol: {
            lineColor: '#44A8E9',
            lineWidth: i * 0.2,
            lineOpacity: i * 0.1,
            textPlacement: 'vertex'
          },
          properties: {
            altitude: altitude,
            id: properties.id,
            properties: properties
          }
        });
        limitLines.push(outLine);
      }
      return limitLines;
    },
    drawPolygons(idx, coordinates, properties) {
      const polygon = new maptalks.MultiPolygon(coordinates, {
        symbol: {
          lineWidth: 1,
          lineColor: edgeColor,
          polygonFill: polygonColors[0],
          polygonOpacity: 0.5
        },
        properties: {
          altitude: altitude,
          id: properties.id,
          index: idx,
          properties: properties
        }
      })
        .on('mouseenter', function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[1]
          });
        })
        .on('mouseout', function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[0]
          });
        })
        .on('click', e => {
          const properties = e.target.getProperties().properties;
          const name = properties.name;
          this.$notify({
            title: '',
            message: name,
            position: 'top-left'
          });
        })
        .on('dblclick', e => {
          const properties = e.target.getProperties().properties;
          const adcode = properties.adcode;
          if (adcode === 150000) {
            this.drawWall('150000');
            this.drawRegion('150000');
          }
        });
      return polygon;
    },
    drawRegion(key) {
      this.mapKey = key;
      fetch('../static/data/' + key + '.json', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      })
        .then(response => {
          response.json().then(data => {
            const features = data.features;
            let polygons = [];
            features.forEach((g, i) => {
              const properties = g.properties;
              const coordinates = g.geometry.coordinates;
              const polygon = this.drawPolygons(i, coordinates, properties);
              polygons.push(polygon);
            });
            let layer = MlogMap.getLayer('vector-polygon');
            if (!layer) {
              layer = new maptalks.VectorLayer('vector-polygon', {
                enableAltitude: true
              }).addTo(MlogMap);
            }
            layer.clear();
            layer.addGeometry(polygons);
            const marker = new maptalks.Marker([111.13810910424957, 36.04256912706856], {
              symbol: {
                markerFile: require('../assets/images/fengji.png'),
                markerWidth: { stops: [[1, 6],[5, 30], [12, 30]] },
                markerHeight: { stops: [[1, 10],[5, 50], [12,50]] },
              },
              properties: {
                altitude: 40000
              }
            }).addTo(layer);
            if (key !== 'china') {
              const extent = layer.getExtent();
              const center = extent.getCenter();
              const zoom = MlogMap.getFitZoom(extent);
              // MlogMap.setCenterAndZoom(center, zoom);
              MlogMap.animateTo(
                {
                  center: center,
                  zoom: zoom,
                  pitch: 60,
                  bearing: -10.8
                },
                {
                  duration: 3000
                }
              );
            }
          });
        })
        .catch(e => {
          console.log('error: ' + e.toString());
        });
    },
    drawWall(key) {
      // https://geo.datav.aliyun.com/areas/bound/100000.json
      fetch('../static/data/' + key + '_border.json', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      })
        .then(response => {
          response.json().then(borderMapData => {
            const borderFeatures = borderMapData.features[0];
            const properties = borderFeatures.properties;
            const pathCoordinates = borderFeatures.geometry.coordinates;
            const limitLines = this.drawBorderLines(pathCoordinates, properties);
            let layer = MlogMap.getLayer('vector-line');
            if (!layer) {
              layer = new maptalks.VectorLayer('vector-line', {
                enableAltitude: true,
                drawAltitude: {
                  polygonFill: '#OB3B5B',
                  polygonOpacity: 0.6,
                  lineWidth: 0
                }
              }).addTo(MlogMap);
            }
            layer.clear();
            layer.addGeometry(limitLines);
          });
        })
        .catch(e => {
          console.log('error: ' + e.toString());
        });
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
