import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CarbonCard from '../../components/CarbonCard';
import ScanButton from '../../components/ScanButton';
import { userStats, recentActivity } from '../../data';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  withTiming, 
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AuroraBackground = ({ scrollY }) => {
  const auroraY1 = useSharedValue(-50);
  const auroraRot = useSharedValue(0);

  useEffect(() => {
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
  }, []);

  const auroraStyle1 = useAnimatedStyle(() => {
    // Parallax effect: moves up slightly as you scroll down
    const parallaxY = scrollY ? -scrollY.value * 0.3 : 0;
    return {
      transform: [
        { translateY: auroraY1.value + parallaxY },
        { rotate: `${auroraRot.value}deg` }
      ],
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Animated.View style={[styles.auroraOrb, auroraStyle1]} />
    </View>
  );
};

export default function HomeScreen() {
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    headerY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedHeader = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        { translateY: headerY.value },
        { translateY: interpolate(scrollY.value, [0, 100], [0, 20], Extrapolate.CLAMP) }
      ]
    };
  });
  
  const animatedCard = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));

  return (
    <View style={styles.container}>
      <AuroraBackground scrollY={scrollY} />

      <Animated.ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, animatedHeader]}>
          <View style={styles.profileSection}>
            <View style={styles.avatarMock}>
              <LinearGradient colors={['#00FF66', '#00B347']} style={StyleSheet.absoluteFill} />
              <Ionicons name="person" size={20} color="#050505" />
            </View>
            <View>
              <Text style={styles.subtitle}>ID: ECO-001</Text>
              <Text style={styles.greeting}>Agent Vector</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.pointsBadge}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="sparkles" size={14} color="#00FF66" />
            <Text style={styles.points}>{userStats.ecoPoints}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={animatedCard}>
          <CarbonCard co2Saved={userStats.co2Saved} />
        </Animated.View>

        <Animated.View style={[{ marginVertical: 16, zIndex: 10 }, animatedCard]}>
          <ScanButton 
            title="INITIATE HARDWARE SCAN" 
            icon="scan" 
            premium={true}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.push('/(tabs)/scanner');
            }} 
          />
        </Animated.View>

        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SYSTEM LOGS</Text>
          </View>
          
          {recentActivity.map((activity, index) => {
            const itemOpacity = useSharedValue(0);
            const itemY = useSharedValue(20);
            const itemScale = useSharedValue(1);
            const itemGlow = useSharedValue(0);
            
            useEffect(() => {
              itemOpacity.value = withDelay(600 + (index * 150), withTiming(1, { duration: 600 }));
              itemY.value = withDelay(600 + (index * 150), withSpring(0, { damping: 14 }));
            }, []);

            const animatedItem = useAnimatedStyle(() => {
              // Ensure transform properties are explicitly handled as an array of objects
              const ty = itemY.value;
              const sc = itemScale.value;
              return {
                opacity: itemOpacity.value,
                transform: [
                  { translateY: ty },
                  { scale: sc }
                ]
              };
            });

            const animatedGlow = useAnimatedStyle(() => ({
              opacity: itemGlow.value,
            }));

            const handlePressIn = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              itemScale.value = withSpring(0.97, { damping: 15 });
              itemGlow.value = withTiming(1, { duration: 150 });
            };

            const handlePressOut = () => {
              itemScale.value = withSpring(1, { damping: 12 });
              itemGlow.value = withTiming(0, { duration: 300 });
            };

            const handlePress = () => {
              if (activity.action.includes('Upcycled')) {
                router.push('/diy');
              } else if (activity.action.includes('Donated')) {
                router.push('/match');
              } else {
                router.push('/(tabs)/scanner');
              }
            };

            return (
              <Animated.View key={activity.id} style={animatedItem}>
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={handlePress}
                  activeOpacity={1}
                >
                  <Animated.View style={[styles.activityGlowBg, animatedGlow]} pointerEvents="none" />
                  
                  <View style={styles.activityIcon}>
                    <Ionicons name="terminal-outline" size={16} color="#00FF66" />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityText}>{activity.action}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.1)" />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  auroraOrb: {
    position: 'absolute', top: -height * 0.2, right: -width * 0.5,
    width: width * 1.5, height: width * 1.5, borderRadius: width * 0.75,
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
  },
  scroll: { flex: 1 },
  contentContainer: { 
    padding: 24, 
    paddingTop: 80,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center'
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarMock: {
    width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold', fontSize: 9, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4, marginBottom: 4,
  },
  greeting: {
    fontFamily: 'SpaceGrotesk_400Regular', fontSize: 24, color: '#fff', letterSpacing: -0.5,
  },
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  points: {
    fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff', marginLeft: 6, fontVariant: ['tabular-nums'],
  },
  activitySection: { marginTop: 32 },
  sectionHeader: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 4 },
  activityItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, overflow: 'hidden',
  },
  activityGlowBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
  },
  activityIcon: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,255,102,0.05)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(0,255,102,0.1)',
  },
  activityDetails: { flex: 1 },
  activityText: {
    fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.9)', marginBottom: 4, letterSpacing: -0.5,
  },
  activityTime: {
    fontFamily: 'Inter_500Medium', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1,
  }
});
