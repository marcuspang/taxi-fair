import React from 'react';
import CreateRoute from './src/app/components/CreateRoute';
import Homepage from './src/app/components/Homepage';
import PriceComparison from './src/app/components/PriceComparison';
// for navigation between screens
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { LatLngWithName } from './src/app/hooks/useLocations';

export type StackParamList = {
  Homepage: undefined;
  CreateRoute: { from: LatLngWithName };
  PriceComparison: {
    from: LatLngWithName;
    to: LatLngWithName;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="CreateRoute" component={CreateRoute} />
        <Stack.Screen name="PriceComparison" component={PriceComparison} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
