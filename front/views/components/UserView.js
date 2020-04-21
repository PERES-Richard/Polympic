import React, {Component} from 'react';
import {Button, PermissionsAndroid, Platform, StyleSheet, Text, ToastAndroid, View} from "react-native";
import Geolocation from 'react-native-geolocation-service';
import {getEvents, sendIncident, getExtEvents, sendPosition} from '../../services/RequestService';
import AsyncStorage from "@react-native-community/async-storage";
import UUIDGenerator from 'react-native-uuid-generator';
import { IP, back_end_port, sse_port } from '../../config.js';
import MapView, {Marker} from "react-native-maps";
import RNEventSource from 'react-native-event-source'
import {SearchEvents} from "./SearchEvents";
//import socketIO from 'socket.io-client';

const serverAddress = "http://" + IP + ":" + back_end_port;
const userPositionRoute = "/user";

//const coordSocketURL = "ws://" + IP + ":" + socket_port + "/user";
//const userSocket = socketIO(coordSocketURL, {transports: ["websocket"]});

/**
 * this component contains usefull buttons for users and the map
 */
export class UserView extends Component {
    watchId = 0;

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            extEvents: [],
            loading: false,
            updatesEnabled: false,
            location: {
                mocked: undefined,
                timestamp: undefined,
                coords: {
                    speed: undefined,
                    heading: undefined,
                    accuracy: undefined,
                    altitude: undefined,
                    longitude: undefined,
                    latitude: undefined,
                },
            },
        };
        this._initSSE();
        this._loadEvents();
        // userSocket.connect();
        // userSocket.on('connect', () => {
        //     console.log('connected to user server');
        // });
        // userSocket.on('disconnect', () => {
        //     console.log('disconnected coord');
        // });
        // userSocket.on('sendCoordinates', (data) => {
        //     // console.log('coordonates send : ', data);
        // });
    }

    setState(state, callback) {
        if(this._isMounted)
            super.setState(state, callback);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * init the sse connection between frontend and backend to receive events updates
     */
    _initSSE(){
        let userSSE = new RNEventSource("http://" + IP + ":" + sse_port + "/user/init_sse_connection");
        userSSE.addEventListener('message', (event) => {
            const polympicEvent = JSON.parse(event.data).event;
            let newEvent = this.state.events.map(marker => {
                if (marker.id === polympicEvent.id) {
                    marker.latitude = parseFloat(polympicEvent.latitude);
                    marker.longitude = parseFloat(polympicEvent.longitude);
                    marker.title = polympicEvent.title;
                    marker.description = polympicEvent.description;
                    marker.startDate = polympicEvent.startDate;
                    marker.endDate = polympicEvent.endDate;
                    marker.isCancelled = polympicEvent.isCancelled;
                    let tempState = this.state;
                    this.setState(tempState);
                    return true;
                }
            });
            if (!newEvent.includes(true)) {
                let tempState = this.state;
                tempState.events.push({
                    id: polympicEvent.id,
                    title: polympicEvent.title,
                    description: polympicEvent.description,
                    latitude: parseFloat(polympicEvent.latitude),
                    longitude: parseFloat(polympicEvent.longitude),
                    startDate: polympicEvent.startDate,
                    endDate: polympicEvent.endDate,
                    isCancelled: polympicEvent.isCancelled
                });
                this.setState(tempState);
            }
        });
    }

    /**
     * contact backend to load events
     */
    _loadEvents() {
        ToastAndroid.show("Chargement des événements", ToastAndroid.SHORT);
        getEvents().then((responseJson) => {
            if(responseJson.statusCode !== undefined && responseJson.statusCode === 404){
                ToastAndroid.show("Une erreur est survenue lors du chargement des événements", ToastAndroid.LONG);
                return;
            }
            let tempState = this.state;
            tempState.events = responseJson;
            this.setState(tempState);
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * for each event display a marker on the map
     */
    _displayEvents(){
        const {events} = this.state;
        if (events !== undefined) {
            return (
                    this.state.events.map(marker => {
                        const eventCoords = {
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        };
                        return (
                                <Marker
                                        key={marker.id}
                                        identifier={marker.id.toString()}
                                        coordinate={eventCoords}
                                        title={marker.title}
                                        description={marker.description}
                                        pinColor={'pink'}
                                />
                        );
                    })
            )
        }
    }

    /**
     * contact backend to load external events
     */
    _getExtEvents = async () => {
        ToastAndroid.show("Chargement des événements externes", ToastAndroid.SHORT);
        await getExtEvents().then((responseJson) => {
            if(responseJson.statusCode !== undefined && responseJson.statusCode === 404){
                ToastAndroid.show("Une erreur est survenue lors du chargement des événements externes", ToastAndroid.LONG);
                return;
            }
            if(responseJson.length === 0){
                ToastAndroid.show("Evénements externes vides", ToastAndroid.SHORT);
            }else{
                ToastAndroid.show("Evénements externes collectés", ToastAndroid.SHORT);
            }
            responseJson.forEach((event) => {
                let newEnvent = this.state.extEvents.map(marker => {
                    if (marker.id === event.id) {
                        marker.id = event.id;
                        marker.title = event.title;
                        marker.description = event.description;
                        marker.latitude = parseFloat(event.latitude);
                        marker.longitude = parseFloat(event.longitude);
                        marker.startDate = event.startDate;
                        marker.endDate = event.endDate;
                        marker.isCancelled = event.isCancelled;
                        marker.provider = event.provider;
                        return true;
                    }
                });
                let tempState = this.state;
                if (!newEnvent.includes(true)) {
                    tempState.extEvents.push({
                        id : event.id,
                        title: event.title,
                        description: event.description,
                        latitude: parseFloat(event.latitude),
                        longitude: parseFloat(event.longitude),
                        startDate: event.startDate,
                        endDate: event.endDate,
                        isCancelled: event.isCancelled,
                        provider: event.provider
                    });
                }
                this.setState(tempState);
            });
        }).catch((error) => {
            console.error(error);
        });
    };

    /**
     * for each external event display a marker on the map
     */
    _displayExtEvents(){
        const {events} = this.state;
        if (events !== undefined) {
            return (
                    this.state.extEvents.map(marker => {
                        const eventCoords = {
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        };
                        return (
                                <Marker
                                        key={marker.id}
                                        identifier={marker.id.toString()}
                                        coordinate={eventCoords}
                                        title={marker.title}
                                        description={marker.description + " - " + marker.provider}
                                        pinColor={'green'}
                                />
                        );
                    })
            )
        }
    }

    /**
     * check if the permission to get location is granted
     */
    _hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
    };

    /**
     * get the location from the system and send it to the server
     */
    _getLocation = async () => {
        const hasLocationPermission = await this._hasLocationPermission();
        if (!hasLocationPermission)
            return;

        const uuid = await AsyncStorage.getItem("uuid");
        this.setState({loading: true}, () => {
            Geolocation.getCurrentPosition(
                async (position) => {
                    this.setState({location: position, loading: false});
                    const body = {
                        uuid: uuid,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    await sendPosition(body);
                    //userSocket.emit('sendCoordinates', body);
                },
                (error) => {
                    this.setState({location: error, loading: false});
                    console.error(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 50,
                    forceRequestLocation: true
                }
            );
        });
    };

    /**
     * watch the position of the user, when he moves we can send it to the server
     */
    _getLocationUpdates = async () => {
        const hasLocationPermission = await this._hasLocationPermission();

        if (!hasLocationPermission) return;

        const uuid = await AsyncStorage.getItem("uuid");

        this.setState({updatesEnabled: true}, () => {
            this.watchId = Geolocation.watchPosition(
                async (position) => {
                    this.setState({location: position});
                    const body = {
                        uuid: uuid,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    await sendPosition(body);
                    //userSocket.emit('sendCoordinates', body);
                },
                (error) => {
                    this.setState({location: error});
                    console.error("error 2 = ", error);
                },
                {enableHighAccuracy: true, distanceFilter: 0, interval: 3000, fastestInterval: 2000}
            );
        });
    };

    /**
     * to stop watching user position
     */
    _removeLocationUpdates = () => {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.setState({updatesEnabled: false})
        }
    };

    /**
     * contact backend to add a new incident
     */
    _signalerIncident = async () => {
        const hasLocationPermission = await this._hasLocationPermission();

        if (!hasLocationPermission) return;

        await Geolocation.getCurrentPosition(
            (position) => {
                sendIncident(position.coords);
            });
    };

    /**
     * contact backend to add a random position in database (won't be present in prod version)
     */
    _generateUser = async () => {
        UUIDGenerator.getRandomUUID((uuid) => {
            fetch(serverAddress + userPositionRoute, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uuid: uuid,
                    latitude: 43.6155168 + (Math.random() / 100),
                    longitude: 7.0721891 + (Math.random() / 100)
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    };

    /**
     * the render method return the view to display
     */
    render() {
        const {loading, location, updatesEnabled} = this.state;

        let lat = location.coords.latitude;
        let long = location.coords.longitude;

        const coordView = lat && long ?
            <View>
                <Text style={styles.location}> Vous êtes actuellement :</Text>
                <Text style={styles.location}> lat= {lat} : long={long}</Text>
            </View>
            : null;

        return (
                <>
                    <View style={styles.buttons}>
                        <Button title='Signaler un incident' onPress={this._signalerIncident} disabled={loading || updatesEnabled}/>
                    </View>
                    <View style={styles.buttons}>
                        <Button title='Générer une position' onPress={this._generateUser} disabled={loading || updatesEnabled} />
                    </View>
                    <View style={styles.buttons}>
                        <Button title='Voir les événements externes' onPress={this._getExtEvents}/>
                    </View>
                    <View style={styles.buttons}>
                        <Button title='Me suivre' onPress={this._getLocationUpdates} disabled={updatesEnabled}/>
                    </View>
                    <View style={styles.buttons}>
                        <Button title='Ne plus me suivre' onPress={this._removeLocationUpdates} disabled={!updatesEnabled}/>
                    </View>
                    <View style={styles.buttons}>
                        <Button title='Ma localisation' onPress={this._getLocation} disabled={loading || updatesEnabled}/>
                    </View>
                    {coordView}
                    <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: 43.6155168,
                                longitude: 7.0721891,
                                latitudeDelta: 0,
                                longitudeDelta: 0.0121,
                            }}
                    >
                        {this._displayEvents()}
                        {this._displayExtEvents()}
                    </MapView>
                    <SearchEvents />
                </>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        height: 400,
        width: '100%',
    },
    buttons: {
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
        width: '100%'
    },
    result: {
        borderWidth: 1,
        borderColor: '#666',
        width: '100%',
        paddingHorizontal: 16
    },
    location: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    }
});
