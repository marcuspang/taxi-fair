import { Text } from 'react-native';
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
  if (data.service === TaxiServices.GRAB) {
    return <Text>{(data.fare as GrabFare).minFare}</Text>;
  }
  return <Text>{(data.fare as EstimatedFare).estimatedFare}</Text>;
};

export default TaxiFare;
