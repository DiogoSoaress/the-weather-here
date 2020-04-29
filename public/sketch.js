if('geolocation' in navigator) {
  console.log('geolocation available')
  navigator.geolocation.getCurrentPosition(async position => {
    let latitude, longitude, weather,air
    try {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude)
      document.getElementById('lat').textContent = latitude.toFixed(2);
      document.getElementById('lon').textContent = longitude.toFixed(2);
      
      const api_url = `/weather/${latitude},${longitude}`
      const response = await fetch(api_url)
      const json = await response.json()
      console.log(json)
      weather = json.weather.currently;
      air = json.air_quality.results[1].measurements[0];
      document.getElementById('summary').textContent = weather.summary;
      document.getElementById('temperature').textContent = weather.temperature;
      document.getElementById('aq_parameter').textContent = air.parameter;
      document.getElementById('aq_value').textContent = air.value;
      document.getElementById('aq_units').textContent = air.unit;
      document.getElementById('aq_date').textContent = air.lastUpdated;

    } catch (error) {
      console.error(error)
      air = {value: -1}
      document.getElementById('aq_value').textContent = 'NO READING AVAILABLE';
    }  

    const data = { latitude, longitude, weather, air };
    // console.log(data)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log('response', db_json);

  })
} else {
  console.log('geolocation not available');
}