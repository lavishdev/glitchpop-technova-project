import 'package:equatable/equatable.dart';

class SuggestionModel extends Equatable {
  final String id;
  final String title;
  final String iconName;
  final String prompt;

  const SuggestionModel({
    required this.id,
    required this.title,
    required this.iconName,
    required this.prompt,
  });

  @override
  List<Object?> get props => [id, title, iconName, prompt];
}
