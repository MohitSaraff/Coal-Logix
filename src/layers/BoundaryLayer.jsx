import { Layer, Source } from 'react-map-gl';
import gervaBound from "../data/gerva-boundary.json";

const boundaryLayer = {
    id: 'outline',
    type: 'line',
    source: 'boundary',
    layout: {
        'line-cap': 'round',
        'line-join': 'round',
        'line-miter-limit': 2,
        'line-round-limit': 180,
    },
    paint: {
        'line-color': '#ffffff',
        'line-width': 2,
        'line-gap-width': 2, // Add this property to mask the outside boundary
        'line-opacity': 0.5, // Optional: set the opacity of the line
        'line-translate': [0, 0],
    },
  };

function BoundaryLayer() {
  return (
    <Source id="boundary" type="geojson" data={gervaBound}>
        <Layer {...boundaryLayer} />
    </Source>
  )
}

export default BoundaryLayer