import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="match" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="diy" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
