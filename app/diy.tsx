import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { diyGuides } from '../data';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  Easing
} from 'react-native-reanimated';

export default function DiyScreen() {
  const guide = diyGuides['Broken Fan'];

  const headerOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    headerOpacity.value = withTiming(1, { duration: 600 });
    titleY.value = withDelay(200, withSpring(0, { damping: 14 }));
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
  }, []);

  const animatedHeader = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const animatedTitle = useAnimatedStyle(() => ({ opacity: titleOpacity.value, transform: [{ translateY: titleY.value }] }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={[styles.header, animatedHeader]}>
        <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.back(); }} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>GENERATED GUIDE</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.innerContent}>
          <Animated.View style={[animatedHeader, styles.alertBox]}>
            <Ionicons name="hardware-chip-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.alertText}>No local buyers for {guide.item}. Processing upcycle path instead.</Text>
          </Animated.View>
          
          <Animated.View style={[animatedTitle, styles.guideHeader]}>
            <Text style={styles.guideTitle}>{guide.title}</Text>
            <View style={styles.impactBadge}>
              <View style={styles.glowDot} />
              <Text style={styles.impactText}>CO2 Offset: {guide.co2Saved}kg</Text>
            </View>
          </Animated.View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Agent Instructions</Text>
            
            {guide.steps.map((step, index) => {
              const stepOpacity = useSharedValue(0);
              const stepX = useSharedValue(20);

              React.useEffect(() => {
                stepOpacity.value = withDelay(400 + (index * 150), withTiming(1, { duration: 500 }));
                stepX.value = withDelay(400 + (index * 150), withSpring(0, { damping: 14 }));
              }, []);

              const animatedStep = useAnimatedStyle(() => ({ opacity: stepOpacity.value, transform: [{ translateX: stepX.value }] }));

              return (
                <Animated.View key={index} style={[styles.stepContainer, animatedStep]}>
                  <View style={styles.stepBubble}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.replace(/^\d+\.\s*/, '')}</Text>
                </Animated.View>
              );
            })}
          </View>

          <Animated.View style={animatedTitle}>
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                alert('Mission accomplished. Offset metrics updated.');
                router.navigate('/(tabs)');
              }}
            >
              <Text style={styles.doneButtonText}>VERIFY COMPLETION</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', paddingTop: 20 },
  innerContent: { width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: { padding: 8, width: 40, alignItems: 'flex-start' },
  topBarTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#fff', letterSpacing: 3 },
  content: { paddingHorizontal: 24, paddingVertical: 40, flexGrow: 1 },
  alertBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginBottom: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  alertText: { fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)', marginLeft: 12, flex: 1, fontSize: 13, lineHeight: 20, letterSpacing: 0.5 },
  guideHeader: { marginBottom: 32 },
  guideTitle: { fontFamily: 'SpaceGrotesk_300Light', fontSize: 36, color: '#fff', marginBottom: 16, letterSpacing: -1 },
  impactBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 255, 102, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(0, 255, 102, 0.2)' },
  glowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF66', marginRight: 8, shadowColor: '#00FF66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6 },
  impactText: { fontFamily: 'Inter_600SemiBold', color: '#00FF66', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  card: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 24, letterSpacing: 3, textTransform: 'uppercase' },
  stepContainer: { flexDirection: 'row', marginBottom: 24 },
  stepBubble: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16, marginTop: 2 },
  stepNumber: { fontFamily: 'SpaceGrotesk_600SemiBold', color: '#fff', fontSize: 12 },
  stepText: { fontFamily: 'Inter_400Regular', flex: 1, fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 24, letterSpacing: -0.2 },
  doneButton: { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 16, marginBottom: 40 },
  doneButtonText: { fontFamily: 'SpaceGrotesk_700Bold', color: '#050505', fontSize: 13, letterSpacing: 2 },
});
