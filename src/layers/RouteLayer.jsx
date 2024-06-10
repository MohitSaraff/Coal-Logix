import { useEffect, useState } from "react";
import { useControl } from "react-map-gl";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { PathLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import route from "../data/route.json";
import TripBuilder from "../utils/tripBuilder";

const MODEL_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d/truck.gltf"; // eslint-disable-line

function DeckGLOverlay(props) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

function getTooltip({object}) {
  return (
    object &&
    `\
    Vehicle No.: OD 01 A 1234
    Load: 1000 kg
    Status: Running
    Destination: Bilaspur`
  );
}

function CoalTransport() {
  const [frame, setFrame] = useState(null);
  const [trips, setTrips] = useState(null);
  const layers = [
    // new PathLayer({
    //   id: "trip-lines",
    //   data: trips,
    //   getPath: (d) => d.keyframes.map((f) => f.point),
    //   getColor: [128, 255, 255],
    //   jointRounded: true,
    //   opacity: 1,
    //   getWidth: 20,
    // }),
    new ScenegraphLayer({
      id: "truck",
      data: frame,
      pickable: true,
      scenegraph: MODEL_URL,
      sizeScale: 100,
      getPosition: (d) => d.point,
      getTranslation: [0, 0, 1],
      getOrientation: (d) => [0, 180 - d.heading, 90],
      _lighting: "pbr",
    }),
  ];
  useEffect(() => {
    const trips = route.map(
      (waypoints) => new TripBuilder({ waypoints, loop: true })
    );
    setTrips(trips);
    let timestamp = 0;
    let animation = null;
    const onAnimationFrame = () => {
      timestamp += 0.1;
      const frame = trips.map((trip) => trip.getFrame(timestamp));
      setFrame(frame);
      animation = requestAnimationFrame(onAnimationFrame);
    };
    onAnimationFrame();
  }, []);
  return <DeckGLOverlay layers={layers} controller={true} onClick={getTooltip} />;
}

export default CoalTransport;
