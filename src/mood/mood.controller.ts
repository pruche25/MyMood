import { Controller, Get, Param } from '@nestjs/common';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
  constructor(private moodService: MoodService) {}

  // 감정 상태에 맞는 게임 3가지 추천
  // 감정 이름은 emotion.json, emotion_ko.txt 파일 참고
  @Get('/recommendGame/:emotion')
  async recommendGame(@Param('emotion') emotion: string) {
    const emotionNum = parseInt(emotion, 10);
    const game = await this.moodService.recommendGame(emotionNum);
    return game;
  }
}
