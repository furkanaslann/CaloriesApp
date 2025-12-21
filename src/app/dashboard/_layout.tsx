/**
 * CaloriTrack - Dashboard Layout
 * Minimal. Cool. Aesthetic.
 */

import { Stack } from 'expo-router';
import React from 'react';

const DashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Dashboard', headerShown: false }} />
      <Stack.Screen name="camera" options={{ title: 'Kamera', headerShown: false }} />
      <Stack.Screen name="plan" options={{ title: 'Planlar', headerShown: false }} />
      <Stack.Screen name="progress" options={{ title: 'İlerleme', headerShown: false }} />
      <Stack.Screen name="community" options={{ title: 'Topluluk', headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profil', headerShown: false }} />
      <Stack.Screen name="goals" options={{ title: 'Hedefler', headerShown: false }} />
      <Stack.Screen name="recipes" options={{ title: 'Tarifler', headerShown: false }} />
      <Stack.Screen name="meals-list" options={{ title: 'Yemekler Listesi', headerShown: false }} />
      <Stack.Screen name="getting-started" options={{ title: 'Başlangıç', headerShown: false }} />
    </Stack>
  );
};

export default DashboardLayout;