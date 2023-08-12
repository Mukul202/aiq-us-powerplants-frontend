import React, { Component } from 'react';
import H from '@here/maps-api-for-javascript';

class Map extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.map = null;
        this.platform = null;
    }

    getMarkerIcon(color, label) {
        const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="marker">
                    <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                    </g>
                    </svg>`;
        return new H.map.Icon(svgCircle, {
            anchor: {
                x: 10,
                y: 10
            }
        });
    }

    componentDidMount() {
        // Check if the map object has already been created
        if (!this.map) {
            // Create a platform object with the API key
            this.platform = new H.service.Platform({ apikey: this.props.apikey });
            // Create a new Raster Tile service instance
            const rasterTileService = this.platform.getRasterTileService({
                queryParams: {
                    style: "explore.day",
                    size: 512,
                },
            });
            // Creates a new instance of the H.service.rasterTile.Provider class
            // The class provides raster tiles for a given tile layer ID and pixel format
            const rasterTileProvider = new H.service.rasterTile.Provider(rasterTileService);
            // Create a new Tile layer with the Raster Tile provider
            const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

            // Create a new map instance with the Tile layer, center, and zoom level
            const userPosition = {
                lat: -112.8617, lng: 33.3881,
            }

            if (this.props.powerPlantPositions) {
                this.props.powerPlantPositions.forEach(position => {
                    userPosition.lat += position.location.lat
                    userPosition.lng += position.location.lng
                });

                userPosition.lat = userPosition.lat / this.props.powerPlantPositions.length
                userPosition.lng = userPosition.lng / this.props.powerPlantPositions.length
            }

            this.map = new H.Map(
                this.mapRef.current,
                rasterTileLayer, {
                    pixelRatio: window.devicePixelRatio,
                    center: userPosition,
                    zoom: 4,
                },
            );

            // Add panning and zooming behavior to the map
            new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
            
            if (this.props.powerPlantPositions && this.props.powerPlantPositions.length > 0) {
                const markers = this.props.powerPlantPositions.map(powerplant => {
                    const marker = new H.map.Marker(
                        powerplant.location, {
                            icon: this.getMarkerIcon('blue', powerplant.plant_name)
                        }
                    );
    
                    // Create an InfoBubble for each marker
                    const infoBubbleContent = `
                            <div class="info-bubble">
                            <h3>${powerplant.name}</h3>
                            <p>Lat: ${powerplant.location.lat.toFixed(4)}</p>
                            <p>Lng: ${powerplant.location.lng.toFixed(4)}</p>
                        </div>
                    `;

                    const infoBubble = new H.ui.InfoBubble(
                        powerplant.location, {
                            content: infoBubbleContent
                        }
                    );
    
                    // Add event listener to open and close the InfoBubble
                    marker.addEventListener('tap', () => {
                        if (!this.ui) {
                            this.ui = new H.ui.UI(this.map);
                        }
                        this.ui.addBubble(infoBubble);
                    });
    
                    return marker;
                });
                this.map.addObjects(markers);
            }

            console.log("center:", userPosition);
        }
    }

    render() {
        // Return a div element to hold the map
        return <div style={{ width: "100%", height: "500px" }} ref={this.mapRef} />;
    }
}

export default Map;
