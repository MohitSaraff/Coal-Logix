import { useControl } from "react-map-gl";
import { TextLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";

function DeckGLOverlay(props) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const data = [
  {
    name: "Gevra (SECL)",
    coordinates: [82.56509483028339, 22.337578353722037],
  },
];

const textLayer = new TextLayer({
  id: "text-layer",
  data,
  pickable: true,
  getPosition: (d) => d.coordinates,
  getText: (d) => d.name,
  fontSettings: {
    sdf: true,
  },
  getSize: 20,
  getColor: [241, 239, 239],
  outlineWidth: 3,
  outlineColor: [0, 0, 0, 255],
  getAngle: 0,
  getTextAnchor: "middle",
  getAlignmentBaseline: "center",
});

function FontLayer() {
  return <DeckGLOverlay layers={textLayer} />;
}

export default FontLayer;
