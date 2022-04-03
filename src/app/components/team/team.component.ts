import { Component, Input, OnInit } from '@angular/core';
import { MISTERY_MAN_IMAGE_PATH } from 'src/app/constants/constants';
import { Hero } from 'src/app/interfaces/hero';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input() public team: Array<Hero> ;
  public misteryManImagePath = MISTERY_MAN_IMAGE_PATH;
  public misteryManImageArray = Array(5).fill(0);

  constructor() { }

  ngOnInit(): void {
  }

  public get isEmpty(): boolean {
    return this.team?.length === 0 || this.team === undefined;
  }

  public onImgError(event): void {
    event.target.src = this.misteryManImagePath;
   }

   roundStat(stat: number): number {
     return Math.floor(stat);
   }


}
