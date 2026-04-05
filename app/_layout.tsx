import { Stack } from "expo-router";
import { AuthProvider } from "../src/Provider/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}