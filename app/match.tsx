import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { campusNeeds } from '../data';
import MatchResult from '../components/MatchResult';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSpring,
  withDelay,
  Easing
} from 'react-native-reanimated';

// Scramble Text Effect Hook
const useScrambleText = (finalText, delay = 0, duration = 1500) => {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  
  useEffect(() => {
    let frameId;
    let startTime;
    
    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.max(0, Math.min(1, (timestamp - startTime - delay) / duration));
      
      if (timestamp > startTime + delay) {
        let currentString = '';
        const revealCount = Math.floor(progress * finalText.length);
        
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealCount) {
            currentString += finalText[i];
          } else if (finalText[i] === ' ') {
            currentString += ' ';
          } else {
            currentString += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(currentString);
      }
      
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [finalText, delay, duration]);

  return displayText;
};

export default function MatchScreen() {
  const match = campusNeeds.find(need => need.item.includes('Stepper Motor')) || campusNeeds[0];

  const scrambledHeading = useScrambleText('TARGET ACQUIRED', 500, 1500);

  // Core Agent Animation
  const ringScale1 = useSharedValue(0.5);
  const ringOpacity1 = useSharedValue(1);
  const ringScale2 = useSharedValue(0.5);
  const ringOpacity2 = useSharedValue(1);
  
  const contentY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    ringScale1.value = withRepeat(
      withTiming(1.8, { duration: 2500, easing: Easing.out(Easing.ease) }), 
      -1, false
    );
    ringOpacity1.value = withRepeat(
      withTiming(0, { duration: 2500, easing: Easing.out(Easing.ease) }), 
      -1, false
    );

    setTimeout(() => {
      ringScale2.value = withRepeat(
        withTiming(1.8, { duration: 2500, easing: Easing.out(Easing.ease) }), 
        -1, false
      );
      ringOpacity2.value = withRepeat(
        withTiming(0, { duration: 2500, easing: Easing.out(Easing.ease) }), 
        -1, false
      );
    }, 1250);

    contentY.value = withDelay(400, withSpring(0, { damping: 12 }));
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
  }, []);

  const animatedRing1 = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale1.value }],
    opacity: ringOpacity1.value,
  }));

  const animatedRing2 = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale2.value }],
    opacity: ringOpacity2.value,
  }));

  const animatedContent = useAnimatedStyle(() => ({
    transform: [{ translateY: contentY.value }],
    opacity: contentOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(0,255,102,0.05)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }} 
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>AGENT MATCH</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.agentCoreContainer}>
          <Animated.View style={[styles.agentRing, animatedRing1]} />
          <Animated.View style={[styles.agentRing, animatedRing2]} />
          <View style={styles.iconContainer}>
            <View style={styles.innerGlow}>
              <Ionicons name="git-network-outline" size={48} color="#00FF66" />
            </View>
          </View>
        </View>
        
        <Animated.View style={[styles.textContainer, animatedContent]}>
          <Text style={styles.heading}>{scrambledHeading}</Text>
          <Text style={styles.subheading}>
            The EcoLoop Semantic RAG agent successfully cross-referenced campus needs.
          </Text>

          <MatchResult 
            need={match} 
            onConnect={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              alert('Encrypted handshake initiated. The receiving party has been notified.');
              router.navigate('/(tabs)');
            }} 
          />
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#fff',
    letterSpacing: 3,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingBottom: 40,
  },
  agentCoreContainer: {
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  agentRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#00FF66',
    backgroundColor: 'rgba(0, 255, 102, 0.02)',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.2)',
    zIndex: 10,
  },
  innerGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  textContainer: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'SpaceGrotesk_300Light',
    fontSize: 32,
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 2,
  },
  subheading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
