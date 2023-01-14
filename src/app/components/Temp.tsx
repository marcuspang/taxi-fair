import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps/lib/ProviderConstants';
import Geolocation from 'react-native-geolocation-service';

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

const Temp = () => {
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
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Temp;
