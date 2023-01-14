import React from 'react';
import Homepage from './src/app/components/Homepage';
import PlanTrip from './src/app/components/PlanTrip';
// for navigation between screens
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type StackParamList = {
  Homepage: undefined;
  PlanTrip: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Homepage">
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="PlanTrip" component={PlanTrip} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
