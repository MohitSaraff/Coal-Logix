import { Layer, Source } from 'react-map-gl';

function SkyLayer() {
    const skyLayer = {
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      };
  return (
    <Source
        id='mapbox-dem'
        type='raster-dem'
        url='mapbox://mapbox.mapbox-terrain-dem-v1'
        tileSize={1024}
        maxzoom={14}
      >
      <Layer {...skyLayer} />
    </Source>
  )
}

export default SkyLayer