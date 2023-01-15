import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { LatLng } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackParamList } from '../../../App';
import CustomButton from './CustomButton';
import Icon from './Icon';
import { showError } from './others/helper-functions';

// pass on the navigation variables so that can allow backward navigation
export default function CreateRoute({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, 'CreateRoute'>) {
  const { from } = route.params || {};

  const [fromCoords, setFromCoords] = useState<LatLng>(from || {});
  const [toCoords, setToCoords] = useState<LatLng>();

  const fromRef = useRef<GooglePlacesAutocompleteRef>(null);
  const toRef = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    fromRef.current?.setAddressText(from.name);
  }, [from.name]);

  const updateFromCoords = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
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
    if (toCoords === undefined) {
      showError('Please enter valid starting/ending locations');
      return false;
    }
    return true;
  };

  const onDone = () => {
    const isValid = checkValid();
    if (isValid) {
      Keyboard.dismiss();
      navigation.navigate('PriceComparison', {
        from: {
          ...fromCoords,
          name:
            fromRef.current?.getAddressText() ||
            `${(from.latitude, from.longitude)}`,
        },
        to: {
          ...toCoords!,
          name:
            toRef.current?.getAddressText() ||
            `${toCoords!.latitude}, ${toCoords!.longitude}`,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Enter your destination below!</Text>
      {/* Can make into component */}
      <Text>Source</Text>
      <GooglePlacesAutocomplete
        ref={fromRef}
        placeholder="Source" // to add the correct prefilled location name
        query={{
          key: Config.GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        onPress={updateFromCoords}
        fetchDetails
        styles={{ textInput: styles.textInput }}
      />
      <Text>Destination</Text>
      <GooglePlacesAutocomplete
        ref={toRef}
        placeholder="Destination"
        query={{
          key: Config.GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        onPress={updateToCoords}
        fetchDetails
        styles={{ textInput: styles.textInput }}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          buttonText="Go back"
          buttonStyles={styles.button}
          onPress={() => navigation.goBack()}
        />
        <CustomButton
          buttonText="Check price "
          buttonStyles={styles.button}
          Icon={<Icon size={12} icon="arrow-right2" color="white" />}
          onPress={onDone}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: 'black',
  },
  textInput: {
    backgroundColor: '#E5E6FF',
    borderRadius: 10,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
  },
  button: {
    marginRight: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
