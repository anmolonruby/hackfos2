/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var myFirebaseRef = new Firebase("https://road-roughness.firebaseio.com/");

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
        // onSuccess Callback
        //   This method accepts a `Position` object, which contains
        //   the current GPS coordinates
        //
        function onSuccess(position) {
            var lati = document.getElementById('lati');
            var lon = document.getElementById('longi');
            lati.innerHTML = position.coords.latitude;
            lon.innerHTML = position.coords.longitude;

            function onSuccess_acc(acceleration) {
                var xaxis = document.getElementById('xaxis');
                var yaxis = document.getElementById('yaxis');
                var zaxis = document.getElementById('zaxis');

                xaxis.innerHTML = acceleration.x;
                yaxis.innerHTML = acceleration.y;
                zaxis.innerHTML = acceleration.z;

                myFirebaseRef.push({
                  "type" : "Feature",
                  "properties" : {
                    "x-acc" : acceleration.x,
                    "y-acc" : acceleration.y,
                    "z-acc" : acceleration.z
                  },
                  "geometry" : {
                    "type" : "Point",
                    "coordinates" : [
                      position.coords.latitude,
                      position.coords.longitude
                    ]
                  }
                })
            };

            function onError_acc() {
                alert('onError!');
            };

            navigator.accelerometer.getCurrentAcceleration(onSuccess_acc, onError_acc);
        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        // Options: throw an error if no update is received every 30 seconds.
        //
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000 });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
