import { useCallback, useEffect, useState } from 'react';
import { LatLng } from 'react-native-maps';

export enum TaxiServices {
  GRAB = 'grab',
  GOJEK = 'gojek',
  STANDARD_TAXI = 'meteredFare',
  ZIG = 'zig',
}

interface GrabService {
  serviceID: number;
  serviceName: string;
  fare: {
    currency: string;
    maxFare: number;
    minFare: number;
  };
  surgeNotice: string;
  iconLink: string;
  deepLink: string;
  directDeepLink: string;
  eta: number;
  ett: number;
}

interface PriceData {
  [TaxiServices.GRAB]: {
    services: GrabService[];
  };
  [TaxiServices.GOJEK]: number;
  [TaxiServices.STANDARD_TAXI]: number;
  [TaxiServices.ZIG]: number;
}

export interface RideData {
  eta?: number;
  fare: GrabFare | EstimatedFare;
  link?: string;
  iconLink?: string;
  ett?: number;
  surge?: boolean;
  service: TaxiServices;
}

export type GrabFare = { minFare: number; maxFare: number; currency: string };
export type EstimatedFare = { estimatedFare: number };

/*
{
    "message": "Successfully retrieved prices",
    "data": {
        "grab": {
            "services": [
                {
                    "serviceID": 156,
                    "serviceName": "GrabCar 6",
                    "eta": 8,
                    "fare": {
                        "currency": "SGD",
                        "maxFare": 15.18,
                        "minFare": 11.04
                    },
                    "deepLink": "https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FdropOffAddress%3D%26dropOffLatitude%3D1.305202%26dropOffLongitude%3D103.773905%26pickUpAddress%3D%26pickUpLatitude%3D1.305893%26pickUpLongitude%3D103.773858%26screenType%3DBOOKING%26sourceID%3D%26taxiTypeId%3D156",
                    "surgeNotice": "LOW_SURGE",
                    "iconLink": "https://myteksi.s3.amazonaws.com/production/uploads/taxi_type/156/icon/hdpi_icon-1530615367.png",
                    "directDeepLink": "grab://open?dropOffAddress=&dropOffLatitude=1.305202&dropOffLongitude=103.773905&pickUpAddress=&pickUpLatitude=1.305893&pickUpLongitude=103.773858&screenType=BOOKING&taxiTypeId=156",
                    "ett": 4
                },
                {
                    "serviceID": 69,
                    "serviceName": "GrabCar",
                    "eta": 6,
                    "fare": {
                        "currency": "SGD",
                        "maxFare": 12.98,
                        "minFare": 9.44
                    },
                    "deepLink": "https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FdropOffAddress%3D%26dropOffLatitude%3D1.305202%26dropOffLongitude%3D103.773905%26pickUpAddress%3D%26pickUpLatitude%3D1.305893%26pickUpLongitude%3D103.773858%26screenType%3DBOOKING%26sourceID%3D%26taxiTypeId%3D69",
                    "surgeNotice": "LOW_SURGE",
                    "iconLink": "https://myteksi.s3.amazonaws.com/production/uploads/taxi_type/69/icon/hdpi_icon-1530615222.png",
                    "directDeepLink": "grab://open?dropOffAddress=&dropOffLatitude=1.305202&dropOffLongitude=103.773905&pickUpAddress=&pickUpLatitude=1.305893&pickUpLongitude=103.773858&screenType=BOOKING&taxiTypeId=69",
                    "ett": 4
                },
                {
                    "serviceID": 302,
                    "serviceName": "JustGrab",
                    "eta": 6,
                    "fare": {
                        "currency": "SGD",
                        "maxFare": 11.88,
                        "minFare": 8.64
                    },
                    "deepLink": "https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FdropOffAddress%3D%26dropOffLatitude%3D1.305202%26dropOffLongitude%3D103.773905%26pickUpAddress%3D%26pickUpLatitude%3D1.305893%26pickUpLongitude%3D103.773858%26screenType%3DBOOKING%26sourceID%3D%26taxiTypeId%3D302",
                    "surgeNotice": "NONE",
                    "iconLink": "https://myteksi.s3.amazonaws.com/production/uploads/taxi_type/302/icon/hdpi_icon-1530615666.png",
                    "directDeepLink": "grab://open?dropOffAddress=&dropOffLatitude=1.305202&dropOffLongitude=103.773905&pickUpAddress=&pickUpLatitude=1.305893&pickUpLongitude=103.773858&screenType=BOOKING&taxiTypeId=302",
                    "ett": 4
                },
                {
                    "serviceID": 19,
                    "serviceName": "GrabCar Premium",
                    "eta": 9,
                    "fare": {
                        "currency": "SGD",
                        "maxFare": 15.18,
                        "minFare": 11.04
                    },
                    "deepLink": "https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FdropOffAddress%3D%26dropOffLatitude%3D1.305202%26dropOffLongitude%3D103.773905%26pickUpAddress%3D%26pickUpLatitude%3D1.305893%26pickUpLongitude%3D103.773858%26screenType%3DBOOKING%26sourceID%3D%26taxiTypeId%3D19",
                    "surgeNotice": "LOW_SURGE",
                    "iconLink": "https://myteksi.s3.amazonaws.com/production/uploads/taxi_type/19/icon/hdpi_icon-1530614896.png",
                    "directDeepLink": "grab://open?dropOffAddress=&dropOffLatitude=1.305202&dropOffLongitude=103.773905&pickUpAddress=&pickUpLatitude=1.305893&pickUpLongitude=103.773858&screenType=BOOKING&taxiTypeId=19",
                    "ett": 4
                }
            ]
        },
        "gojek": 8.13,
        "meteredFare": 8.57,
        "zig": 13.06
    }
}
*/

