import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const TAB_BAR_WIDTH = 240;
const TAB_WIDTH = TAB_BAR_WIDTH / 2;

function CustomTabBar({ state, descriptors, navigation }) {
  const { width } = useWindowDimensions();
  const indicatorPosition = useSharedValue(0);
  const tabBarY = useSharedValue(150);
  const tabBarOpacity = useSharedValue(0);

  useEffect(() => {
    indicatorPosition.value = withSpring(state.index * TAB_WIDTH, { mass: 0.5, damping: 15, stiffness: 200 });
  }, [state.index]);

  useEffect(() => {
    tabBarY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    tabBarOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarY.value }],
    opacity: tabBarOpacity.value,
  }));

  return (
    <Animated.View style={[styles.tabBarWrapper, { left: (width - TAB_BAR_WIDTH) / 2 }, animatedTabBarStyle]}>
      <View style={styles.tabBarContainer}>
        <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.tabBorder} />
        </View>

        {/* Sliding Indicator Background */}
        <Animated.View style={[styles.activeIndicatorBackground, animatedIndicatorStyle]} />

        {/* Tab Buttons */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const iconName = route.name === 'index' ? (isFocused ? 'apps' : 'apps-outline') : (isFocused ? 'scan' : 'scan-outline');
            const iconSize = route.name === 'index' ? 24 : 28;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.selectionAsync();
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabButton}
                activeOpacity={1}
              >
                <Animated.View style={styles.iconContainer}>
                  <Ionicons 
                    name={iconName} 
                    size={iconSize} 
                    color={isFocused ? "#00FF66" : "rgba(255,255,255,0.4)"} 
                  />
                </Animated.View>
                {/* Glowing Dot underneath active icon */}
                {isFocused && (
                  <Animated.View 
                    style={styles.activeDot} 
                    entering={undefined} // Reanimated config can be complex, simplifying
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#050505',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
          letterSpacing: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'EcoLoop' }} />
      <Tabs.Screen name="scanner" options={{ title: 'NPU VISION' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    width: TAB_BAR_WIDTH,
    height: 64,
    alignSelf: 'center',
    elevation: 0,
  },
  tabBarContainer: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(5, 5, 5, 0.4)',
  },
  tabBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 32,
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeIndicatorBackground: {
    position: 'absolute',
    width: TAB_WIDTH - 8,
    height: 56, // 64 total height - 8px inset
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    borderRadius: 28,
    zIndex: 1,
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FF66',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  }
});
