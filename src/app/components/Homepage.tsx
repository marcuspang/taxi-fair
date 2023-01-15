import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StackParamList } from '../../../App';
import { LatLngWithDelta } from '../hooks/useLocations';
import CustomButton from './CustomButton';
import Icon from './Icon';

/**
 * Helper function to get the device's current geoposition
 */
const getCurrentGeoposition = (
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

const DEFAULT_LOCATION_COORDS: LatLngWithDelta = {
  latitude: 1.3052,
  longitude: 103.7739,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};

const Homepage = ({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Homepage'>) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = stylesWithColourMode(isDarkMode);

  const [location, setLocation] = useState<LatLngWithDelta>(
    DEFAULT_LOCATION_COORDS,
  );
  const locationRef = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    locationRef.current?.setAddressText('Current Location');
    // check location permissions
    // TODO: add check for iOS
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(hasPermission => {
      if (hasPermission) {
        getCurrentGeoposition(pos =>
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: pos.coords.accuracy / 100000,
            longitudeDelta: pos.coords.accuracy / 100000,
          }),
        );
      } else {
        requestForLocationPermission().then(permissionGranted => {
          if (permissionGranted) {
            getCurrentGeoposition(pos =>
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

  console.log({
    location,
  });

  return (
    <SafeAreaView style={styles.safeViewContainer}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={location}>
          <Marker
            draggable
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onDragEnd={({ nativeEvent: { coordinate } }) => {
              setLocation(prev => ({ ...prev, ...coordinate }));
              locationRef.current?.setAddressText(
                `${coordinate.latitude}, ${coordinate.longitude}`,
              );
            }}
            title="Current Location"
          />
        </MapView>
      </View>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={locationRef}
          placeholder="Current Location"
          query={{
            key: Config.GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          onPress={(data, detail = null) => {
            if (detail !== null) {
              setLocation(prev => ({
                ...prev,
                longitude: detail.geometry.location.lng,
                latitude: detail.geometry.location.lat,
              }));
            }
          }}
          fetchDetails
          styles={{ textInput: styles.textInput }}
        />
        <CustomButton
          onPress={() =>
            navigation.navigate('CreateRoute', {
              from: {
                name:
                  locationRef.current?.getAddressText() ||
                  `${location.latitude}, ${location.longitude}`,
                latitude: location.latitude,
                longitude: location.longitude,
              },
            })
          }
          buttonStyles={styles.button}
          buttonTextStyles={styles.buttonText}
          buttonText={'Select your destination '}
          Icon={<Icon size={12} icon="arrow-right2" color="white" />}
        />
      </View>
    </SafeAreaView>
  );
};

const stylesWithColourMode = (isDarkMode: boolean) =>
  StyleSheet.create({
    backgroundStyle: {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    },
    safeViewContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    },
    mapContainer: {
      ...StyleSheet.absoluteFillObject,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      minHeight: 100,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    searchContainer: {
      padding: 16,
      marginLeft: 16,
      marginRight: 16,
      backgroundColor: 'white',
      position: 'absolute',
      borderRadius: 20,
      bottom: 0,
      height: 200,
      width: Dimensions.get('window').width - 32,
    },
    button: {
      backgroundColor: '#5162FA',
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
    },
    buttonText: { color: 'white', fontWeight: '600' },
    textInput: {
      backgroundColor: '#E5E6FF',
      borderRadius: 10,
    },
  });

export default Homepage;
