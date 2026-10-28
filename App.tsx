import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CheckoutScreen from './src/screens/CheckoutScreen';
import DishFormScreen from './src/screens/DishFormScreen';
import MenuScreen from './src/screens/MenuScreen';
import OrderScreen from './src/screens/OrderScreen';
import TablesScreen from './src/screens/TablesScreen';
import { StoreProvider } from './src/store';
import { colors } from './src/theme';

// Danh sách màn hình và tham số truyền vào từng màn.
export type RootStack = {
  Menu: undefined;
  DishForm: { id?: string } | undefined;
  Tables: undefined;
  Order: { table: number };
  Checkout: { table: number };
};

const Stack = createNativeStackNavigator<RootStack>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <StoreProvider>
        {/* Đặt ở gốc để tính đúng phần bàn phím che (tính cả header) → ô nhập và nút dưới cùng luôn nổi trên bàn phím. */}
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: '700' },
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Thực đơn' }} />
              <Stack.Screen
                name="DishForm"
                component={DishFormScreen}
                options={({ route }) => ({
                  title: route.params?.id ? 'Sửa món' : 'Thêm món',
                })}
              />
              <Stack.Screen name="Tables" component={TablesScreen} options={{ title: 'Sơ đồ bàn' }} />
              <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={({ route }) => ({
                  title: `Gọi món · Bàn ${route.params.table}`,
                })}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={({ route }) => ({
                  title: `Thanh toán · Bàn ${route.params.table}`,
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </KeyboardAvoidingView>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
