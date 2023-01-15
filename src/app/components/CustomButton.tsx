import React from 'react';
import { IconProps } from 'react-icomoon';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  buttonText: string;
  Icon?: JSX.Element;
  IconProps?: IconProps;
  buttonStyles?: Partial<StyleProp<ViewStyle>>;
  buttonTextStyles?: Partial<StyleProp<TextStyle>>;
}

const CustomButton = ({
  onPress,
  buttonText,
  Icon,
  buttonStyles,
  buttonTextStyles,
}: CustomButtonProps) => {
  return (
    <Pressable onPress={onPress} style={{ ...styles.button, ...buttonStyles }}>
      <View>
        <Text style={{ ...styles.buttonText, ...buttonTextStyles }}>
          {buttonText}
          {Icon}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5162FA',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});

export default CustomButton;
