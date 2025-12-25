import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const communityImages = [
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFvjvCCSt2605T1lmL-NT2N564JX6j9HqnPp1MFUY5ACtcumOmDkRbXpUghjgkMkfx-hHma95axp7CsxMMC4ZZu1LLWJmtnSHu8Vx2EeTEEpPcAEMqjAUHfZRCOgeIOGV-4O4CCyWLcznSe4MMvW7v_IfhKt_utT690q0My-yLj76z6oRVQV4_xyNFL16KprmdltHZvEf_KBPiT-blnACJaQsC2wl1vjXGHYw3u6lqhbb918O4hmyWlWHmFr_Io2A9Ruvi4ASSiJrl', size: 96, top: '0%', left: '-8%', zIndex: 1 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TZP6VVCHVVCcAZgr7BQ0AGydVtiQhqOym6MeLDN53f1oybzn2H9n6AZqYUC7a4PSMAgOPGOxl0ZMj1Qw49q2OkZz6IaZaVu6vFXTb4DXBNFKBRUmd3TYvsRJsSf1ejt51K2W66qOs-JwipETfH-PZQWopCnK88h6GCcrgZdpmADh8m-r17ctjSZ2SRq1qBNIICAoGHomZJjIfwv9cLup58bk5Xf94vLs_EXpjJ_4uMXQbaeOOrUNp2mZxatkYqPxtDa3fLGHDdz1', size: 88, top: '8%', right: '5%', zIndex: 2 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4LUOBtWFhrnak4zyaezoOx4-3JxF81broRa2WhQd82iYUBWV1EBU4A-9gNV21EnHZqyJHc6_jSFDAEHpZHP35TsfCkV-Uzmy12QMhXhTv-SnfhpTjUFwZbVMbCe7o_kmBwj7Cs-NzZ8T98rWW_TIgTuFhLGLy2uoW-1GnYBRZjYR46G_7FJ_T8DLuoiAyH59b5kTPLtYvKBTBoR18PmVUGHRBo75THNXL6o-xUoRxuDgOSTqV_K3-n4nfPJnBuu87XeEF2qYAsS3k', size: 112, top: '12%', left: '25%', zIndex: 10 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkyQ9D3dwnVihObG0VeOvAQwyRsnMhTClwvihEEy_nyPMO-oobijnckVLyFCHJAdiydndXroQ84D9dYU-bg2I792R5FY3ddJKjyE7AOQEx_wXPySuctE_iRRrQcmLYUwX2ZauiyJ1FU6zWaY6r9JwXO9SdCvbVeRcCTO1BV1PnZ60csMwa5m5Zj1C1kHkCCq2Y2vN-3h-DUpDReF58-LQA9kl1V8lcbYODpYkl1iHQkxApeMMJVVtTjZPEh0T4tE_iWWZPdZ3Ol6i8', size: 88, top: '35%', left: '-5%', zIndex: 3 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dBnLQ-pNBU0ZOPEoBBpa0NDv0PgfELhc4U76c2ftXn4ZvItTTIU7G0KNMeJpBa2KmTgmZspQMis-3uzUL7gi1Xi3faUiKH-69F77_nYP0Bi9Zewhcj8PC4QALlgiJdJecvPTlqOHM1nLYfeEK8bAnllL1W6etyUM1suaHT4j7hfitt68SrUSxkzGfve-B8tXUIeAJchA3yVpUXJhw8gZswV0jhF1rplFPcX64nBlB-3Wogqrbq1C_VgtTIsfujnJPZO2yNF1OWWG', size: 128, top: '40%', left: '50%', zIndex: 20 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBudivC0uVRIVXZ7YdUbKIzYhogWrmL5sb7EkRh2kkmarUknjQlQZwypwmuP2KOOpyouUl7V1lg6dwiP7TA7I3PW2Ywk-z_ziy58vktV8Hjpvy83kc9us7BeNqlQQblyBs6prQPf4YpOEmcY8T2ly0KkcDY26KhAIa31Mgxa-FStiZU9bPtJS39SvoezOJanS0VFBUlo-nUTB5GnrxJd6qfFO0zzlegKmbmI82q142ef--TSIwDt6GwybWWT_tzfn7jzCx1qw8wjG8h', size: 80, top: '32%', right: '-8%', zIndex: 4 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPMvIGmnQR7CKjNvQZiSpeObDEwFRHp7PQwdsw3HUALNcg7_p0jnxMWNZttHSrfY-blyjkmfIxicUNAf4jR1YpI0oHyyz92PFYxIoF6RedFR1BggLH2BPhAxdkacz4Z62bLbydKnfhzOwbxJUvWX5cbWQtRxnbGEmBRwGaON8xGNNsHPuVWS16wBG9m7ap_fhFbO1kXU2Y7n2bCvz-bjirBBjsVzi-js99yEB8kzTpFNC5zw1Mw_YZ3bl_9vH8K76TqtEZt4jVzvnt', size: 104, top: '65%', left: '10%', zIndex: 5 },
  { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQYes4uXDOv2t-MEpL-SskQWyDYv-k0CvlIbypNSfRhxQmrRWGA3ttdvTTkHQK8ABSUrfqHV67DPPx-4FRkenXs_JwDg_Ylkl0GM9N6VjDd0KQHRkZsanvQMhTmHS64-FzQSMHl1P_c7eQGAIH50YXqS0jlAE2TyevD64wKSbLmNFuexWgrP_zQ10wX2isgGnRVlwg-85_LeTRW3255QiKXPuDjy0E5L45b2lSGpdhQXcP2mWgijwTBcbe5UceHsohe9ZHtmSdRnK2', size: 120, top: '60%', right: '10%', zIndex: 6 },
];

export default function CommunityScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1 justify-end">
        {/* Community Collage Section */}
        <View className="flex-1 relative pt-10 px-4">
          {communityImages.map((image, index) => (
            <View
              key={index}
              className="absolute rounded-full border-4 border-white shadow-xl overflow-hidden"
              style={{
                width: image.size,
                height: image.size,
                top: image.top as any,
                left: image.left as any,
                right: image.right as any,
                zIndex: image.zIndex,
              }}
            >
              <Image
                source={{ uri: image.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ))}

          {/* Gradient Fade at Bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(243, 244, 246, 1)']}
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ zIndex: 30 }}
          />
        </View>

        {/* Content Section */}
        <View className="items-center px-8 pb-12">
          <View className="mb-10">
            <Text className="text-4xl font-extrabold text-gray-900 text-center leading-tight tracking-tight mb-4">
              Join the Sickle Safe Community
            </Text>
            <Text className="text-lg text-gray-500 font-medium text-center leading-relaxed max-w-[300px]">
              Connect with a supportive network of Warriors, Helpers, and Volunteers.
            </Text>
          </View>

          {/* Progress Dots */}
          <View className="flex-row space-x-2 mb-8">
            <View className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </View>

          {/* Action Buttons */}
          <View className="w-full items-center space-y-5">
            <Text className="text-gray-500 font-medium">
              Existing account?{' '}
              {/* <Link href="/(auth)/login"> */}
              <Text className="text-gray-900 font-bold">Log in</Text>
              {/* </Link> */}
            </Text>

            <Link href="/(onboarding)/role-selection" asChild>
              <Pressable className="w-full bg-slate-700 py-4 rounded-full shadow-lg active:scale-95 transition-transform">
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-bold text-lg">Get Started</Text>
                  <ArrowRight size={20} color="#ffffff" className="ml-2" />
                </View>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
