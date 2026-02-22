import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import ScanButton from '../../components/ScanButton';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, CameraView } from 'expo-camera';
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Scramble text hook for scanner
const useScrambleText = (finalText, isScanning, duration = 800) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$*()_%';
  
  useEffect(() => {
    if (!isScanning) {
      setDisplayText(finalText);
      return;
    }
    let frameId;
    let startTime;
    
    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.max(0, Math.min(1, (timestamp - startTime) / duration));
      
      let currentString = '';
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') {
          currentString += ' ';
        } else if (progress > 0.8) {
           currentString += finalText[i];
        } else {
          currentString += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(currentString);
      
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
         setDisplayText(finalText);
      }
    };
    
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [finalText, isScanning, duration]);

  return displayText;
};

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  
  const scanLineY = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const hudScale = useSharedValue(1.3);
  const hudOpacity = useSharedValue(0);
  const controlsY = useSharedValue(50);
  const controlsOpacity = useSharedValue(0);

  const reticleX = useSharedValue(0);
  const reticleY = useSharedValue(0);
  const reticleRotX = useSharedValue(0);
  const reticleRotY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      reticleX.value = interpolate(event.x, [0, width], [-20, 20], Extrapolate.CLAMP);
      reticleY.value = interpolate(event.y, [0, height], [-20, 20], Extrapolate.CLAMP);
      reticleRotX.value = interpolate(event.y, [0, height], [10, -10], Extrapolate.CLAMP);
      reticleRotY.value = interpolate(event.x, [0, width], [-10, 10], Extrapolate.CLAMP);
    })
    .onFinalize(() => {
      reticleX.value = withSpring(0, { damping: 12 });
      reticleY.value = withSpring(0, { damping: 12 });
      reticleRotX.value = withSpring(0, { damping: 12 });
      reticleRotY.value = withSpring(0, { damping: 12 });
    });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // HUD Boot Sequence
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    hudOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    hudScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    
    controlsOpacity.value = withTiming(1, { duration: 800 });
    controlsY.value = withSpring(0, { damping: 16, stiffness: 100 });

    scanLineY.value = withRepeat(
      withSequence(
        withTiming(150, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-150, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
  }, []);

  const animatedHudStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
    transform: [
      { perspective: 800 },
      { scale: hudScale.value },
      { translateX: reticleX.value },
      { translateY: reticleY.value },
      { rotateX: `${reticleRotX.value}deg` },
      { rotateY: `${reticleRotY.value}deg` }
    ]
  }));

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsY.value }]
  }));

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
    opacity: isScanning ? 0 : 0.6,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cameraRef = React.useRef(null);

  const initiateHardwareScan = async () => {
    if (!cameraRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsScanning(true);
    setScanResult('');
    
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.5, { duration: 500 }), withTiming(0.8, { duration: 500 })),
      -1, true
    );
    pulseOpacity.value = withTiming(1, { duration: 200 });
    overlayOpacity.value = withTiming(1, { duration: 400 });

    try {
      // 1. Capture the image
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      
      // 2. Prepare for upload
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'scan.jpg',
        type: 'image/jpeg'
      });

      // 3. Send to backend (Production URL)
      const response = await fetch('https://ecoloop-m6bz.onrender.com/api/scan', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setIsScanning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      pulseScale.value = withSpring(1);
      pulseOpacity.value = withTiming(0);
      
      // 4. Update UI with real backend result
      setScanResult(data.result || 'IDENTIFIED: UNKNOWN ITEM');

      setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 300 });
        if (data.result && data.result.includes("MOTOR")) {
          router.push('/match');
        } else {
           router.push('/diy');
        }
      }, 1500);

    } catch (error) {
      console.error('Scan Error:', error);
      setIsScanning(false);
      pulseScale.value = withSpring(1);
      pulseOpacity.value = withTiming(0);
      setScanResult('ERROR: CONNECTION FAILED');
      
      setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 300 });
      }, 2000);
    }
  };

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 100, letterSpacing: 2 }}>CAMERA ACCESS DENIED</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <CameraView ref={cameraRef} style={styles.cameraViewfinder} facing="back">
          <LinearGradient colors={['#050505', 'transparent', 'transparent', '#050505']} locations={[0, 0.2, 0.8, 1]} style={StyleSheet.absoluteFill} />

          <GestureDetector gesture={gesture}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]} collapsable={false}>
              <Animated.View style={[styles.reticleContainer, animatedHudStyle]}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
                
                <View style={styles.crosshairCenter}>
                  <View style={styles.dot} />
                </View>
              </Animated.View>

              {!scanResult && (
                <Animated.View style={[styles.scanLineContainer, animatedLineStyle]}>
                  <LinearGradient colors={['transparent', '#00FF66', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scanLine} />
                </Animated.View>
              )}
            </Animated.View>
          </GestureDetector>

          <Animated.View style={[styles.overlayContainer, animatedOverlayStyle]} pointerEvents="none">
            {isScanning && (
              <BlurView intensity={80} tint="dark" style={styles.overlay}>
                <Animated.View style={[styles.pulseRing, animatedPulseStyle]} />
                <ActivityIndicator size="large" color="#00FF66" style={{ marginBottom: 20 }} />
                <Text style={styles.processingText}>{useScrambleText('ANALYZING STRUCTURE...', isScanning)}</Text>
                <Text style={styles.subProcessingText}>Executing via ONNX Runtime & Ryzen NPU</Text>
              </BlurView>
            )}
            
            {scanResult !== '' && !isScanning && (
              <BlurView intensity={80} tint="dark" style={styles.resultOverlay}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark" size={24} color="#050505" />
                </View>
                <Text style={styles.resultText}>{scanResult}</Text>
              </BlurView>
            )}
          </Animated.View>
        </CameraView>
      </View>

      <Animated.View style={[styles.controls, animatedControlsStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>HARDWARE SCANNER</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.recordDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.demoButtons}>
          <ScanButton 
            title="INITIATE SCAN" 
            icon="scan" 
            premium={true}
            onPress={initiateHardwareScan} 
          />
        </View>
      </Animated.View>
      <View style={{ height: 120 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  backgroundContainer: { flex: 1 },
  cameraViewfinder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reticleContainer: { width: '100%', maxWidth: 400, aspectRatio: 1, position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  crosshairCenter: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  dot: { width: 4, height: 4, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 },
  scanLineContainer: { position: 'absolute', width: '100%', height: 2, alignItems: 'center', zIndex: 10 },
  scanLine: { width: '80%', maxWidth: 450, height: '100%', shadowColor: '#00FF66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 },
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 20 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  pulseRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 2, borderColor: '#00FF66', backgroundColor: 'rgba(0, 255, 102, 0.05)' },
  processingText: { fontFamily: 'SpaceGrotesk_600SemiBold', color: '#00FF66', fontSize: 13, letterSpacing: 2, textAlign: 'center' },
  subProcessingText: { fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1, marginTop: 8 },
  resultOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0, 255, 102, 0.05)' },
  successIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00FF66', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#00FF66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20 },
  resultText: { fontFamily: 'SpaceGrotesk_700Bold', color: '#fff', fontSize: 14, textAlign: 'center', letterSpacing: 1.5 },
  controls: { padding: 24, backgroundColor: '#050505', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 3 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  recordDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 6 },
  liveText: { fontFamily: 'SpaceGrotesk_700Bold', color: '#FF3B30', fontSize: 10, letterSpacing: 1 },
  demoButtons: { flexDirection: 'row', gap: 12 },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#00FF66', opacity: 0.6 },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 1, borderRightWidth: 1, borderColor: '#00FF66', opacity: 0.6 },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: '#00FF66', opacity: 0.6 },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#00FF66', opacity: 0.6 },
});
