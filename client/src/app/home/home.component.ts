import {Component} from '@angular/core';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public question: string;
  public answer: string;

  constructor() {
    this.question = "Q: How much fun is doing your laundry?";
    this.answer = "A: Loads"
  }
}
