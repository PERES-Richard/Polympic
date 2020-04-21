import React, { Component } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import OrganizerView from "../OrganizerView";
import Colors from "react-native/Libraries/NewAppScreen/components/Colors";
import SearchEvents from "../SearchEvents";

/**
 * this is a page for the organizers
 */
export class OrganizerScreen extends Component {

    /**
     * the render method return the view to display
     */
    render() {
        return (
                <>
                    <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            style={styles.scrollView}>
                        <View style={styles.map}>
                            <OrganizerView />
                        </View>
                    </ScrollView>
                </>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
    },
});

export default OrganizerScreen;
