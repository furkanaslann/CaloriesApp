import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="name" options={{ headerShown: false }} />
      <Stack.Screen name="last-name" options={{ headerShown: false }} />
      <Stack.Screen name="date-of-birth" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="height" options={{ headerShown: false }} />
      <Stack.Screen name="weight" options={{ headerShown: false }} />
      <Stack.Screen name="profile-photo" options={{ headerShown: false }} />
      <Stack.Screen name="goals-primary" options={{ headerShown: false }} />
      <Stack.Screen name="goals-weight" options={{ headerShown: false }} />
      <Stack.Screen name="goals-weekly" options={{ headerShown: false }} />
      <Stack.Screen name="goals-timeline" options={{ headerShown: false }} />
      <Stack.Screen name="goals-motivation" options={{ headerShown: false }} />
      <Stack.Screen name="activity" options={{ headerShown: false }} />
      <Stack.Screen name="occupation" options={{ headerShown: false }} />
      <Stack.Screen name="exercise-types" options={{ headerShown: false }} />
      <Stack.Screen name="exercise-frequency" options={{ headerShown: false }} />
      <Stack.Screen name="sleep-hours" options={{ headerShown: false }} />
      <Stack.Screen name="diet" options={{ headerShown: false }} />
      <Stack.Screen name="allergies" options={{ headerShown: false }} />
      <Stack.Screen name="intolerances" options={{ headerShown: false }} />
      <Stack.Screen name="disliked-foods" options={{ headerShown: false }} />
      <Stack.Screen name="cultural-restrictions" options={{ headerShown: false }} />
      <Stack.Screen name="camera-tutorial" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="summary" options={{ headerShown: false }} />
      <Stack.Screen name="commitment" options={{ headerShown: false }} />
      <Stack.Screen name="account-creation" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}