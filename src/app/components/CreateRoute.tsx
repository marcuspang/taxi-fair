import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { LatLng } from 'react-native-maps';
import { StackParamList } from '../../../App';
import { showError } from './others/helper-functions';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});

// pass on the navigation variables so that can allow backward navigation
export default function CreateRoute({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, 'CreateRoute'>) {
  const { from } = route.params;

  const [fromCoords, setFromCoords] = useState<LatLng>(from);
  const [toCoords, setToCoords] = useState<LatLng>();

  const ref = useRef();
  useEffect(() => {
    // @ts-ignore
    ref.current?.setAddressText('Utown');
  }, []);

  const updateFromCoords = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    console.log({ data, detail });
    // updates from coords if the lat/long values exist, otherwise don't update
    setFromCoords(prev => ({
      latitude: detail ? detail.geometry.location.lat : prev.latitude,
      longitude: detail ? detail.geometry.location.lng : prev.longitude,
    }));
  };

  const updateToCoords = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    console.log({ data, detail });
    if (detail !== null) {
      setToCoords({
        latitude: detail.geometry.location.lat,
        longitude: detail.geometry.location.lng,
      });
    }
  };

  // Checks whether valid starting and ending locations are added
  // otherwise prompts error to user when user tries to submit
  const checkValid = () => {
    if (toCoords !== undefined) {
      showError('Please enter valid starting/ending locations');
      return false;
    }
    return true;
  };

  const onDone = () => {
    const isValid = checkValid();
    if (isValid) {
      navigation.navigate('PriceComparison', {
        from: fromCoords,
        to: toCoords!,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>Enter your starting and ending locations</Text>
      {/* Can make into component */}
      <GooglePlacesAutocomplete
        placeholder="asda" // to add the correct prefilled location name
        query={{
          key: Config.GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        // listEmptyComponent={() => <Text>No results were found</Text>}
        onPress={updateFromCoords}
      />
      <GooglePlacesAutocomplete
        placeholder="Destination"
        query={{
          key: Config.GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        // listEmptyComponent={() => <Text>No results were found</Text>}
        onPress={updateToCoords}
      />
      <Button title="Check price!" onPress={onDone} />
    </View>
  );
}
