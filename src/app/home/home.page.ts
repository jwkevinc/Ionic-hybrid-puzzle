import { Component } from '@angular/core';
import {QuestionService} from '../../services/question/question.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  level = 1;
  alive = true;
  timer = 3000;
  correctCount = 0;
  recordCount = 0;
  intervalId = undefined;

  question = {
    json: undefined,
    string: undefined,
    answer: undefined,
  }

  userAnswer = new Set();

  constructor(
    private questionService: QuestionService) {
  }

  ngOnInit(): void {
    this.question = this.questionService.generate();
    this.refreshTimer();
  }

  refreshTimer() {
    // clear Interval if it exists
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.timer = 3000;
    }
    // create new interval
    this.intervalId = setInterval(() => {
      if (this.alive) {
        this.timer = this.timer - 10;
      }
      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        this.alive = false;
      }
    }, 10)
  }

  restart() {
    this.alive = true;
    this.correctCount = 0;
    this.newQuestion();
  }

  newQuestion() {
    this.question = this.questionService.generate(this.question);
    this.userAnswer = new Set();
    this.refreshTimer();
  }

  clickSquare(color){
    this.userAnswer.add(color);
    let check = this.questionService.checkAnswer(this.question.answer, Array.from(this.userAnswer));
    switch (check) {
      case 'correct':
        this.newQuestion();
        this.correctCount += 1;
        if (this.correctCount >= this.recordCount)
          this.recordCount = this.correctCount;
        break;
      case 'incorrect':
        this.alive = false;
        break;
      case 'partial':
        break;
    }
  }

}