const parsePriceData = (prices: PriceData) => {
  const result: RideData[] = [];
  Object.values(TaxiServices).forEach(taxiService => {
    if (taxiService === TaxiServices.GRAB) {
      prices[taxiService].services.forEach(price => {
        result.push({
          service: taxiService,
          fare: price.fare,
          eta: price.eta,
          ett: price.eta,
          link: price.directDeepLink,
          surge:
            price.surgeNotice === 'HIGH_SURGE' ||
            price.surgeNotice === 'FRACTIONAL_SURGE',
        });
      });
    } else {
      result.push({
        service: taxiService,
        fare: { estimatedFare: prices[taxiService] },
      });
    }
  });
  return result;
};

const useGetPrices = (from: LatLng, to: LatLng) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fromCoords, setFromCoords] = useState(from);
  const [toCoords, setToCoords] = useState(to);
  const [prices, setPrices] = useState<PriceData>();

  const run = useCallback(async () => {
    setIsLoading(true);
    const searchParams = new URLSearchParams({
      fromLat: `${fromCoords.latitude}`,
      fromLong: `${fromCoords.longitude}`,
      toLat: `${toCoords.latitude}`,
      toLong: `${toCoords.longitude}`,
    });
    try {
      const response = await fetch(
        `https://hacknroll2023.onrender.com/getprices/all?${searchParams.toString()}`,
      );
      console.log({ response });
      const data = (await response.json()) as {
        message: string;
        data: PriceData;
      };
      setPrices(data.data);
    } catch (e) {
      console.log('ERROR', e);
    }
    setIsLoading(false);
  }, [fromCoords, toCoords]);

  useEffect(() => {
    run();
  }, [run]);

  return {
    isLoading,
    prices: prices && parsePriceData(prices),
    refetch: (newFrom?: LatLng, newTo?: LatLng) => {
      if (newFrom === undefined && newTo === undefined) {
        run();
      }
      if (newFrom !== undefined) {
        setFromCoords(newFrom);
      }
      if (newTo !== undefined) {
        setToCoords(newTo);
      }
    },
  };
};

export default useGetPrices;
