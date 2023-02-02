import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Props = {
  children: ReactNode;
};
export function GestureHandler({ children }: Props) {
  return (
    <GestureHandlerRootView style={styles.gestureWrapper}>
      {children}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureWrapper: {
    flex: 1,
  },
});
