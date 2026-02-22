import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const MatchResult = ({ need, onConnect }) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const idleScale = useSharedValue(1);

  useEffect(() => {
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
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: cardScale.value * idleScale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
        <LinearGradient colors={['transparent', '#00FF66', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.laserBorder} />

        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={styles.badgeContainer}>
              <View style={styles.glowDot} />
              <Text style={styles.badgeText}>SEMANTIC MATCH ALIGNED</Text>
            </View>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.itemName}>{need.item}</Text>
            <View style={styles.clubRow}>
              <Ionicons name="location" size={12} color="#00FF66" />
              <Text style={styles.clubName}>DESTINATION: {need.club.toUpperCase()}</Text>
            </View>
            
            <View style={styles.messageBox}>
              <View style={styles.quoteLine} />
              <Text style={styles.messageText}>"{need.message}"</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.connectButton} onPress={onConnect} activeOpacity={0.8}>
            <LinearGradient colors={['#00FF66', '#00B347']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.connectGradient}>
              <Text style={styles.connectButtonText}>EXECUTE HANDSHAKE</Text>
              <Ionicons name="arrow-forward" size={16} color="#050505" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: { width: '100%', borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(5,5,5,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  laserBorder: { height: 1, width: '100%', position: 'absolute', top: 0, opacity: 0.5 },
  contentWrapper: { padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,255,102,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  glowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF66', shadowColor: '#00FF66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, marginRight: 8 },
  badgeText: { fontFamily: 'SpaceGrotesk_700Bold', color: '#00FF66', fontSize: 10, letterSpacing: 2 },
  content: { marginBottom: 32 },
  itemName: { fontFamily: 'SpaceGrotesk_300Light', fontSize: 32, color: '#fff', marginBottom: 12, letterSpacing: -1 },
  clubRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  clubName: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginLeft: 6 },
  messageBox: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 16, alignItems: 'center' },
  quoteLine: { width: 2, height: '100%', backgroundColor: '#00FF66', borderRadius: 1, marginRight: 12 },
  messageText: { fontFamily: 'Inter_400Regular', flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  connectButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#00FF66', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  connectGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  connectButtonText: { fontFamily: 'SpaceGrotesk_700Bold', color: '#050505', fontSize: 12, marginRight: 10, letterSpacing: 2 }
});

export default MatchResult;
