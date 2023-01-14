import { useCallback, useEffect, useState } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationData {
  address: string;
  distanceBetween: number;
  latitude: number;
  longitude: number;
  name: string;
  shortName: string;
  tips: string;
}

const useLocations = (searchString: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchString);
  const [locations, setLocations] = useState<LocationData[]>([]);

  const run = useCallback(async () => {
    setIsLoading(true);
    if (query === '') {
      console.log('No search string entered');
      setLocations([]);
      setIsLoading(false);
      return;
    }
    console.log(`Searching locations for ${query}`);
    const response = await fetch(
      `https://hacknroll2023.onrender.com/locations?searchString=${query}`,
    );
    const data = (await response.json()) as {
      message: string;
      results: LocationData[];
    };
    setIsLoading(false);
    setLocations(data.results);
  }, [query]);

  useEffect(() => {
    run();
  }, [run]);

  return {
    isLoading,
    locations,
    refetch: (search: string) => setQuery(search),
  };
};

export default useLocations;
