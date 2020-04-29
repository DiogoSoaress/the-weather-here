const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(mymap)

getData()

async function getData() {
  const response = await fetch('/api')
  const data = await response.json()

  for(let item of data) {
    const marker = L.marker([item.latitude, item.longitude]).addTo(mymap)

    
    let txt = `I'm sitting out here at ${item.latitude}&deg;,${item.longitude}&deg; on this 
    ${item.weather.summary} day and it feels like ${item.weather.temperature}°C outside.`;
    
    if (item.air.value < 0) {
      txt += 'No air quality reading.'
    } else {
      txt += `The concentration of small carcinogenic particles (${item.air.parameter}) I'm breathing in 
      is ${item.air.value} ${item.air.unit} measured on ${item.air.lastUpdated}.`
    }

      
    marker.bindPopup(txt)
  //   const root = document.createElement('p')
  //   const geo = document.createElement('div')
  //   const date = document.createElement('div')
    
  //   geo.textContent = `${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°`;
  //   const dateString = new Date(item.timestamp).toLocaleString();
  //   date.textContent = dateString;

  //   root.append(geo, date);
  //   document.body.append(root)

  }
  console.log(data)
}