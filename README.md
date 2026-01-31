# AI-Diary (AI日記)

プライバシー重視の、完全オフライン対応エモーショナル日記アプリ。

## 🌟 概要
「Wordless-Diary」は、日々の感情を記録し、AI（ローカルLLM）との対話を通じて自分自身を客観的に見つめ直すためのアプリです。
インターネットにデータを送信することなく、デバイス上ですべての処理を行うため、究極のプライバシーを確保しています。

## ✨ 特徴
- **完全オフラインAI**: スマホ内で動作するローカルLLM（Gemma-3 1B）を搭載。
- **音声対話 (Live Consultation)**: Qwen3-TTSエンジンの音声合成による、寄り添うような対話体験。
- **感情の可視化**: その日の気分を色とアイコンで記録し、カレンダー形式で振り返り。
- **プライバシーファースト**: 全ての日記・対話データはスマホ内（SQLite）にのみ保存されます。

## 🚀 セットアップ
本プロジェクトは Expo (React Native) とネイティブモジュール (llama.cpp) で構成されています。

### 1. 依存関係のインストール
```bash
npm install
```

### 2. ネイティブプロジェクトの生成
```bash
npx expo prebuild
```

### 3. AIモデルの準備
アプリ起動時に自動ダウンロードされますが、手動で配置する場合は以下のファイルを `files` ディレクトリに保存してください。
- `llm_model.gguf` (思考用)
- `tts_model.gguf` (音声用)

## 🛠 技術スタック
- **Frontend**: React Native (Expo)
- **State**: Zustand
- **Database**: SQLite (expo-sqlite)
- **AI Engine**: native llama.cpp (JNI Bridge)
- **Design**: Clover Next Custom Theme

## ⚖️ 免責事項・著作権
- 本ソフトウェアは **Clover Next** によって提供されています。
- 使用されているAIモデル（Gemma-3, Qwen-TTS）の著作権は、それぞれの権利者に帰属します。
- 本アプリの著作権は **Clover Next** に帰属します。

---
Produced by **Clover Next**
