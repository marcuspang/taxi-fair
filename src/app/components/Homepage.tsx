import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  useColorScheme,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StackParamList } from '../../../App';
import useLocations, { Location } from '../hooks/useLocations';
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

const DEFAULT_LOCATION = 'Current Location';
const DEFAULT_LOCATION_COORDS: Location = {
  latitude: 1.3052,
  longitude: 103.7739,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const Homepage = ({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Homepage'>) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = stylesWithColourMode(isDarkMode);

  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION_COORDS);
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION);

  const { locations, refetch } = useLocations('');

  useEffect(() => {
    // TODO: add check for iOS
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(hasPermission => {
      if (hasPermission) {
        getCurrentGeoposition(pos =>
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

  const handleSubmit = async () => {
    if (locationName !== '' && locationName !== DEFAULT_LOCATION) {
      refetch(locationName);
    }
  };

  console.log({
    location,
    locationName,
    possibleLocations: locations.length,
  });

  return (
    <SafeAreaView style={styles.safeViewContainer}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          blurOnSubmit={false}
          style={styles.textInput}
          value={locationName}
          onChangeText={setLocationName}
          onSubmitEditing={() => handleSubmit()}
        />
        <FlatList
          scrollEnabled
          style={styles.locationsList}
          data={locations}
          renderItem={({ item, separators }) => (
            <TouchableHighlight
              key={item.name}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <Text style={styles.location}>{item.name}</Text>
            </TouchableHighlight>
          )}
        />
        <Pressable
          onPress={() =>
            navigation.navigate('CreateRoute', {
              from: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            })
          }
          style={styles.button}>
          <View>
            <Text style={styles.buttonText}>
              Select your destination!{' '}
              <Icon size={14} icon="arrow-right2" color="white" />
            </Text>
          </View>
        </Pressable>
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
      width: 400,
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
    textInput: {
      height: 40,
      backgroundColor: '#E5E6FF',
      borderRadius: 10,
      paddingLeft: 16,
    },
    locationsList: {
      marginTop: 16,
      marginBottom: 16,
    },
    location: {
      padding: 4,
      fontSize: 14,
      color: 'black',
    },
    button: { backgroundColor: '#5162FA', padding: 12, borderRadius: 10 },
    buttonText: { color: 'white', fontWeight: '600' },
  });

export default Homepage;
