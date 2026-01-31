import { NativeModules } from 'react-native';

const { LlamaContext } = NativeModules;
const { NativeAI } = NativeModules;

export interface AIService {
    generateResponse(prompt: string, category: string, userName?: string): Promise<string>;
}

/**
 * Qwen3-TTS (Ono_Anna) inspired Mock Service.
 * Playful, human-like, yet quiet and objective observations.
 */
class MockAIService implements AIService {
    async generateResponse(prompt: string, category: string, userName: string = 'あなた'): Promise<string> {
        // Simulate network/inference delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responses: { [key: string]: string[] } = {
            '悩み': [
                `${userName}さんがそう感じてしまうのは、とても自然なことですよ。一歩ずつ、整理していきましょう。`,
                `そのお悩み、${userName}さんの優しさゆえかもしれませんね。まずは自分を責めないでください。`,
                `抱え込みすぎていませんか？${userName}さんの心が少しでも軽くなるヒントを探しましょう。`
            ],
            '喜び': [
                `わぁ、それは素晴らしいですね、${userName}さん！その喜び、私も分けてもらえますか？`,
                `${userName}さんの笑顔が目に浮かびます。その幸せな気持ち、大切にしてくださいね。`,
                `小さなことでも、喜びを感じられる${userName}さんは素敵です。私も嬉しいです。`
            ],
            '日常': [
                `${userName}さんの日常に、そっと寄り添う言葉を。今日も一日、お疲れ様でした。`,
                `何気ない一日も、${userName}さんにとっては大切な時間。ゆっくりと過ごしてくださいね。`,
                `ふふ、${userName}さんの日常が、少しでも穏やかでありますように。`
            ],
            'その他': [
                `ふふ、その気持ち、よくわかりますよ。今は少しだけ、深呼吸してみませんか？`,
                `あなたの心の中に、小さな光が見えました。それを大切に守っていきましょうね。`,
                `大丈夫。焦らなくても、時間はゆっくりと流れています。あなたのペースでいいんですよ。`,
                `ざわついた心も、いつかは静かな海のように落ち着きます。今はただ、波の音を聴いていましょう。`,
                `その言葉にできない思い、私がそっと受け止めます。あなたは一人じゃないですよ。`,
                `今日はもう、自分をたくさん褒めてあげてください。よく頑張りましたね。`
            ]
        };

        const categoryResponses = responses[category] || responses['その他'];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
}

class NativeAIServiceImpl implements AIService {
    async generateResponse(prompt: string, category: string, userName: string = 'あなた'): Promise<string> {
        if (!NativeAI) return new MockAIService().generateResponse(prompt, category, userName);

        try {
            // Enhanced system prompt with user name personalization
            const systemPrompt = `あなたは「Wordless Diary」の専属AIです。${userName}さんの良き理解者として、穏やかで客観的な日本語で回答してください。`;
            const fullPrompt = `${systemPrompt}\n\nユーザーの相談 (${category}): ${prompt}\n\nAIの回答:`;

            return await NativeAI.predict(fullPrompt);
        } catch (e) {
            console.error("AI inference error:", e);
            return "申し訳ありません、考えをまとめるのに少し時間がかかりそうです。";
        }
    }
}

export const aiService = NativeAI ? new NativeAIServiceImpl() : new MockAIService();
