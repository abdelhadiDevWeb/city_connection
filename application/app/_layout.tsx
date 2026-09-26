import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#090d16' },
          headerTintColor: '#f8fafc',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#090d16' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Apex Cloud Mobile',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign In',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
