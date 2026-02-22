import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function LoginScreen() {
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Animations
  const auroraY1 = useSharedValue(-50);
  const auroraRot = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formY = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Background Aurora
    auroraY1.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-50, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );
    auroraRot.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1, false
    );

    // Form Entrance
    formOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    formY.value = withDelay(300, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
  }, []);

  const animatedAurora = useAnimatedStyle(() => ({
    transform: [
      { translateY: auroraY1.value },
      { rotate: `${auroraRot.value}deg` }
    ],
  }));

  const animatedForm = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formY.value }]
  }));

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const handleLogin = () => {
    if (!agentId || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsAuthenticating(true);
    
    // Simulate auth network request
    setTimeout(() => {
      setIsAuthenticating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Animated.View style={[styles.auroraOrb, animatedAurora]} />
        <LinearGradient
          colors={['transparent', '#050505', '#050505']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <Animated.View style={[styles.formContainer, animatedForm]}>
        
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="finger-print" size={32} color="#00FF66" />
          </View>
          <Text style={styles.title}>NPU LOGIN</Text>
          <Text style={styles.subtitle}>AUTHORIZE ECOLOGICAL PROTOCOL</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>AGENT ID</Text>
          <TextInput
            style={styles.input}
            placeholder="eco_001"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={agentId}
            onChangeText={setAgentId}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PASSPHRASE</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Animated.View style={animatedButton}>
          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleLogin}
            onPressIn={() => buttonScale.value = withTiming(0.97, { duration: 100 })}
            onPressOut={() => buttonScale.value = withTiming(1, { duration: 100 })}
            disabled={isAuthenticating}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#00FF66', '#00CC52']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.authButtonText}>
              {isAuthenticating ? 'VERIFYING...' : 'AUTHENTICATE'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.signupLink}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.signupText}>NEW AGENT? <Text style={styles.signupHighlight}>INITIALIZE HERE</Text></Text>
        </TouchableOpacity>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
  },
  auroraOrb: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  formContainer: {
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    marginBottom: 24,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  title: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#00FF66',
    letterSpacing: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  authButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  authButtonText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#050505',
    fontSize: 14,
    letterSpacing: 2,
  },
  signupLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  signupText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  signupHighlight: {
    color: '#00FF66',
  }
});
