// LIB
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';

// LIB CUSTOM
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import CustomCallout from '../components/CustomCallout';

// REDUX
import {connect} from "react-redux";

// ACTION
import {actions} from '../';
const {isMapReady, dragMap, changePointGroup, changeTypeBookport, regionBookport} = actions;

// CONST
const CALLOUT_ANCHOR_ANDROID = { x: 1.3, y: 1.2 };
const CALLOUT_OFSET = { x: 20, y: 38 };
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const propTypes = {
    ...Marker.propTypes,
    // override this prop to make it optional
    coordinate: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
    }),
    children: PropTypes.node,
    heading: PropTypes.number,
};

// STYLE
import styles from '../BookPort.styles';

class BookPortMap extends React.PureComponent {

    constructor(props) {
        super(props);
        this.mounted = false;
        this._handleRegionChangeComplete = this._handleRegionChangeComplete.bind(this);
        this._handleDragMaker = this._handleDragMaker.bind(this);
        this._handleChangePointGroup = this._handleChangePointGroup.bind(this);
        this._handleLoadReady = this._handleLoadReady.bind(this);
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
            // console.log(1)
        });
    }

    _handleRegionChangeComplete(region) {
        const positionDrag = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
        };

        this.props.dragMap(positionDrag);
        // this.props.changePointGroup(null);
    }

    _handleChangePointGroup(address) {
        this.props.changePointGroup(address);
        this.props.changeTypeBookport(this.props.objBookport.typeBookport, 1);
    }

    _handleDragMaker(e) {
        
        this.props.regionBookport(e.nativeEvent.coordinate)
    }

    _handleLoadReady() {
        this.props.isMapReady();
    }

    getZoomLevel(region = this.props.objBookport.region) {
        if(region)
        {
            // http://stackoverflow.com/a/6055653
            const angle = region.longitudeDelta;

            // 0.95 for finetuning zoomlevel grouping
            return Math.round(Math.log(360 / angle) / Math.LN2);
        }

    }

    render() {
        return (
            <View style={styles.mapContainer}>
                {!this.props.objBookport.region ? null :
                    <MapView
                        // showsUserLocation
                        // showsMyLocationButton
                        provider={this.props.provider}
                        style={styles.map}
                        zoomEnabled={true}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        region={this.props.objBookport.region}
                        moveOnMarkerPress={false}
                        onRegionChangeComplete={this._handleRegionChangeComplete}
                        loadingEnabled={true}
                        onMapReady={this._handleLoadReady}
                    >
                        {this.props.objBookport.marker ?
                            <Marker draggable
                                key='1'
                                coordinate={this.props.objBookport.marker ? this.props.objBookport.marker : null}
                                title='MBS'
                                description='MBS'
                                image={require('../../../assets/images/bookport/ic_32Location_MBS.png')}
                                onDragEnd={this._handleDragMaker}
                            />: null}

                        {this.props.objBookport.pointGroup ? this.props.objBookport.pointGroup.map(marker => (
                            <Marker
                                key={marker.key}
                                coordinate={marker.region}
                                title={marker.address}
                                // pinColor={marker.color}
                                calloutOffset={CALLOUT_OFSET}
                                calloutAnchor={CALLOUT_ANCHOR_ANDROID}
                                image={marker.iconMaker}
                                onPress={() => {this._handleChangePointGroup(marker)}}
                            >
                                <Callout tooltip style={styles.customView}>
                                    <CustomCallout
                                        portFree={marker.portFree}
                                        distance={marker.distance}
                                    />
                                </Callout>

                            </Marker>
                        )) : null}
                    </MapView>
                }
            </View>
        );
    }
}
export default connect(state => {
    
    return {
        objBookport : state.extraServiceInfoReducer.objBookport,
    };
},{isMapReady, dragMap, changePointGroup, changeTypeBookport, regionBookport})(BookPortMap);