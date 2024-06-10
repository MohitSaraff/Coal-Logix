import {useState, useMemo} from 'react';
import {
  Marker,
  Popup
} from 'react-map-gl';
import cctv from '../data/marker.json';
import Pin from '../assets/pin';

export default function MarkerLayer() {
  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      cctv.features.map((data, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={data.geometry.coordinates[0]}
          latitude={data.geometry.coordinates[1]}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(data.geometry);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
        {pins}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={Number(popupInfo.coordinates[0])}
            latitude={Number(popupInfo.coordinates[1])}
            onClose={() => setPopupInfo(null)}
          >
            <video width="220" height="140" muted autoPlay>
                <source src="cctv-footage.mp4" type="video/mp4" />
            </video>
          </Popup>
        )}
    </>
  );
}