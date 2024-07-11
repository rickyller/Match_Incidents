import 'package:flutter/material.dart';
import 'chat_page.dart'; // Asegúrate de importar tu ChatPage
import 'login.dart'; // Asegúrate de importar tu LoginPage
import 'package:firebase_auth/firebase_auth.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({Key? key}) : super(key: key);

  @override
  _LoadingScreenState createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..repeat(reverse: true);

    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    _navigateToNextScreen();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _navigateToNextScreen() async {
    await Future.delayed(const Duration(seconds: 3)); // Simula una carga de 3 segundos
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) =>
        FirebaseAuth.instance.currentUser == null ? const LoginPage() : const ChatPage(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FadeTransition(
              opacity: _animation,
              child: Image.asset(
                'assets/logo.png', // Asegúrate de colocar la imagen en la carpeta correcta y actualizar la ruta
                width: 500, // Ajusta el tamaño según sea necesario
                height: 500,
              ),
            ),
            const SizedBox(height: 20),
            AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Incidents TDP Chat by Ricardo Murillo',
                  textStyle: const TextStyle(
                    fontFamily: 'Orbitron',
                    fontSize: 18.0,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  speed: const Duration(milliseconds: 50),
                ),
              ],
              totalRepeatCount: 1,
              pause: const Duration(milliseconds: 500),
              displayFullTextOnTap: true,
              stopPauseOnTap: true,
            ),
          ],
        ),
      ),
    );
  }
}
