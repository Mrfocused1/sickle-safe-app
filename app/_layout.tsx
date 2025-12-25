import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      {/* Onboarding Flow */}
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />

      {/* Auth Flow - TO BE BUILT */}
      {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}

      {/* Main App Flows */}
      <Stack.Screen name="(warrior)" options={{ headerShown: false }} />
      <Stack.Screen name="(helper)" options={{ headerShown: false }} />
      <Stack.Screen name="(volunteer)" options={{ headerShown: false }} />

      {/* Shared Screens */}
      <Stack.Screen
        name="medical-id"
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="circle"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      {/* Settings Sub-pages */}
      <Stack.Screen name="settings/account" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/notifications" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/security" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/help" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/medical-team" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/medical-records" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings/training" options={{ presentation: 'card' }} />

      {/* Community Sub-pages */}
      <Stack.Screen name="community/groups" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/compose" options={{ presentation: 'modal' }} />
      <Stack.Screen name="community/history" options={{ presentation: 'card' }} />

      {/* Community Update Detail Pages */}
      <Stack.Screen name="community/updates/advocacy-kit" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/updates/blood-drive-tips" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/updates/council-meeting" options={{ presentation: 'card' }} />

      {/* Community Group Detail Pages */}
      <Stack.Screen name="community/groups-detail/atlanta-warriors" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/groups-detail/caregiver-strength" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/groups-detail/research-trials" options={{ presentation: 'card' }} />
      <Stack.Screen name="community/groups-detail/daily-victories" options={{ presentation: 'card' }} />

      {/* <Stack.Screen
        name="tasks/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="tasks/new"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      /> */}
    </Stack>
  );
}
