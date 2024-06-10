import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import { useEffect } from "react";
import BuildingLayer from "./layers/BuildingLayer.jsx";
import BoundaryLayer from "./layers/BoundaryLayer.jsx";
import FontLayer from "./layers/FontLayer.jsx";
import RouteLayer from "./layers/RouteLayer.jsx";
import { socket } from "./utils/socket.js";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import SkyLayer from "./layers/SkyLayer.jsx";
import MarkerLayer from "./layers/MarkerLayer.jsx";

function CoalLogix() {
  const bounds = [
    [81.98445320954715, 21.947559709709523], // Southwest coordinates
    [83.23718749910074, 22.60980632887545], // Northeast coordinates
  ];

  // Socket Connection
  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onFooEvent(value) {
      console.log("foo", value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  socket.on("carData", (data) => {
    console.log(data);
  });

  socket.on("carData", (data) => {
    console.log(data);
  });

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: 82.56509483028339,
        latitude: 22.337578353722037,
        zoom: 12.5,
      }}
      maxBounds={bounds}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      terrain={{ source: "mapbox-dem", exaggeration: 5 }}
      attributionControl={false}
    >
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
      <BuildingLayer />
      <BoundaryLayer />
      <MarkerLayer />
      <FontLayer />
      <RouteLayer />
      <SkyLayer />
    </Map>
  );
}

export default CoalLogix;
