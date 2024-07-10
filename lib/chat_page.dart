import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:uuid/uuid.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final List<types.Message> _messages = [];
  late types.User _user;
  final _bot = const types.User(id: 'bot');
  final Uuid _uuid = const Uuid();

  @override
  void initState() {
    super.initState();
    _initializeUser();
  }

  void _initializeUser() {
    final firebaseUser = FirebaseAuth.instance.currentUser;
    _user = types.User(id: firebaseUser!.uid);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Incidents TDP Chat'),
      ),
      body: Chat(
        messages: _messages,
        onSendPressed: _handleSendPressed,
        user: _user,
      ),
    );
  }

  void _handleSendPressed(types.PartialText message) async {
    final textMessage = types.TextMessage(
      author: _user,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: _uuid.v4(),
      text: message.text,
    );

    setState(() {
      _messages.insert(0, textMessage);
    });

    final response = await _sendMessageToServer(message.text);

    if (response != null) {
      final botMessage = types.TextMessage(
        author: _bot,
        createdAt: DateTime.now().millisecondsSinceEpoch,
        id: _uuid.v4(),
        text: response,
      );

      setState(() {
        _messages.insert(0, botMessage);
      });
    }
  }

  Future<String?> _sendMessageToServer(String message) async {
    const url = 'https://match-incidents-gmpuppbwwq-uc.a.run.app/generate'; // Actualiza esta URL con la URL de tu servicio en Cloud Run
    final headers = {'Content-Type': 'application/json'};
    final body = json.encode({'input': message});

    try {
      final response = await http.post(Uri.parse(url), headers: headers, body: body);

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return jsonResponse['output'];
      } else {
        print('Error: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
    }

    return null;
  }
}
