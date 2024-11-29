import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import * as fs from 'fs';
import * as path from 'path';

// AI 모델 설정
const chatModel = new ChatOpenAI({
  model: process.env.AI_MODEL,
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

// 감정 상태에 맞는 게임 3가지를 추천해 달라는 프롬프트
// 추후 다른 컨텐츠 추천이 추가되면 데이터로 변경
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are an assistant who recommends 3 games that match my emotions. You recommend PC and console games. Please provide the game title and a brief one-sentence description, and answer in Korean.',
  ],
  ['user', 'Recommend me game to play when I am feeling {text}'],
]);

@Injectable()
export class MoodService implements OnModuleInit {
  private emotionMap: Map<number, string>;

  onModuleInit() {
    this.loadData();
  }

  // 감정 종류 파일 읽어오기
  private loadData() {
    const jsonPath = path.join('./data', 'emotion.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonData);
    this.emotionMap = new Map<number, string>();
    for (const emo of data.emotions) {
      this.emotionMap.set(emo.id, emo.emotion);
    }
  }

  // 게임 추천
  async recommendGame(emotion: number) {
    const myMood = this.emotionMap.get(emotion);
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(chatModel).pipe(outputParser);
    const response = await chain.invoke({
      text: myMood,
    });
    return response;
  }
}
