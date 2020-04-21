import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from "./views/components/screens/HomeScreen";
import UserScreen from "./views/components/screens/UserScreen";
import {OrganizerScreen} from "./views/components/screens/OrganizerScreen";


const MainNavigator = createStackNavigator({
    'Accueil ': { screen: HomeScreen },
    'Utilisateur': { screen: UserScreen },
    'Organisateur': { screen: OrganizerScreen },
});

const App = createAppContainer(MainNavigator);

export default App;
