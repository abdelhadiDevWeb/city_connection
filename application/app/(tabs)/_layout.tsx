import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#ece7dd',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#18181b',
        tabBarInactiveTintColor: '#8c8c94',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fil Voisins',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Text style={styles.tabIcon}>{focused ? '🏠' : '🏡'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Text style={styles.tabIcon}>{focused ? '🔍' : '🔎'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Publier',
          tabBarIcon: ({ focused }) => (
            <View style={styles.createIconWrap}>
              <Text style={styles.createIconText}>＋</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mon Logement',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Text style={styles.tabIcon}>{focused ? '👤' : '👥'}</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
  activeIconWrap: {
    transform: [{ scale: 1.1 }],
  },
  createIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  createIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
