import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class QuestionService {

  randomOptions = {
    colors: {
      easy: ['red', 'yellow', 'green']
    },
    operators: ['only', 'except']
  }

  randomQuestion = {
    colors: undefined,
    operator: undefined,
  }

  randomQuestionAnswer = undefined;

  constructor() {
  }

  generate(previousQuestion?) {
    let randomNumber = _.random(1,2);
    this.randomQuestion.colors = _.sampleSize(this.randomOptions.colors.easy, randomNumber);
    this.randomQuestion.operator = _.sample(this.randomOptions.operators);
    let newQuestion = {
      json: this.randomQuestion,
      string: this.toString(),
      answer: this.answer()
    }

    // 문제가 중복 되지 않도록 생성
    if (_.isEqual(newQuestion, previousQuestion)){
      this.generate(previousQuestion)
    } else {
      return newQuestion;
    }
  }

  toString() {
    return `Pick ${this.randomQuestion.operator} ${this.randomQuestion.colors.join(", ")}`;
  }

  answer() {
    switch(this.randomQuestion.operator) {
      case 'only':
        return this.randomQuestion.colors;
      case 'except':
        return _.without(this.randomOptions.colors.easy, ...this.randomQuestion.colors);
    }
  }

  checkAnswer(answer, userAnswer) {
    if (_.intersection(answer, userAnswer).length == 0)
      return 'incorrect'
    else if (_.isEqual(answer.sort(), userAnswer.sort()))
      return 'correct'
    else
      return 'partial'
  }

}