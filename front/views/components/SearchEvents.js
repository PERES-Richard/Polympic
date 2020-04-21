import React, {Component} from "react";
import {Button, StyleSheet, TextInput, ToastAndroid, View, FlatList, Text} from "react-native";
import { searchEvents } from "../../services/RequestService";

export class SearchEvents extends Component {
    /**
     * this is the query to search events
     */
    eventToSearch = "";

    constructor(props) {
        super(props);
        this.state = {
            eventsSearched: []
        };
        this._loadEvents();
    }

    /**
     * contact backend to load events
     */
    _loadEvents() {
        ToastAndroid.show("Chargement des événements", ToastAndroid.SHORT);
        searchEvents(this.eventToSearch).then((responseJson) => {
            if(responseJson.statusCode !== undefined && responseJson.statusCode === 404){
                ToastAndroid.show("Une erreur est survenue lors du chargement de la liste d'événements", ToastAndroid.LONG);
                return;
            }
            let tempState = this.state;
            tempState.eventsSearched = responseJson;
            this.setState(tempState);
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * when the user click on "Rechercher"
     */
    _searchEvent = async () => {
        if(this.eventToSearch === undefined){
            ToastAndroid.show("Nom de l'énévement vide", ToastAndroid.SHORT);
            return;
        }
        this._loadEvents();
    };

    /**
     * if the event is an external, we can display the event provider
     */
    _displayEventProvider(event){
        if(event.provider !== undefined){
            return (
                    <Text >{ 'Événement de '+event.provider}</Text>
            );
        }
    }

    /**
     * the render method return the view to display
     */
    render() {
        return(
            <>
                <View style={styles.container}>
                    <TextInput
                            placeholder = "Rechercher un événement"
                            style={styles.textInput}
                            onChangeText={(text) => this.eventToSearch = text}
                    />
                    <Button title='Rechercher' onPress={this._searchEvent}/>
                </View>
                <View style={styles.container}>
                    {
                        this.state.eventsSearched.map((y) => {
                            return (
                                    <View style={styles.eventContainer}>
                                        <Text style={styles.eventTitle}>{y.title}</Text>
                                        <Text style={styles.eventDescription}>{y.description}</Text>
                                        { this._displayEventProvider(y) }
                                    </View>
                            );
                        })
                    }
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    eventContainer:{
        width: '100%',
        padding: 5
    },
    eventTitle:{
        fontSize: 20
    },
    eventDescription:{
        fontSize: 16
    },
    textInput:{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    searchContainer: {
        marginTop: 25,
        width: '100%'
    },
    buttons: {
        width: '100%'
    },
});

export default SearchEvents;
