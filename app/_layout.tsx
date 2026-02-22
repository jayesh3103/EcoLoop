import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { 
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold 
} from '@expo-google-fonts/space-grotesk';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold
} from '@expo-google-fonts/inter';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

function SplashScreen({ onFinish }) {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Reveal Logo
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    // Reveal Text
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));

    // Fade entire screen out
    setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 800 });
      setTimeout(onFinish, 800); // Unmount after fade
    }, 2500);
  }, []);

  const animatedLogo = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));
  
  const animatedText = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const animatedContainer = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.splashContainer, animatedContainer]}>
      <Animated.View style={[styles.logoCore, animatedLogo]} />
      <Animated.Text style={[styles.splashText, animatedText]}>E C O L O O P</Animated.Text>
      <Animated.Text style={[styles.splashSub, animatedText]}>NPU-NATIVE CIRCULAR AGENT</Animated.Text>
    </Animated.View>
  );
}

export default function Layout() {
  const [appReady, setAppReady] = useState(false);

  // Load custom premium fonts
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold
  });

  if (!appReady || !fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#050505' }}>
        <SplashScreen onFinish={() => {
          if (fontsLoaded) setAppReady(true);
        }} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#050505' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#050505' },
        animation: 'fade', // Slick crossfade transitions
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="match" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="diy" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00FF66',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    marginBottom: 40,
  },
  splashText: {
    fontFamily: 'SpaceGrotesk_300Light',
    color: '#fff',
    fontSize: 28,
    letterSpacing: 12,
    marginBottom: 16,
  },
  splashSub: {
    fontFamily: 'Inter_600SemiBold',
    color: '#00FF66',
    fontSize: 10,
    letterSpacing: 4,
  }
});
