import { useState, useEffect } from "react";
import {
  getAdminLocation,
  getWeatherData,
  getTimeZoneOffset,
  createWeather,
  structureData,
} from "./functions.js";
import Map from "./Map.js";
export default function Main() {
  const [data, setData] = useState({
    location: { country: "Finland", adminArea: "Uusimaa" },
    timeZoneOffset: 0,
    weather: [],
  });
  const [coordinates, setCoordinates] = useState({ lat: 60.169, lng: 24.938 });

  async function updatePage(data) {
    let location;
    let timeZoneOffset;
    let structuredData;
    try {
      location = await getAdminLocation(coordinates.lat, coordinates.lng);
      //returns { country: countryName, adminArea: adminName };

      timeZoneOffset = await getTimeZoneOffset(
        coordinates.lat,
        coordinates.lng
      );
      //returns number

      structuredData = await getWeatherData(
        coordinates.lat,
        coordinates.lng,
        timeZoneOffset
      );
    } catch (err) {
      console.log("Error in updatePage():" + err);
    }

    //returns ...?
    let weatherArray = createWeather(structuredData);

    let newData = {
      ...data,
      location: await location,
      timeZoneOffset: await timeZoneOffset,
      weather: await weatherArray,
    };
    return newData;
  }

  useEffect(async () => {
    const obj = await updatePage(data);
    setData(obj);
  }, [coordinates]);

  return (
    <main className="container-fluid  bg-light  align-items-center justify-content-center p-0 m-0">
      <section
        className="row g-0 m-auto"
        style={{ maxWidth: "1200px", minWidth: "375px" }}
      >
        {/*The top half of the main, the map*/}
        <div className="row-auto mt-1 ">
          <div className="row g-0">
            <div className="row justify-content-center bg-info m-0 pt-3">
              <Map coordinates={coordinates} setCoordinates={setCoordinates} />
            </div>
          </div>
        </div>
        {/*The bottom half of the main, the weather*/}
        <div className="row justify-content-center fw-bold bg-light m-0 position-relative bg-warning link-info p-1 ">
          WEATHER NOW AT | LAT:{coordinates.lat} LONG:
          {coordinates.lng}
          {" | "}
          {data.location.country}-{data.location.adminArea}
        </div>
        <div className="row-auto p-4">
          <div className="row justify-content-center r-6">{data.weather}</div>
        </div>
      </section>
    </main>
  );
}
//TO DO
/*
Link map to forecast data
*/
