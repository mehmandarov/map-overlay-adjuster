
this.myOverlayAdjusterTool  = this.myOverlayAdjusterTool || {};

(function(myMap) {
	var overlay;
	var map;
	var mapZoom = 18;
	var overlayImage = "https://github.com/javaBin/AndroiditoJZ/raw/405962e56a1c8e974ff120ec560cf72972bd1a38/android/src/main/res/drawable/level0.png";

	DebugOverlay.prototype = new google.maps.OverlayView();

	function initialize() {
		var mapOptions = {
			zoom: mapZoom,
			center: new google.maps.LatLng(59.9129853, 10.7547424)	
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		var swBound = new google.maps.LatLng(59.91248733954981, 10.753536779098567);
		var neBound = new google.maps.LatLng(59.9135416490492, 10.755773347221407);
		var bounds = new google.maps.LatLngBounds(swBound, neBound);

		showOverlayPointsInInfoOverlay(swBound, neBound);
		showMapCenterPointInInfoOverlay(mapOptions.center);

		//console.log(map);
		var srcImage = overlayImage;

		overlay = new DebugOverlay(bounds, srcImage, map);

		var markerA = new google.maps.Marker({
			position: swBound,
			map: map,
			draggable:true
		});

		var markerB = new google.maps.Marker({
			position: neBound,
			map: map,
			draggable:true
		});

		google.maps.event.addListener(markerA,'drag',function(){
			var newPointA = markerA.getPosition();
			var newPointB = markerB.getPosition();
			var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
			overlay.updateBounds(newBounds);
		});

		google.maps.event.addListener(markerB,'drag',function(){
			var newPointA = markerA.getPosition();
			var newPointB = markerB.getPosition();
			var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
			overlay.updateBounds(newBounds);
		});

		google.maps.event.addListener(markerA, 'dragend', function () {
			var newPointA = markerA.getPosition();
			var newPointB = markerB.getPosition();
			console.log("point1"+ newPointA);
			console.log("point2"+ newPointB);
			showOverlayPointsInInfoOverlay(newPointA, newPointB);

		});

		google.maps.event.addListener(markerB, 'dragend', function () {
			var newPointA = markerA.getPosition();
			var newPointB = markerB.getPosition();
			console.log("point1"+ newPointA);
			console.log("point2"+ newPointB);
			showOverlayPointsInInfoOverlay(newPointA, newPointB);
		});

	}

	function showOverlayPointsInInfoOverlay(point1, point2) {
		document.getElementById("point1").innerText = point1;
		document.getElementById("point2").innerText = point2;
	}

	function showMapCenterPointInInfoOverlay(centerPoint){
		document.getElementById("centerPoint").innerText = centerPoint;
	}

	function setMapCenter(lat, lon){
		map.setCenter(new google.maps.LatLng(lat, lon));
	}


	function setZoom(zoom){
		mapZoom = zoom;
		map.setZoom(mapZoom);
	}

	function setOverlayImage(url){
		overlayImage = url;
		initialize();
	}

	function DebugOverlay(bounds, image, map) {
		this.bounds_ = bounds;
		this.image_ = image;
		this.map_ = map;
		this.div_ = null;
		this.setMap(map);
	}

	DebugOverlay.prototype.onAdd = function() {
		var div = document.createElement('div');
		div.style.borderStyle = 'none';
		div.style.borderWidth = '0px';
		div.style.position = 'absolute';
		var img = document.createElement('img');
		img.src = this.image_;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.opacity = '0.5';
		img.style.position = 'absolute';
		div.appendChild(img);
		this.div_ = div;
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);
	};

	DebugOverlay.prototype.draw = function() {
		var overlayProjection = this.getProjection();
		var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
		var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
		var div = this.div_;
		div.style.left = sw.x + 'px';
		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
	};

	DebugOverlay.prototype.updateBounds = function(bounds){
		this.bounds_ = bounds;
		this.draw();
	};

	DebugOverlay.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	};

	myMap.init = initialize;
	myMap.setMapCenter = setMapCenter;
	myMap.setZoom = setZoom;
	myMap.setOverlayImage = setOverlayImage;
	//google.maps.event.addDomListener(window, 'load', initialize);

}(this.myOverlayAdjusterTool));


window.onload = this.myOverlayAdjusterTool.init;


// Parts of this code are inspired by: http://jsfiddle.net/4cWCW/3/

// Usage :
// myOverlayAdjusterTool.setMapCenter(59.9129853, 10.7547424)
// myOverlayAdjusterTool.setZoom(18)