import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {back_end_port, IP} from '../config.js';

const serverAddress = "http://" + IP + ":" + back_end_port;
const userPositionRoute = "/user";
const incidentRoute = "/incident";
const recentUsersRoute = "/user/recentUsers";
const recentExtUsersRoute = "/user/recentExternalUsers";
const eventsRoute = "/event";
const extEventsRoute = "/external-event";
const searchEventsRoute = "/search/";

export async function sendPosition(body) {
    return fetch(serverAddress + userPositionRoute, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => response.json());
}

export async function sendIncident(coord) {
    fetch(serverAddress + incidentRoute, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid: await AsyncStorage.getItem("uuid"),
            latitude: coord.latitude,
            longitude: coord.longitude,
        }),
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function sendEvent(body) {
    return fetch(serverAddress + eventsRoute, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => response.json());
}

export async function updateEvent(id, body) {
    return fetch(serverAddress + eventsRoute + "/" + id, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => response.json());
}

export async function getEvents() {
    return fetch(serverAddress + eventsRoute, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
}

export async function searchEvents(search) {
    return fetch(serverAddress + eventsRoute + searchEventsRoute + search, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
}

export async function getRecentUsers() {
    return fetch(serverAddress + recentUsersRoute, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
}

export async function getRecentExtUsers() {
    return fetch(serverAddress + recentExtUsersRoute, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
}

export async function getExtEvents() {
    return fetch(serverAddress + extEventsRoute, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
}
