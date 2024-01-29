import { View, Text, Image } from 'react-native';
import {
  EstimatedFare,
  GrabFare,
  RideData,
  TaxiServices,
} from '../hooks/useGetPrices';
import React from 'react';

interface TaxiFareProps {
  data: RideData;
}

const TaxiFare = ({ data }: TaxiFareProps) => {
  let text, iconSource;
  if (data.service === TaxiServices.GRAB) {
    text = (data.fare as GrabFare).minFare;
    iconSource = { uri: data.iconLink };
  } else {
    text = (data.fare as EstimatedFare).estimatedFare;
    console.log(data);
    // if (data.fare.service === )
    iconSource = { uri: 'a' };
  }

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Image
        style={{ marginRight: 20, width: 50, height: 50 }}
        source={iconSource}
      />
      <Text>{text}</Text>
    </View>
  );
};

export default TaxiFare;
