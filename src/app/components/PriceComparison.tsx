import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import Config from 'react-native-config';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { PROVIDER_GOOGLE } from 'react-native-maps/lib/ProviderConstants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StackParamList } from '../../../App';
import useGetPrices from '../hooks/useGetPrices';
import CustomButton from './CustomButton';
import TaxiFare from './TaxiFare';
import { showError } from './others/helper-functions';

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  rideContainer: {
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 20,
    bottom: 0,
    maxHeight: 200,
    width: Dimensions.get('window').width - 32,
  },
  button: {
    backgroundColor: '#5162FA',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: 'white', fontWeight: '600' },
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

  const [hasError, setHasError] = useState(false);
  const { isLoading, prices } = useGetPrices(from, to);
  const mapRef = useRef<MapView>(null);
  console.log({ from, to, prices });

  return (
    <SafeAreaView
      style={{
        ...backgroundStyle,
        flex: 1,
      }}>
      <View style={styles.mapContainer}>
        <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map}>
          <Marker
            coordinate={{
              latitude: from.latitude,
              longitude: from.longitude,
            }}
            title={from.name}
          />
          <Marker
            coordinate={{
              latitude: to.latitude,
              longitude: to.longitude,
            }}
            title={to.name}
          />
          <MapViewDirections
            origin={{ latitude: from.latitude, longitude: from.longitude }}
            destination={{ latitude: to.latitude, longitude: to.longitude }}
            strokeWidth={4}
            strokeColor="#5162FA"
            apikey={Config.GOOGLE_MAPS_API_KEY!}
            onReady={result => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                animated: true,
                edgePadding: {
                  left: Dimensions.get('window').width / 5,
                  top: 10,
                  bottom: 10,
                  right: Dimensions.get('window').width / 5,
                },
              });
            }}
            onError={e => {
              if (e === 'Error on GMAPS route request: ZERO_RESULTS') {
                showError('No results found! Please try another location');
              }
              setHasError(true);
            }}
          />
        </MapView>
      </View>
      <View style={styles.rideContainer}>
        {!isLoading && prices ? (
          <FlatList
            data={prices}
            renderItem={({ item }) => <TaxiFare data={item} />}
          />
        ) : (
          <Text>No rides found.</Text>
        )}
        {hasError && (
          <Text>Something went wrong, please try another location</Text>
        )}
        <CustomButton
          buttonStyles={styles.button}
          buttonTextStyles={styles.buttonText}
          buttonText="Back"
          onPress={() => navigation.goBack()}
        />
      </View>
      {/* add the list of Grab, Gojek and Taxi maybe can use this:https://reactnative.dev/docs/virtualizedlist */}
    </SafeAreaView>
  );
};

export default PriceComparison;
