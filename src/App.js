import Map from './Map';
import './App.css';
import { useEffect, useState } from 'react';

// Austurvöllur square in Reykjavik
const userPosition = { lat: 33.3881, lng: -112.8617 };

const powerPlantList = [
  {
    plant_name: "The Fish Market",
    location: { lat: 64.1508, lng: -21.9536 },
  },
  {
    plant_name: "Bæjarins Beztu Pylsur",
    location: { lat: 64.1502, lng: -21.9519 },
  },
  {
    plant_name: "Grillmarkadurinn",
    location: { lat: 64.1475, lng: -21.9347 },
  },
  {
    plant_name: "Kol PowerPlant",
    location: { lat: 64.1494, lng: -21.9337 },
  },
];

const apikey = 'xoBlx_K0CatZaGkIqHuApq0OgdmABUTTwMbQhkRI9t0'

function App() {
  const [powerPlantPositions, setPowerPlantPositions] = useState(powerPlantList);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    // setLoading(true);
    const getPowerPlants=async () => {
      await fetch('https://aiq-us-powerplants-api.onrender.com/api/powerplants/')
       .then(res => res.json())
       .then(res => setPowerPlantPositions(
         res.results.map(pos => ({
           ...pos, location: { lat: pos.latitude, lng: pos.longitude } 
         })))
         ).catch(err => console.log(err)).finally(() => setLoading(false));
    }
    getPowerPlants();
  },[]);


  return (
    <div className="App">
      <div>
        {!loading && (<Map
          apikey={apikey}
          userPosition={userPosition}
          powerPlantPositions={powerPlantPositions}
        />)}
        <div></div>
      </div>
    </div>
  );
}

export default App
