import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import CarbonCard from '../../components/CarbonCard';
import ScanButton from '../../components/ScanButton';
import { userStats, recentActivity } from '../../data';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, Eco-Warrior!</Text>
        <Text style={styles.points}>{userStats.ecoPoints} EcoPoints</Text>
      </View>

      <CarbonCard co2Saved={userStats.co2Saved} />

      <View style={styles.actionContainer}>
        <ScanButton 
          title="Scan E-Waste" 
          icon="camera" 
          onPress={() => router.push('/(tabs)/scanner')} 
        />
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="refresh-circle" size={24} color="#2E7D32" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityText}>{activity.action}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionContainer: {
    marginVertical: 20,
  },
  activitySection: {
    marginTop: 10,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 8,
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  }
});
