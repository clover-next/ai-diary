import { NativeModules } from 'react-native';

const { LlamaContext } = NativeModules;

export interface AIService {
    reflect(prompt: string, context?: any): Promise<string>;
}

/**
 * Qwen3-TTS (Ono_Anna) inspired Mock Service.
 * Playful, human-like, yet quiet and objective observations.
 */
class MockAIService implements AIService {
    async reflect(prompt: string, context?: any): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const responses = [
            "ふふ、その気持ち、よくわかりますよ。今は少しだけ、深呼吸してみませんか？",
            "あなたの心の中に、小さな光が見えました。それを大切に守っていきましょうね。",
            "大丈夫。焦らなくても、時間はゆっくりと流れています。あなたのペースでいいんですよ。",
            "ざわついた心も、いつかは静かな海のように落ち着きます。今はただ、波の音を聴いていましょう。",
            "その言葉にできない思い、私がそっと受け止めます。あなたは一人じゃないですよ。",
            "今日はもう、自分をたくさん褒めてあげてください。よく頑張りましたね。"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
}

class NativeAIServiceImpl implements AIService {
    async reflect(prompt: string, context?: any): Promise<string> {
        if (!LlamaContext) {
            return new MockAIService().reflect(prompt, context);
        }
        try {
            // Prompt engineered for Qwen3-TTS Ono_Anna style persona
            const fullPrompt = `System: あなたは「小野アンナ」という名前の、明るく遊び心がありつつも、静かに寄り添う客観的な観察者です。助言や判断をせず、共感と観察を込めて、非常に簡潔な日本語で答えてください。
User: ${prompt}
AI:`;
            return await LlamaContext.predict(fullPrompt);
        } catch (e) {
            console.error(e);
            return "申し訳ありません。今は少しお休みが必要みたいです。";
        }
    }
}

export const aiService = LlamaContext ? new NativeAIServiceImpl() : new MockAIService();
