import React, { Component } from 'react';
import { StatusBar, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import UUIDGenerator from 'react-native-uuid-generator';
import {UserView} from "../UserView";
import Colors from "react-native/Libraries/NewAppScreen/components/Colors";

/**
 * this is the page for the simple users
 */
export class UserScreen extends Component {
    /**
     * If the uuid doesn't exists we can generate a new one
     * @returns {Promise<void>}
     */
    async checkUUID() {
        let uuid = await AsyncStorage.getItem("uuid");
        if (uuid == null) {
            UUIDGenerator.getRandomUUID((uuid) => {
                AsyncStorage.setItem("uuid", uuid);
                this.uuid = uuid;
            });
        }
    }

    /**
     * the render method return the view to display
     */
    render() {
        this.checkUUID();
        return (
                <>
                    <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            style={styles.scrollView}>
                        <UserView/>
                    </ScrollView>
                </>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
    },
});

export default UserScreen;
