import React, { useEffect, useState } from 'react'
import {
    useLoadScript,
    GoogleMap,
    Marker,
    InfoWindow
} from '@react-google-maps/api';
import API from '../api/Api';
import bg1 from '../images/josh-nuttall-eTrHMJwI5ro-unsplash.jpg'
import { Image } from 'react-bootstrap';

function MapComponent() {

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerMap, setMarkerMap] = useState({});
    const [center, setCenter] = useState({ lat: 43.651070, lng: -79.347015 });
    const [zoom, setZoom] = useState(5);
    const [infoOpen, setInfoOpen] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const geo = navigator.geolocation;
        if (!geo) {
            console.log('Geolocation is not supported');
            return;
        }
        const watcher = geo.getCurrentPosition(onChange, onError, { timeout: 10000 });
        return () => geo.clearWatch(watcher);
    }, [])

    const onChange = ({ coords }) => {
        setCenter({
            lat: parseFloat(coords.latitude),
            lng: parseFloat(coords.longitude),
        });
        search(
            coords.latitude,
            coords.longitude,
        )
        setLoading(false);
    };


    const search = (lat = 43.651070, lng = -79.347015) => {
        const c = { lat, lng }
        console.log(c)
        API.getMapData(c)
            .then((data) => {
                setMarkers(data)
            })
        // setCenter(c)
    }


    const onError = (error) => {
        search()
        setLoading(false);
        alert(`Can't get your location this time. The default loaction is Toronto`)
        console.log(error.message);
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCqIAlQpyecPGoONZ1w4CMQLgBtmdeRS_A"
    });


    const loadHandler = map => {
        setMap(map)
    };

    const markerLoadHandler = (marker, place) => {
        return setMarkerMap(prevState => {
            return { ...prevState, [place.id]: marker };
        });
    };

    const markerClickHandler = (event, place) => {

        setSelectedPlace(place);
        if (infoOpen) {
            setInfoOpen(false);
        }
        setInfoOpen(true);
        if (zoom < 13) {
            setZoom(13);
        }

        // setCenter(place.pos)
    };

    const renderMap = () => {
        return (
            <>
                {loading && <span style={{ color: 'white' }}>Getting your location...</span>}
                <h3 style={{ color: 'white' }}>Find Bicycle Stores near you</h3>
                <GoogleMap
                    onLoad={loadHandler}
                    center={center}
                    zoom={13}
                    mapContainerStyle={{
                        height: "70vh",
                        width: "100%"
                    }}
                >

                    {markers.map(place => (
                        <Marker
                            key={place.id}
                            position={place.pos}
                            onLoad={marker => markerLoadHandler(marker, place)}
                            onClick={event => markerClickHandler(event, place)}
                        />
                    ))}

                    {infoOpen && selectedPlace && (
                        <InfoWindow
                            anchor={markerMap[selectedPlace.id]}
                            onCloseClick={() => setInfoOpen(false)}
                        >
                            <div>
                                <h6>{selectedPlace.name}</h6>
                                <div>Rating: {selectedPlace.rating}</div>
                                <div>Open now: {selectedPlace.open_now ? 'Open' : 'Close'}</div>
                                <div>{selectedPlace.vicinity} </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
                <div className="position-relative">
                    <Image src={bg1} fluid />
                </div>
            </>
        );
    };

    return isLoaded ? renderMap() : null;
}

export default MapComponent

