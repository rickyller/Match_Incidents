import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  final List<String> _messageQueue = [];
  bool _isSending = false;

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
      body: Column(
        children: [
          Expanded(
            child: Chat(
              messages: _messages,
              onSendPressed: _handleSendPressed,
              user: _user,
              customMessageBuilder: _customMessageBuilder,
            ),
          ),
        ],
      ),
    );
  }

  Widget _customMessageBuilder(types.Message message, {required int messageWidth}) {
    if (message is types.TextMessage) {
      return Container(
        margin: const EdgeInsets.symmetric(vertical: 5.0),
        padding: const EdgeInsets.all(10.0),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Text(
                message.text,
                style: const TextStyle(color: Colors.black),
              ),
            ),
            const Icon(Icons.copy, color: Colors.blue, size: 24),
          ],
        ),
      );
    }
    return const SizedBox.shrink();
  }


  void _copyMessageToClipboard(types.Message message) {
    Clipboard.setData(ClipboardData(text: (message as types.TextMessage).text)).then((_) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Texto copiado'),
        ),
      );
    });
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

    _enqueueMessage(message.text);
  }

  void _enqueueMessage(String message) {
    _messageQueue.add(message);
    if (!_isSending) {
      _processQueue();
    }
  }

  void _processQueue() async {
    if (_messageQueue.isNotEmpty) {
      _isSending = true;
      final message = _messageQueue.removeAt(0);
      final response = await _sendMessageToServer(message);

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
      _isSending = false;
      _processQueue();
    }
  }

  Future<String?> _sendMessageToServer(String message) async {
    const url = 'https://match-incidents-gmpuppbwwq-uc.a.run.app/generate';
    final headers = {'Content-Type': 'application/json'};
    final body = json.encode({'input': message});

    try {
      final response = await http.post(Uri.parse(url), headers: headers, body: body);

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return jsonResponse['output'];
      } else {
        _showError('Error: ${response.statusCode}');
      }
    } catch (e) {
      _showError('Error: $e');
    }

    return null;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }
}
