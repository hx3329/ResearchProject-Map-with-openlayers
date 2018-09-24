import React, { Component } from 'react';
// import ol from 'openlayers';
import {Map, View} from 'ol';
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import {fromLonLat} from 'ol/proj.js';
import {easeIn, easeOut} from 'ol/easing.js';
import OSM from "ol/source/OSM";
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import VectorLayer from "ol/layer/Vector";
import LineString from 'ol/geom/LineString.js';
import {Stroke, Style} from 'ol/style.js';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import flightJson from './flights.json';

var styles = [
  'Road',
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabels',
  'collinsBart',
  'ordnanceSurvey'
];

//location
var london = fromLonLat([-0.12755, 51.507222]);
// var moscow = fromLonLat([37.6178, 55.7517]);
// var istanbul = fromLonLat([28.9744, 41.0128]);
var rome = fromLonLat([12.5, 41.9]);
// var bern = fromLonLat([7.4458, 46.95]);
var sydeney = fromLonLat([151.207859,-33.861568]);

var arc = require('arc');


var view = new View({
  center:london,
  zoom:6
});

var layers = [];
var i, ii;

// var select = document.getElementById('layer-select');

class MapPage extends Component {
  state={
    selectStyle:'AerialWithLabels',
  }
  componentDidMount(){
    //select map of bind
    for (i = 0, ii = styles.length; i < ii; ++i) {
      layers.push(new TileLayer({
        visible: styles[i] === this.state.selectStyle,
        preload: Infinity,
        source: new BingMaps({
          key: 'AuD9mcqmkdR1Q2FiUoIuBhTZa2JFG_qJThOkX7fB_BZ0CaOcB7Afq_Wt7oVs4TvE',
          imagerySet: styles[i]
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        })
      }));
    };

    //customer small overview map
    var overviewMapControl = new OverviewMap({
      // see in overviewmap-custom.html to see the custom CSS used
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: false
    });

    //map layer
    var map = new Map({
      controls: defaultControls().extend([
        overviewMapControl
      ]),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
      layers: layers,
      // Improve user experience by loading tiles while dragging/zooming. Will make
      // zooming choppy on mobile or slow devices.
      loadTilesWhileInteracting: true,
      target: 'map',
      view: view
    });


    var style = new Style({
      stroke: new Stroke({
        color: '#EAE911',
        width: 2
      })
    });

    var pointsPerMs = 0.1;
    //第二次生成出来接event的function
    const animateFlights = (style) => (event) => {
      var vectorContext = event.vectorContext;
      var frameState = event.frameState;
      vectorContext.setStyle(style);

      var features = flightsSource.getFeatures();
      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (!feature.get('finished')) {
          // only draw the lines for which the animation has not finished yet
          var coords = feature.getGeometry().getCoordinates();
          var elapsedTime = frameState.time - feature.get('start');
          var elapsedPoints = elapsedTime * pointsPerMs;

          if (elapsedPoints >= coords.length) {
            feature.set('finished', true);
          }

          var maxIndex = Math.min(elapsedPoints, coords.length);
          var currentLine = new LineString(coords.slice(0, maxIndex));

          // directly draw the line with the vector context
          vectorContext.drawGeometry(currentLine);
        }
      }
      // tell OpenLayers to continue the animation
      map.render();
    }

    var flightsSource = new VectorSource({
      wrapX: false,
      attributions: 'Flight data by ' +
        '<a href="http://openflights.org/data.html">OpenFlights</a>,',
      loader: function() {
        var flightsData = flightJson.flights;
        for (var i = 0; i < flightsData.length; i++) {
          var flight = flightsData[i];
          var from = flight[0];
          var to = flight[1];

          // create an arc circle between the two locations
          var arcGenerator = new arc.GreatCircle(
            {x: from[1], y: from[0]},
            {x: to[1], y: to[0]});

          var arcLine = arcGenerator.Arc(100, {offset: 10});
          if (arcLine.geometries.length === 1) {
            var line = new LineString(arcLine.geometries[0].coords);
            line.transform('EPSG:4326', 'EPSG:3857');

            var feature = new Feature({
              geometry: line,
              finished: false
            });
            // add the feature with a delay so that the animation
            // for all features does not start at the same time
            addLater(feature, i * 50);
          }
        }
        map.on('postcompose', animateFlights(style));
      }
    });

    var flightsLayer = new VectorLayer({
      source: flightsSource,
      style: function(feature) {
        // if the animation is still active for a feature, do not
        // render the feature with the layer style
        if (feature.get('finished')) {
          return style;
        } else {
          return null;
        }
      }
    });

    map.addLayer(flightsLayer);



    function addLater(feature, timeout) {
      window.setTimeout(function() {
        feature.set('start', new Date().getTime());
        flightsSource.addFeature(feature);
      }, timeout);
    }



  };

  onChange = (e) => {
    var style = e.target.value;
    this.setState({selectStyle:style});
    for (var i = 0, ii = layers.length; i < ii; ++i) {
      layers[i].setVisible(styles[i] === style);
    }
  };

  //rotateleft
  onRotateleft =()=> {
    view.animate({
      rotation:view.getRotation()+ Math.PI/2
    });
  };

  //rotateright
  onRotateright =()=> {
    view.animate({
      rotation: view.getRotation() - Math.PI / 2
    });
  };

  //rotate around
  onRotateraround=()=>{
    var rotation = view.getRotation();
    view.animate({
      rotation: rotation + Math.PI,
      center:rome,
      easing: easeIn
    }, {
      rotation: rotation + 2 * Math.PI,
      center:rome,
      easing: easeOut
    });
  };
  //pan
  onPanto=()=>{
    view.animate({
      center: london,
      duration: 2000
    });
  };
  //fly
  flyTo = (location,done) => {
    var duration = 2000;
    var zoom = view.getZoom();
    var parts = 2;
    var called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    view.animate({
      center: location,
      duration: duration
    }, callback);
    view.animate({
      zoom: 3,
      duration: duration / 2
    }, {
      zoom: 8,
      duration: duration / 2
    }, callback);
  };

  onFlyto=()=>{
    this.flyTo(sydeney,function(){});
  };

  render(){
    return(
      <div className = "Map">
        <div id='map'/>
        <select id="layer-select" value={this.state.selectStyle} onChange={this.onChange}>
          <option value="Aerial">Aerial</option>
          <option value="AerialWithLabels">Aerial with labels</option>
          <option value="Road">Road (static)</option>
          <option value="RoadOnDemand">Road (dynamic)</option>
          <option value="collinsBart">Collins Bart</option>
          <option value="ordnanceSurvey">Ordnance Survey</option>
        </select>
        <button id="rotate-left" title="Rotate clockwise" onClick={this.onRotateleft}>↻</button>
        <button id="rotate-right" title="Rotate counterclockwise" onClick={this.onRotateright}>↺</button>
        <button id="pan-to-london" onClick={this.onPanto}>Pan to London</button>
        <button id="elastic-to-moscow">Elastic to Moscow</button>
        <button id="bounce-to-istanbul">Bounce to Istanbul</button>
        <button id="spin-to-rome">Spin to Rome</button>
        <button id="fly-to-bern" onClick={this.onFlyto}>Fly to Bern</button>
        <button id="rotate-around-rome" onClick={this.onRotateraround}>Rotate around Rome</button>
        <button id="tour">Take a tour</button>
      </div>
    );
  }
}

export default MapPage;

