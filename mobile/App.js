import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoadingScreen from './src/components/LoadingScreen';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import ExporterDashboard from './src/screens/exporter/ExporterDashboard';
import ShipmentsScreen from './src/screens/exporter/ShipmentsScreen';
import CreateShipmentScreen from './src/screens/exporter/CreateShipmentScreen';
import PreShipmentScreen from './src/screens/exporter/PreShipmentScreen';
import PostShipmentScreen from './src/screens/exporter/PostShipmentScreen';
import BuyersScreen from './src/screens/exporter/BuyersScreen';
import ChaBookingScreen from './src/screens/exporter/ChaBookingScreen';
import ForwarderBookingScreen from './src/screens/exporter/ForwarderBookingScreen';
import DocumentationScreen from './src/screens/exporter/DocumentationScreen';

import FarmerDashboard from './src/screens/farmer/FarmerDashboard';
import ProductsScreen from './src/screens/farmer/ProductsScreen';

import CHADashboard from './src/screens/cha/CHADashboard';
import CustomsClearanceScreen from './src/screens/cha/CustomsClearanceScreen';
import ChaAgentsScreen from './src/screens/cha/ChaAgentsScreen';

import ForwarderDashboard from './src/screens/forwarder/ForwarderDashboard';
import ForwarderShipmentsScreen from './src/screens/forwarder/ForwarderShipmentsScreen';

import AdviserDashboard from './src/screens/adviser/AdviserDashboard';
import ConsultationsScreen from './src/screens/adviser/ConsultationsScreen';

import ChatScreen from './src/screens/shared/ChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = { headerShown: false };

const tabOptions = {
  tabBarStyle: {
    backgroundColor: '#1a1a2e',
    borderTopColor: '#2a2a4e',
    paddingBottom: 8,
    paddingTop: 6,
    height: 64,
  },
  tabBarActiveTintColor: '#6366f1',
  tabBarInactiveTintColor: '#a8b2d8',
  tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  headerShown: false,
};

// Exporter Stack - handles screens that push on top of tabs
const ExporterHomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="ExporterHome" component={ExporterDashboard} />
    <Stack.Screen name="PreShipment" component={PreShipmentScreen} />
    <Stack.Screen name="PostShipment" component={PostShipmentScreen} />
    <Stack.Screen name="Documentation" component={DocumentationScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const ExporterShipmentsStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="ShipmentsList" component={ShipmentsScreen} />
    <Stack.Screen name="CreateShipment" component={CreateShipmentScreen} />
    <Stack.Screen name="PreShipment" component={PreShipmentScreen} />
    <Stack.Screen name="PostShipment" component={PostShipmentScreen} />
  </Stack.Navigator>
);

const ExporterBuyersStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="BuyersList" component={BuyersScreen} />
    <Stack.Screen name="CreateShipment" component={CreateShipmentScreen} />
  </Stack.Navigator>
);

// Exporter bottom tabs
const ExporterTabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen
      name="Home"
      component={ExporterHomeStack}
      options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }}
    />
    <Tab.Screen
      name="Shipments"
      component={ExporterShipmentsStack}
      options={{ tabBarLabel: 'Shipments', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📦</Text> }}
    />
    <Tab.Screen
      name="Buyers"
      component={ExporterBuyersStack}
      options={{ tabBarLabel: 'Buyers', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👥</Text> }}
    />
    <Tab.Screen
      name="CHA"
      component={ChaBookingScreen}
      options={{ tabBarLabel: 'CHA', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛃</Text> }}
    />
    <Tab.Screen
      name="Forwarder"
      component={ForwarderBookingScreen}
      options={{ tabBarLabel: 'Forwarder', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🚚</Text> }}
    />
    <Tab.Screen
      name="Adviser"
      component={ConsultationsScreen}
      options={{ tabBarLabel: 'Adviser', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💼</Text> }}
    />
  </Tab.Navigator>
);

const FarmerChatScreen = () => <ChatScreen userRole="farmer" />;

const FarmerTabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen name="Dashboard" component={FarmerDashboard} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
    <Tab.Screen name="Products" component={ProductsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🌾</Text> }} />
    <Tab.Screen name="Chat" component={FarmerChatScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);

const CHATabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen name="Dashboard" component={CHADashboard} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
    <Tab.Screen name="Customs" component={CustomsClearanceScreen} options={{ tabBarLabel: 'Customs', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛃</Text> }} />
    <Tab.Screen name="Agents" component={ChaAgentsScreen} options={{ tabBarLabel: 'Agents', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📑</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);

const ForwarderChatScreen = () => <ChatScreen userRole="forwarder" />;

const ForwarderTabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen name="Dashboard" component={ForwarderDashboard} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
    <Tab.Screen name="Shipments" component={ForwarderShipmentsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🚢</Text> }} />
    <Tab.Screen name="Chat" component={ForwarderChatScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);

const AdviserChatScreen = () => <ChatScreen userRole="adviser" />;

const AdviserTabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen name="Dashboard" component={AdviserDashboard} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
    <Tab.Screen name="Consultations" component={ConsultationsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💼</Text> }} />
    <Tab.Screen name="Chat" component={AdviserChatScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);

const BeginnerTabs = () => (
  <Tab.Navigator screenOptions={tabOptions}>
    <Tab.Screen name="Dashboard" component={ExporterDashboard} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🌱</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    if (role === 'exporter') return <ExporterTabs />;
    if (role === 'farmer') return <FarmerTabs />;
    if (role === 'cha') return <CHATabs />;
    if (role === 'forwarder') return <ForwarderTabs />;
    if (role === 'adviser') return <AdviserTabs />;
    return <BeginnerTabs />;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
