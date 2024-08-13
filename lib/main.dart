import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'loading_screen.dart'; // Asegúrate de importar tu LoadingScreen
import 'chat_page.dart'; // Asegúrate de importar tu ChatPage
import 'login.dart'; // Asegúrate de importar tu LoginPage
import 'package:firebase_auth/firebase_auth.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Incidents TDP Chat',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        iconTheme: IconThemeData(color: Colors.blue), // Agrega esto
      ),
      darkTheme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.dark,
        iconTheme: IconThemeData(color: Colors.white), // Agrega esto para modo oscuro
      ),
      themeMode: ThemeMode.light,
      home: const LoadingScreen(),
    );
  }
}

