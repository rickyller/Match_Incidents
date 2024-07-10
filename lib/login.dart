import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';
import 'chat_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: '789241953207-52qt27bonm31kjsi0rdb0e50bfk1b3ch.apps.googleusercontent.com',
  );

  @override
  void initState() {
    super.initState();
    _googleSignIn.onCurrentUserChanged.listen((GoogleSignInAccount? account) {
      if (account != null) {
        _handleSignIn(account);
      }
    });
    _googleSignIn.signInSilently();
  }

  Future<void> _handleSignIn(GoogleSignInAccount account) async {
    try {
      final GoogleSignInAuthentication googleAuth = await account.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential =
      await FirebaseAuth.instance.signInWithCredential(credential);
      if (userCredential.user != null) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const ChatPage()),
        );
      }
    } catch (error) {
      print('Error signing in with Google: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            GoogleSignInButton(
              clientId: '789241953207-52qt27bonm31kjsi0rdb0e50bfk1b3ch.apps.googleusercontent.com',
              onSignIn: _handleSignIn,
              onSignInError: (error) {
                print('Error signing in with Google: $error');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class GoogleSignInButton extends StatelessWidget {
  final String clientId;
  final Function(GoogleSignInAccount) onSignIn;
  final Function(String) onSignInError;

  const GoogleSignInButton({
    required this.clientId,
    required this.onSignIn,
    required this.onSignInError,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 10.0),
      child: SignInButton(
        Buttons.Google,
        text: "Sign in with Google",
        onPressed: () async {
          final GoogleSignIn _googleSignIn = GoogleSignIn(
            clientId: clientId,
          );
          try {
            final GoogleSignInAccount? account = await _googleSignIn.signIn();
            if (account != null) {
              onSignIn(account);
            }
          } catch (error) {
            onSignInError(error.toString());
          }
        },
      ),
    );
  }
}
