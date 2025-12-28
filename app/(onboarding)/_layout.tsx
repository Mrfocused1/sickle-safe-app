import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="community" />
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="overcomer/productivity" />
            <Stack.Screen name="overcomer/red-alert" />
            <Stack.Screen name="helper/real-time-alerts" />
            <Stack.Screen name="helper/actionable-support" />
            <Stack.Screen name="volunteer/advocacy" />
            <Stack.Screen name="overcomer/safety-net" />
            <Stack.Screen name="overcomer/triggers" />
            <Stack.Screen name="charity-onboarding/organization-info" />
            <Stack.Screen name="charity-onboarding/funding-goals" />
            <Stack.Screen name="charity-onboarding/impact-areas" />
            <Stack.Screen name="charity-onboarding/verification" />
        </Stack>
    );
}
