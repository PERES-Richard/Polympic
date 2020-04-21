import MapView, {Marker} from 'react-native-maps';
import React, { Component } from "react";
import {
    Button,
    StyleSheet,
    TextInput,
    View,
    ToastAndroid,
    Modal, Text, Switch
} from "react-native";
import {getRecentExtUsers, getRecentUsers, getEvents, sendEvent, updateEvent, getExtEvents} from "../../services/RequestService";
import RNEventSource from 'react-native-event-source'
import { IP, sse_port} from "../../config";
import {SearchEvents} from "./SearchEvents";
//import socketIO from 'socket.io-client';

/**
 * this component contains usefull buttons for organizers and the map
 */
export default class OrganizerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            events: [],
            extUsers: [],
            extEvents: [],
            editModalVisible: false,
            addModalVisible: false,
            eventClicked: null,
        };
        this._initSse();
        this._loadRecentUsers();
        this._loadEvents();
        // organizerSocket.on('connect', () => {
        //     console.log('connected to org server');
        // });
        // organizerSocket.on('disconnect', () => {
        //     console.log('disconnected org');
        // });
        //
        // organizerSocket.on('receiveCoordinates', (data) => {
        //     // console.log("New user : " + data.toString());
        //     const user = JSON.parse(data);
        //     // console.log("User : " + user);
        //
        //     let newUser = this.state.users.map(marker => {
        //         if (marker.uuid === user.uuid) {
        //             // console.log("pas new, updated");
        //             marker.latitude = user.latitude;
        //             marker.longitude = user.longitude;
        //
        //             let tempState = this.state;
        //             this.setState(tempState);
        //
        //             return true;
        //         }
        //     });
        //
        //     if (!newUser.includes(true)) {
        //
        //         let tempState = this.state;
        //         tempState.users.push(
        //             {
        //                 uuid: user.uuid,
        //                 latitude: user.latitude,
        //                 longitude: user.longitude,
        //             }
        //         );
        //
        //         this.setState(tempState);
        //     }
        //     // console.log("state : ", this.state);
        // });
        //
        // organizerSocket.on('removeCoordinates', (data) => {
        //     // console.log("remove ", data);
        //     const user = JSON.parse(data);
        //     const size = this.state.users.length;
        //     let i = 0;
        //     let finish = false;
        //
        //     while (i < size && !finish) {
        //         if (this.state.users[i].uuid === user.uuid) {
        //             let tempsState = this.state;
        //             tempsState.users.splice(i, 1);
        //             finish = true;
        //             this.setState(tempsState)
        //         }
        //         i++;
        //     }
        // });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    setState(state, callback) {
        if(this._isMounted)
            super.setState(state, callback);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * update the state to display or not the edit part
     */
    _setEditModalVisible(visible) {
        this.setState({editModalVisible: visible});
    }

    /**
     * update the state to display or not the add part
     */
    _setAddModalVisible(visible) {
        this.setState({addModalVisible: visible});
    }

    /**
     * init the sse connection between frontend and backend to receive users updates and events updates
     */
    _initSse(){
        let organizerSSE = new RNEventSource("http://" + IP + ":" + sse_port + "/organizer/init_sse_connection");
        organizerSSE.addEventListener('message', (event) => {
            const res = JSON.parse(event.data);
            if(res.user !== undefined){
                const user = res.user;
                let newUser = this.state.users.map(marker => {
                    if (marker.uuid === user.uuid) {
                        marker.latitude = parseFloat(user.latitude);
                        marker.longitude = parseFloat(user.longitude);
                        let tempState = this.state;
                        this.setState(tempState);
                        return true;
                    }
                });
                if (!newUser.includes(true)) {
                    let tempState = this.state;
                    tempState.users.push({
                        uuid: user.uuid,
                        latitude: parseFloat(user.latitude),
                        longitude: parseFloat(user.longitude),
                    });
                    this.setState(tempState);
                }
            }else if(res.event !== undefined){
                const polympicEvent = res.event;
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
                                        onPress={(event) => {this._clickOnEvent(event)}}
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
     * when clicking on event we can open the edit window
     */
    _clickOnEvent(event){
        let eventId = parseInt(event.nativeEvent.id);
        this.state.events.map(event => {
            if(event.id === eventId){
                let tempState = this.state;
                tempState.eventClicked = event;
                this.setState(tempState);
            }
        });
        this._setEditModalVisible(true);
    }

    /**
     * contact backend to load recent users connected
     */
    _loadRecentUsers() {
        ToastAndroid.show("Chargement des utilisateurs", ToastAndroid.SHORT);
        getRecentUsers().then((responseJson) => {
            if(responseJson.statusCode !== undefined && responseJson.statusCode === 404){
                ToastAndroid.show("Une erreur est survenue lors du chargement des utilisateurs récents", ToastAndroid.LONG);
                return;
            }
            let tempState = this.state;
            tempState.users = responseJson;
            this.setState(tempState);
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * for each user display a marker on the map
     */
    _displayUser() {
        const {users} = this.state;
        if (users !== undefined) {
            return (
                this.state.users.map(marker => {
                    const usersCoords = {
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    };
                    return (
                        <Marker
                            key={marker.uuid}
                            coordinate={usersCoords}
                            title={marker.uuid}
                            pinColor={'turquoise'}
                        />
                    );
                })
            )
        }
    }

    /**
     * contact backend to load external users
     */
    _getExtUsers = async () => {
        ToastAndroid.show("Chargement des utilisateurs externes", ToastAndroid.SHORT);
        await getRecentExtUsers().then((responseJson) => {
            if(responseJson.statusCode !== undefined && responseJson.statusCode === 404){
                ToastAndroid.show("Une erreur est survenue lors du chargement des utilisateurs externes", ToastAndroid.LONG);
                return;
            }
            let upExtUsersCount = 0;
            let newExtUsersCount = 0;
            responseJson.forEach((user) => {
                let newUser = this.state.extUsers.map(marker => {
                    if (marker.uuid === user.uuid) {
                        marker.latitude = parseFloat(user.latitude);
                        marker.longitude = parseFloat(user.longitude);
                        let tempState = this.state;
                        this.setState(tempState);
                        upExtUsersCount++;
                        return true;
                    }
                });
                if (!newUser.includes(true)) {
                    newExtUsersCount++;
                    let tempState = this.state;
                    tempState.extUsers.push({
                        uuid: user.uuid,
                        latitude: parseFloat(user.latitude),
                        longitude: parseFloat(user.longitude),
                    });
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    };

    /**
     * for each external user display a marker on the map
     */
    _displayExtUser() {
        const {extUsers} = this.state;
        if (extUsers !== undefined) {
            return (
                    this.state.extUsers.map(marker => {
                        const usersCoords = {
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        };
                        return (
                                <Marker
                                        key={marker.uuid}
                                        coordinate={usersCoords}
                                        title={marker.uuid}
                                        pinColor={'orange'}
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
                ToastAndroid.show("Evénements externes vides ", ToastAndroid.SHORT);
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
                        latitude: event.latitude,
                        longitude: event.longitude,
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
     * contact the backend to add a new event in database
     */
    _addEvent = async () => {
        if(this.eventName === undefined){
            ToastAndroid.show("Nom de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.eventDescription === undefined){
            ToastAndroid.show("Description de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.eventLatitude === undefined){
            ToastAndroid.show("Latitude de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.eventLongitude === undefined){
            ToastAndroid.show("Longitude de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.eventBeginDate === undefined){
            ToastAndroid.show("Date de début de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.eventEndDate === undefined){
            ToastAndroid.show("Date de fin de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        ToastAndroid.show("Envoi en cours", ToastAndroid.SHORT);
        const body = {
            title: this.eventName,
            description: this.eventDescription,
            latitude: this.eventLatitude,
            longitude: this.eventLongitude,
            startDate: this.eventBeginDate,
            endDate: this.eventEndDate
        };
        let res = await sendEvent(body);
        if(res.statusCode !== 500) {
            this._setAddModalVisible(false);
            let tempState = this.state;
            tempState.events.push({
                id: res.id,
                title: res.title,
                description: res.description,
                latitude: parseFloat(res.latitude),
                longitude: parseFloat(res.longitude),
                startDate: res.startDate,
                endDate: res.endDate,
                isCancelled: res.isCancelled
            });
            this.setState(tempState);
        }else{
            ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
        }
    };

    /**
     * contact the backend to edit an event
     */
    _editEvent = async () => {
        if(this.state.eventClicked.title === undefined){
            ToastAndroid.show("Nom de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.state.eventClicked.description === undefined){
            ToastAndroid.show("Description de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.state.eventClicked.latitude === undefined){
            ToastAndroid.show("Latitude de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.state.eventClicked.longitude === undefined){
            ToastAndroid.show("Longitude de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.state.eventClicked.startDate === undefined){
            ToastAndroid.show("Date de début de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        if(this.state.eventClicked.endDate === undefined){
            ToastAndroid.show("Date de fin de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        ToastAndroid.show("Envoi en cours", ToastAndroid.SHORT);
        const body = {
            id : this.state.eventClicked.id,
            title: this.state.eventClicked.title,
            description: this.state.eventClicked.description,
            latitude: this.state.eventClicked.latitude,
            longitude: this.state.eventClicked.longitude,
            startDate: this.state.eventClicked.startDate,
            endDate: this.state.eventClicked.endDate,
            isCancelled: this.state.eventClicked.isCancelled
        };
        let res = await updateEvent(this.state.eventClicked.id, body);
        if(res.statusCode !== 500) {
            this._setEditModalVisible(false);
            let tempState = this.state;
            this.state.events.map(event => {
                if (event.id === this.state.eventClicked.id) {
                    event.id = body.id;
                    event.title = body.title;
                    event.description = body.description;
                    event.latitude = parseFloat(body.latitude);
                    event.longitude = parseFloat(body.longitude);
                    event.startDate = body.startDate;
                    event.endDate = body.endDate;
                    event.isCancelled = body.isCancelled;
                }
            });
            this.state.eventClicked = null;
            this.setState(tempState);
        }else{
            console.error(res);
            ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
        }
    };

    /**
     * the render method return the view to display
     */
    render() {
        return (
            <>
                <Modal animationType="slide"
                        transparent={true}
                        visible={this.state.editModalVisible}>
                    <View style={{backgroundColor: 'rgba(255,255,255,1)', height: '100%' }}>
                        <View style={styles.container}>
                            <Text>Modifier l'événement</Text>
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.title : '' }
                                    placeholder = "Nom de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.title = text;
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.description : '' }
                                    placeholder = "Description de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.description = text;
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.latitude.toString() : '' }
                                    placeholder = "Latitude de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.latitude = parseFloat(text);
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.longitude.toString() : '' }
                                    placeholder = "Longitude de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.longitude = parseFloat(text);
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.startDate : '' }
                                    placeholder = "Date de début de l'événement YYYY/MM/DD HH:mm"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.startDate = text;
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <TextInput
                                    value={ this.state.eventClicked !== null ? this.state.eventClicked.endDate : '' }
                                    placeholder = "Date de fin de l'événement YYYY/MM/DD HH:mm"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => {
                                        const eventClicked = this.state.eventClicked;
                                        eventClicked.endDate = text;
                                        this.setState({eventClicked: eventClicked})
                                    }}
                            />
                            <View style={styles.buttons}>
                                <Text>Annuler l'événement ? </Text>
                                <Switch
                                        title='Cancelled'
                                        value={ this.state.eventClicked !== null && this.state.eventClicked.isCancelled }
                                        onValueChange={(value) => {
                                            const eventClicked = this.state.eventClicked;
                                            eventClicked.isCancelled = value;
                                            this.setState({eventClicked: eventClicked});
                                        }}
                                />
                            </View>
                            <View style={styles.buttons}>
                                <Button title='Annuler les modifications' onPress={() => { this._setEditModalVisible(!this.state.editModalVisible); }}/>
                            </View>
                            <View style={styles.buttons}>
                                <Button title='Modifier' onPress={ this._editEvent }/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.addModalVisible}>
                    <View style={{backgroundColor: 'rgba(255,255,255,1)', height: '100%' }}>
                        <View style={styles.container}>
                            <Text>Ajouter un événement</Text>
                            <TextInput
                                    placeholder = "Nom de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventName = text}
                            />
                            <TextInput
                                    placeholder = "Description de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventDescription = text}
                            />
                            <TextInput
                                    placeholder = "Latitude de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventLatitude = text}
                            />
                            <TextInput
                                    placeholder = "Longitude de l'événement"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventLongitude = text}
                            />
                            <TextInput
                                    placeholder = "Date de début de l'événement YYYY/MM/DD HH:mm"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventBeginDate = text}
                            />
                            <TextInput
                                    placeholder = "Date de fin de l'événement YYYY/MM/DD HH:mm"
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(text) => this.eventEndDate = text}
                            />
                            <View style={styles.buttons}>
                                <Button title='Annuler' onPress={() => { this._setAddModalVisible(!this.state.addModalVisible); }}/>
                            </View>
                            <View style={styles.buttons}>
                                <Button title='Ajouter événement' onPress={this._addEvent}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.buttons}>
                    <Button title='Ajouter événement' onPress={() => { this._setAddModalVisible(true); }}/>
                </View>
                <View style={styles.buttons}>
                    <Button title='Voir les utilisateurs externes' onPress={this._getExtUsers}/>
                </View>
                <View style={styles.buttons}>
                    <Button title='Voir les événements externes' onPress={this._getExtEvents}/>
                </View>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 43.6155168,
                        longitude: 7.0721891,
                        latitudeDelta: 0,
                        longitudeDelta: 0.0121,
                    }}
                >
                    {this._displayUser()}
                    {this._displayExtUser()}
                    {this._displayEvents()}
                    {this._displayExtEvents()}
                </MapView>
                <SearchEvents />
            </>
        )
    };
}

const styles = StyleSheet.create({
        container: {
          margin: 10
        },
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
    });
