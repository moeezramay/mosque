import React, { useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

function Map({ positions, center, display, zoom }) {
    const [activeMarker, setActiveMarker] = useState(null);

    const handleMarkerClick = (marker) => {
        setActiveMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    const handleOnLoad = (mapInput) => {
        const bounds = new window.google.maps.LatLngBounds();
        if (positions) {
            positions.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
            mapInput.fitBounds(bounds);
        }
    };

    const getIconUrl = (type) => {
        switch (type) {
            case "mosque":
                return "https://cdn-icons-png.flaticon.com/512/2319/2319870.png";
            case "female":
                return "https://cdn-icons-png.flaticon.com/512/7029/7029970.png";
            case "male":
                return "https://cdn-icons-png.flaticon.com/512/7029/7029967.png";
            default:
                return "https://cdn-icons-png.flaticon.com/512/819/819814.png";
        }
    };

    return (
        <GoogleMap
            onLoad={handleOnLoad}
            onClick={() => setActiveMarker(null)}
            mapContainerStyle={{
                width: "100%",
                height: "100%",
                visibility: display ? "visible" : "hidden",
            }}
            zoom={zoom}
            center={center}
        >
            {positions &&
                positions.map((position) => (
                    <MarkerF
                        icon={{
                            url: getIconUrl(position.type),
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        key={`${position.lat}-${position.lng}`}
                        position={position}
                        onClick={() => handleMarkerClick(position)}
                        name={position.name}
                    />
                ))}
            {activeMarker && (
                <InfoWindowF
                    position={activeMarker}
                    onCloseClick={handleInfoWindowClose}
                >
                    <div>
                        <p>{activeMarker.name}</p>
                    </div>
                </InfoWindowF>
            )}
        </GoogleMap>
    );
}

export default Map;