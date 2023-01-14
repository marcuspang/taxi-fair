import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Button, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { showError } from './helper-functions';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});

export default function PlanTrip(props) {
  const navigation = useNavigation();
  const [state, setState] = useState({
    destinationCords: {},
  });

  const { destinationCords } = state;

  const checkValid = () => {
    if (Object.keys(destinationCords).length === 0) {
      showError('Please enter your starting/ending location');
      return false;
    }
    return true;
  };

  const onDone = () => {
    const isValid = checkValid();
    if (isValid) {
      props.route.params.getCordinates({
        destinationCords,
      });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Text>Plan Trip Screen</Text>
      <GooglePlacesAutocomplete
        placeholder="Type a place"
        query={{
          key: process.env.GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        listEmptyComponent={() => (
          <View style={{ flex: 1 }}>
            <Text>No results were found</Text>
          </View>
        )}
      />
      <Button title="Complete button" onPress={onDone} />
    </View>
  );
}
