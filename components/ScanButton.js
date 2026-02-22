import React, { useRef } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const ScanButton = ({ onPress, title = "Scan Item", icon = "scan-outline", premium = false }) => {
  const scale = useSharedValue(1);
  const breatheOpacity = useSharedValue(0.4);
  const breatheRadius = useSharedValue(16);

  React.useEffect(() => {
    if (premium) {
      breatheOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.4, { duration: 1500 })
        ),
        -1, true
      );
      breatheRadius.value = withRepeat(
        withSequence(
          withTiming(24, { duration: 1500 }),
          withTiming(16, { duration: 1500 })
        ),
        -1, true
      );
    }
  }, [premium]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: premium ? breatheOpacity.value : 0,
    shadowRadius: premium ? breatheRadius.value : 0,
  }));

  if (premium) {
    return (
      <TouchableWithoutFeedback 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <LinearGradient
            colors={['rgba(0,255,102,0.4)', 'rgba(0,179,71,0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBorder}
          >
            <LinearGradient
              colors={['#050505', '#111111']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.premiumButton}
            >
              <Ionicons name={icon} size={20} color="#00FF66" style={styles.icon} />
              <Text style={styles.premiumText}>{title}</Text>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.outlineButton}>
          <Ionicons name={icon} size={18} color="#ffffff" style={styles.icon} />
          <Text style={styles.outlineText}>{title}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  premiumBorder: {
    padding: 1, // acts as border width
    borderRadius: 24,
    // Shadows are now animated inline within the container
    elevation: 8,
  },
  premiumButton: {
    borderRadius: 23,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: {
    color: '#00FF66',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  outlineButton: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  outlineText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  icon: {
    marginRight: 12,
  }
});

export default ScanButton;
