import React, { useEffect, useState } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps/lib/ProviderConstants';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const getCurrentPosition = (
  handlePosition: (pos: Geolocation.GeoPosition) => void,
  handleError: (err: Geolocation.GeoError) => void = console.log,
) => {
  Geolocation.getCurrentPosition(handlePosition, handleError, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
  });
};

/**
 * Requests for location permission based on platform OS.
 *
 * @param retry continuously requests for location permission if true
 * @returns whether location permission has been granted
 */
const requestForLocationPermission = async (retry?: boolean) => {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Taxi Fair Location Permission',
        message:
          'Taxi Fair needs access to your location ' +
          'so you can view taxi routes.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (retry && result !== PermissionsAndroid.RESULTS.GRANTED) {
      requestForLocationPermission();
    }
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'ios') {
    const result = await Geolocation.requestAuthorization('whenInUse');
    if (retry && result !== 'granted') {
      requestForLocationPermission();
    }
    return result === 'granted';
  }
};

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const Homepage = ({ navigation }: { navigation: any }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [location, setLocation] = useState<Location>({
    latitude: 1.30457,
    longitude: 103.772392,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  useEffect(() => {
    // TODO: add check for iOS
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(hasPermission => {
      if (hasPermission) {
        getCurrentPosition(pos =>
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: pos.coords.accuracy / 1000,
            longitudeDelta: pos.coords.accuracy / 1000,
          }),
        );
      } else {
        requestForLocationPermission().then(permissionGranted => {
          if (permissionGranted) {
            getCurrentPosition(pos =>
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                latitudeDelta: pos.coords.accuracy / 100000,
                longitudeDelta: pos.coords.accuracy / 100000,
              }),
            );
          }
        });
      }
    });
  }, []);

  console.log({ location });

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
        <Button
          title="Go to Plan Trip"
          onPress={() => navigation.navigate('PlanTrip')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {},
});

export default Homepage;
