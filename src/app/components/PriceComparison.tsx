import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps/lib/ProviderConstants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StackParamList } from '../../../App';

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {},
});

const PriceComparison = ({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, 'PriceComparison'>) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const { from, to } = route.params; // start and destination that user keyed in
  console.log({ from, to });
  return (
    <SafeAreaView
      style={{
        ...backgroundStyle,
        flex: 1,
      }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          {/* TODO: use the params startingCords, destinationCords to display a map with a route*/}
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          />
        </View>
        <Button title="Back" onPress={() => navigation.goBack()} />
        {/* add the list of Grab, Gojek and Taxi maybe can use this:https://reactnative.dev/docs/virtualizedlist */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PriceComparison;
