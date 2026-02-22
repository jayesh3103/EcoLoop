import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
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

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

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

    formOpacity.value = withTiming(1, { duration: 800 });
    formY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
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

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRegistering(true);
    
    // Simulate auth network request
    setTimeout(() => {
      setIsRegistering(false);
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
          locations={[0, 0.3, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#00FF66" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.formContainer, animatedForm]}>
          
          <View style={styles.header}>
            <Text style={styles.title}>AGENT INIT</Text>
            <Text style={styles.subtitle}>REGISTER TO PROTOCOL</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL DESIGNATION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Vector Protocol"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>COMM LINK (EMAIL)</Text>
            <TextInput
              style={styles.input}
              placeholder="agent@ecoloop.io"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
              onPress={handleSignup}
              onPressIn={() => buttonScale.value = withTiming(0.97, { duration: 100 })}
              onPressOut={() => buttonScale.value = withTiming(1, { duration: 100 })}
              disabled={isRegistering}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#00FF66', '#00CC52']}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.authButtonText}>
                {isRegistering ? 'INITIALIZING...' : 'CREATE AGENT'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.back()}
          >
            <Text style={styles.loginText}>RETURNING AGENT? <Text style={styles.loginHighlight}>AUTHORIZE</Text></Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 80,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  auroraOrb: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
  },
  formContainer: {
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    zIndex: 10,
  },
  header: {
    marginBottom: 48,
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
    marginBottom: 20,
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
    marginTop: 24,
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
  loginLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  loginHighlight: {
    color: '#00FF66',
  }
});
