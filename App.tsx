import React from 'react';
import CreateRoute from './src/app/components/CreateRoute';
import Homepage from './src/app/components/Homepage';
import PriceComparison from './src/app/components/PriceComparison';
// for navigation between screens
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';

export type StackParamList = {
  Homepage: undefined;
  CreateRoute: { from: LatLng };
  PriceComparison: {
    from: LatLng;
    to: LatLng;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Homepage">
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateRoute"
            component={CreateRoute}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PriceComparison"
            component={PriceComparison}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
