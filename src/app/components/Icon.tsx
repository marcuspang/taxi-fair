// Icon.jsx
import IcoMoon, { IconProps } from 'react-icomoon';
import { Svg, Path } from 'react-native-svg';
import iconSet from './selection.json';
import React from 'react';

const Icon = (props: IconProps) => (
  <IcoMoon
    native
    SvgComponent={Svg}
    PathComponent={Path}
    iconSet={iconSet}
    {...props}
  />
);

export default Icon;
