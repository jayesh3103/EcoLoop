import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MatchResult = ({ need, onConnect }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.badgeText}>Match Found!</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.itemName}>{need.item}</Text>
        <Text style={styles.clubName}>Needed by: {need.club}</Text>
        
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>"{need.message}"</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
        <Text style={styles.connectButtonText}>Connect to Swap</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  content: {
    marginBottom: 20,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  messageBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  messageText: {
    fontStyle: 'italic',
    color: '#444',
  },
  connectButton: {
    backgroundColor: '#FFD700', // Accent color
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#333', // Dark text for contrast against gold
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  }
});

export default MatchResult;
