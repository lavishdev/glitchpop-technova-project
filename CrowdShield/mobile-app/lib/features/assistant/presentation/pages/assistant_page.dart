import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../providers/assistant_provider.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/chat_input_bar.dart';
import '../widgets/suggestion_cards_row.dart';
import '../widgets/typing_indicator.dart';

class AssistantPage extends ConsumerStatefulWidget {
  const AssistantPage({super.key});

  @override
  ConsumerState<AssistantPage> createState() => _AssistantPageState();
}

class _AssistantPageState extends ConsumerState<AssistantPage> {
  final _inputController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend([String? text]) {
    final prompt = text ?? _inputController.text;
    if (prompt.trim().isEmpty) return;

    ref.read(assistantProvider.notifier).sendMessage(prompt);
    _inputController.clear();
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(assistantProvider);
    final notifier = ref.read(assistantProvider.notifier);

    ref.listen(assistantProvider, (prev, next) {
      if (prev?.messages.length != next.messages.length || next.isTyping) {
        _scrollToBottom();
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'AI Safety Assistant',
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.textSecondary),
            tooltip: 'Clear Chat',
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => ConfirmationDialog(
                  title: 'Clear Conversation',
                  message: 'Are you sure you want to clear chat history?',
                  confirmText: 'Clear',
                  onConfirm: () => notifier.clearChat(),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          SuggestionCardsRow(
            suggestions: state.suggestions,
            onSelectPrompt: (prompt) => _handleSend(prompt),
          ).animate().fadeIn(duration: 300.ms),
          const Divider(height: 1, color: AppColors.border),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16.0),
              itemCount: state.messages.length + (state.isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index < state.messages.length) {
                  final message = state.messages[index];
                  return ChatBubble(message: message).animate().fadeIn(duration: 250.ms);
                } else {
                  return const TypingIndicator().animate().fadeIn(duration: 200.ms);
                }
              },
            ),
          ),
          ChatInputBar(
            controller: _inputController,
            isTyping: state.isTyping,
            onSend: () => _handleSend(),
          ),
        ],
      ),
    );
  }
}
