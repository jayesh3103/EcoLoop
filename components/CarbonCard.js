import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CarbonCard = ({ co2Saved }) => {
  const translateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const idleScale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );

    idleScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );
  }, []);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      cardScale.value = withSpring(0.98, { damping: 15 });
    })
    .onUpdate((event) => {
      rotateX.value = interpolate(event.y, [0, 200], [10, -10], Extrapolate.CLAMP);
      rotateY.value = interpolate(event.x, [0, width - 48], [-10, 10], Extrapolate.CLAMP);
    })
    .onFinalize(() => {
      rotateX.value = withSpring(0, { damping: 12 });
      rotateY.value = withSpring(0, { damping: 12 });
      cardScale.value = withSpring(1, { damping: 12 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: cardScale.value * idleScale.value },
    ],
  }));

  const animatedGlow = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ marginVertical: 24, paddingVertical: 10 }, animatedStyle]}>
        <Animated.View style={[styles.ambientGlow, animatedGlow]} />
        
        <View style={styles.cardContainer}>
          <LinearGradient colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.01)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <LinearGradient colors={['rgba(255,255,255,0.2)', 'transparent', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.borderLayer} />
          
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.techBadge}>
                <View style={styles.glowDot} />
                <Text style={styles.title}>NPU TELEMETRY</Text>
              </View>
              <View style={styles.liveIndicator}>
                <Text style={styles.liveText}>SYNCED</Text>
              </View>
            </View>
            
            <View style={styles.metricsContainer}>
              <View>
                <Text style={styles.amount}>{co2Saved}</Text>
                <Text style={styles.unit}>KG CO₂ OFFSET GENERATED</Text>
              </View>

              <View style={styles.chartMock}>
                <LinearGradient colors={['rgba(0,255,102,0.2)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={styles.bar1} />
                <LinearGradient colors={['rgba(0,255,102,0.4)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={styles.bar2} />
                <LinearGradient colors={['#00FF66', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={styles.bar3} />
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.subtitle}>// ZERO-CARBON INFERENCE ACTIVE</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  ambientGlow: { position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', backgroundColor: '#00FF66', filter: 'blur(40px)', opacity: 0.2, borderRadius: 100, zIndex: -1, transform: [{ scale: 1.1 }] },
  cardContainer: { borderRadius: 32, overflow: 'hidden', backgroundColor: 'rgba(5,5,5,0.7)' },
  borderLayer: { ...StyleSheet.absoluteFillObject, borderRadius: 32, borderWidth: 1, borderColor: 'transparent' },
  content: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  techBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  glowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF66', shadowColor: '#00FF66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, marginRight: 8 },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.8)', letterSpacing: 2 },
  liveIndicator: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(0,255,102,0.1)' },
  liveText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 10, color: '#00FF66', letterSpacing: 1 },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  amount: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 64, color: '#fff', letterSpacing: -3, lineHeight: 70, fontVariant: ['tabular-nums'] },
  unit: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  chartMock: { flexDirection: 'row', alignItems: 'flex-end', height: 48, gap: 4 },
  bar1: { width: 12, height: '40%', borderRadius: 4 },
  bar2: { width: 12, height: '70%', borderRadius: 4 },
  bar3: { width: 12, height: '100%', borderRadius: 4 },
  footer: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
  subtitle: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#00FF66', letterSpacing: 1 }
});

export default CarbonCard;
