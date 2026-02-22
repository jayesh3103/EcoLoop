import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import ScanButton from '../../components/ScanButton';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const simulateScan = (type) => {
    setIsScanning(true);
    setScanResult('');
    
    // Simulate processing time
    setTimeout(() => {
      setIsScanning(false);
      
      if (type === 'motor') {
        setScanResult('Identified: Stepper Motor (98% Confidence)');
        setTimeout(() => {
          router.push('/match');
        }, 1500);
      } else if (type === 'fan') {
        setScanResult('Identified: Broken PC Fan (95% Confidence)');
        // Try to match, no match found -> DIY Fallback
        setTimeout(() => {
          router.push('/diy');
        }, 1500);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraViewfinder}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
        
        {isScanning && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.processingText}>Processing on AMD Ryzen NPU...</Text>
            {/* AMD NPU Offload Simulation: In reality, this would be a YOLOv8 ONNX model running locally via Vitis AI EP */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Low Power Edge Compute</Text>
            </View>
          </View>
        )}
        
        {scanResult !== '' && !isScanning && (
          <View style={styles.resultOverlay}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.resultText}>{scanResult}</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.instruction}>Point camera at e-waste to identify</Text>
        
        <View style={styles.demoButtons}>
          <Text style={styles.demoLabel}>Demo Controls:</Text>
          <ScanButton 
            title="Simulate Scan: Stepper Motor" 
            icon="analytics" 
            color="#2E7D32" 
            onPress={() => simulateScan('motor')} 
          />
          <ScanButton 
            title="Simulate Scan: Broken Fan" 
            icon="analytics" 
            color="#607D8B" 
            onPress={() => simulateScan('fan')} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraViewfinder: {
    flex: 3,
    backgroundColor: '#111',
    margin: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  badgeText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  controls: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  instruction: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  demoButtons: {
    marginTop: 10,
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cornerTopLeft: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#4CAF50' },
  cornerTopRight: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#4CAF50' },
  cornerBottomLeft: { position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#4CAF50' },
  cornerBottomRight: { position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#4CAF50' },
});
