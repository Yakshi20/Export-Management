# ExportPro Mobile App

## Development
1. cd mobile
2. npm install
3. npx expo start

## Testing with Expo Go
1. Install Expo Go on your phone
2. Run npx expo start
3. Scan QR code

## Build APK (Android)
1. Install EAS CLI: npm install -g eas-cli
2. Login: eas login
3. Configure: eas build:configure
4. Build APK: eas build --platform android --profile preview

## Update API URL
In src/api/api.js, change baseURL for your environment:
- Android Emulator: http://10.0.2.2:5000/api
- Physical device: http://YOUR_LOCAL_IP:5000/api
- Production: https://your-backend-url/api
