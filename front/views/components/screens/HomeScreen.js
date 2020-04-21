import React, { Component } from 'react';
import {View, ScrollView, StyleSheet, Button} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

/**
 * HomeScreen is the first component loaded. it's the home page where the user arrive when launching app
 */
export class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * the render method return the view to display
     */
    render() {
        const {navigate} = this.props.navigation;
        return (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.buttons} title='Je suis un utilisateur' onPress={() => navigate('Utilisateur')} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.buttons} title='Je suis un organisateur' onPress={() => navigate('Organisateur')} />
                        </View>
                    </View>
                </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 12,

    },
    buttonContainer:{
        margin: 10
    },
});

export default HomeScreen
