import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Check if user is authenticated
  // TODO: Check if onboarding is completed

  // For now, always redirect to onboarding
  return <Redirect href="/(onboarding)/welcome" />;
}
