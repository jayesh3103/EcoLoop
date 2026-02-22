import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CarbonCard = ({ co2Saved }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Impact</Text>
      <View style={styles.ringContainer}>
        <View style={styles.ring}>
          <Text style={styles.amount}>{co2Saved}</Text>
          <Text style={styles.unit}>kg CO2 Saved</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>You're actively reducing campus e-waste!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  ringContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ring: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  }
});

export default CarbonCard;
