//function on load
function myFunction() {
    var map = L.map("map", {
        minZoom: 9,
        maxZoom: 18
    }).setView([40.749844, -73.98994], 12);
    if (map.tap) {map.tap.disable();}
    L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        attribution: 'Map tiles:<a href="http://stamen.com"> Stamen Design</a> Data:<a href="https://openstreetmap.org"> OpenStreetMap</a> Design: <a href="https://juancarlucci.github.io/resume/"> Juan Carlos Collins</a>',
        zoomControl: true,
    }).addTo(map);
    map._layersMinZoom = 6;
    map.zoomControl.setPosition("topright");

    L.tileLayer.wms("https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png", {
        layers: "nexrad-n0r-900913",
        format: "image/png",
        opacity: 0.5,
        "showOnSelector": false,
        detectRetina: true,
        updateWhenIdle: true,
        reuseTiles: true
    }).addTo(map).on("load", showMap);


    var markersLayer = new L.LayerGroup();
    map.addLayer(markersLayer);

    var controlSearch = new L.Control.Search({
        layer: markersLayer,

        initial: false,
        zoom: 15,
        marker: false,
        position: "topright",
        textPlaceholder: "search projects..."
    });

    controlSearch.on("search:collapsed", function (e) {
        map.flyTo([40.749844, -73.98994], 12);
    })

    controlSearch.on("search:locationfound", function(e) {
            e.layer.openPopup();

    });
    map.addControl( controlSearch );
    var markerColors = [];
    // add var "code"
    var code = "1ZkKO2-iZJNhwvRE8ZFBu46LCpqEocJOIpxwIjPFuhM0"

    //loop through spreadsheet with Tabletop
    Tabletop.init({
        key: code,
        callback: function (sheet, tabletop) {

            var sheet1 = tabletop.sheets("Sheet1").elements;
            legend = document.getElementById("category-title");
            iconArray = [];

            // console.log(sheet1);
            // console.log(tabletop.model.name);
            // console.log(tabletop.sheets("CategoryGroup").column_names);
            for (var i in sheet1) {
                var data = sheet1[i];
                // console.log(data);
                lat = +(data.latitude);
                lng = +(data.longitude);
                // console.log(lat);


                var icon = L.icon({
                    iconUrl: data.icon,
                    iconSize: [25, 25], // size of the icon
                    // iconAnchor:   [25, 25], // point of the icon which will correspond to marker"s location
                    // popupAnchor: [0, 0]
                });

                var title = data.name, //value searched
                    category = data.category,
                    //loc = [data.longitude, data.latitude],    //position found
                    loc = [lng, lat],
                    marker = new L.Marker(new L.latLng(loc), {
                        title: title,
                        category: category,
                        icon: icon
                    }); // property searched
                marker.bindPopup("<strong>" + title + "</strong><br>" +
                    data.description + " | " + data.city + "<br>Issue: " + data.category);
                markersLayer.addLayer(marker);
                // console.log(data.icon);
                iconArray.push(data.icon);
                // console.log(iconArray);


                //crete legend for each current project
                var el = document.createElement("ul");
                el.innerHTML = "<span>" + " " + data.category + "</span>";
                legend.appendChild(el);
                //add images
                var x = document.createElement("IMG");
                x.setAttribute("src", data.icon);
                x.setAttribute("width", "14");
                x.setAttribute("height", "14");
                x.setAttribute("alt", "marker icon");
                el.prepend(x);
                var caption = document.createElement("figcaption");
                caption.innerHTML = "<span>" + data.name + "</span>";
               el.append(caption);
               var layerNamesFromSpreadsheet = [];
               // console.log(layerNamesFromSpreadsheet);
               // var layers = {};
               // for (var i in data) {
                 var pointLayerNameFromSpreadsheet = data.category;
                //  if (layerNamesFromSpreadsheet.indexOf(pointLayerNameFromSpreadsheet) === -1) {
                //    markerColors.push(
                //             data[i]["icon"].indexOf(".") > 0
                //             ? data[i]["icon"]
                //             : data[i]["icon"]
                //           );
                layerNamesFromSpreadsheet.push(pointLayerNameFromSpreadsheet);
            }
        },
        simpleSheet: true
    })



    // function openContactForm () {
    //  var formConent = $('#form-content');
    //  this.formConent.addEventListener('click', function(e){
    //      formConent.addClass('expand');
    //  });

    // }
    // openContactForm();


    function initInfoPopup(info, coordinates) {
        L.popup({
                className: "intro-popup"
            })
            .setLatLng(map.getCenter())
            .setContent("<p>Welcome to Community Projects Map</p>" + "<br/><img id='logo' src='images/cpm.png' alt='Community Projects Map logo png' width='50px'/>")
            .openOn(map);

    }


    initInfoPopup();

   // When all processing is done, hide the loader and make the map visible
   showMap();

   function showMap() {
       setTimeout(function() {
         $("#map").css("visibility", "visible");
         $("#legend-wrapper").css("visibility", "visible");
         $("#form-container").css("visibility", "visible");
         $('#projectForm').css("visibility", "visible");
         $(".loader").hide();
       }, 700);
   }

} //myFunction end
