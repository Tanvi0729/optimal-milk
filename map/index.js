const fileArr = [
  './MilkMorning30To50.txt',
  './MilkMorningCapacity.txt',
  './MilkEvening30To50.txt',
  './MilkEveningCapacity.txt',
  './CowMorning30To50.txt',
  './CowMorningCapacity.txt',
  './CowEvening30To50.txt',
  './CowEveningCapacity.txt',
  './BuffaloMorning30To50.txt',
  './BuffaloMorningCapacity.txt',
  './BuffaloEvening30To50.txt',
  './BuffaloEveningCapacity.txt',
];

window.initMap = initMap;  

function initMap() {
    const methodSelect = document.getElementById('select-method');
    const select = document.getElementById('my-select');
    
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
  
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 23.0167908, lng: 76.7017916 },
    });

    directionsRenderer.setMap(map);
    
    methodSelect.addEventListener('change', (event) => {

      const fileName = fileArr[event.target.value - 1];
      
      fetch(fileName).then((data)=> {
        data.text()
          .then((d) => {
            select.innerHTML = '';

            let data = JSON.parse(d);
            console.log(data);
            for(let i = 0; i < data.length; i++) {
              let option = document.createElement(`option`);
              option.text = `Route ${i+1}`;
              option.value = i;
              select.add(option);
            }

            console.log(select);
            
            // add event listener to select element
            select.addEventListener('change', (event) => {
              
              let selectedCluster = event.target.value;
              let coordinates = data[selectedCluster];

              let locations = coordinates.map((coordinate) => {
                return { lat: coordinate[0], lng: coordinate[1] };
              });
              calculateAndDisplayRoute(directionsService, directionsRenderer, locations);
            })
          });
      });
    });
      
  }
  
  function calculateAndDisplayRoute(
    directionsService,
    directionsRenderer,
    locations
  ) {
    const waypts = [];
  
    for (let i = 1; i < locations.length - 1; i++) {
      waypts.push({
        location: new google.maps.LatLng(locations[i].lat, locations[i].lng),
        stopover: true,
      });
    }
  
    directionsService
      .route({
        origin: new google.maps.LatLng(locations[0].lat, locations[0].lng),
        destination: new google.maps.LatLng(
          locations[locations.length - 1].lat,
          locations[locations.length - 1].lng
        ),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
  
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
  
        summaryPanel.innerHTML = "";
  
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
  
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
      })
      .catch((e) =>
        window.alert("Directions request failed due to " + e.status)
      );
  }
  
