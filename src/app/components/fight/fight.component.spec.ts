import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FightComponent } from './fight.component';

describe('FightComponent', () => {
  let component: FightComponent;
  let fixture: ComponentFixture<FightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ FightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fullFight()', () => {
    
    it('if canFigth is false, should not call fightOneRound.', () => {
      spyOn<any>(component, 'canFight').and.returnValue(false);
      const fightOneRoundSpy = spyOn(component, 'fightOneRound').and.returnValue();
      component.fullFight();
      expect(fightOneRoundSpy).not.toHaveBeenCalled();
    }) 
  });

  describe('fightOneRound', () => {
    let setAliveHeroesSpy: jasmine.Spy;
    let attackTeamSpy: jasmine.Spy;

    beforeEach(() => {
      setAliveHeroesSpy = spyOn<any>(component, 'setAliveHeroes').and.callFake(()=>{});
      attackTeamSpy = spyOn<any>(component, 'attackTeam').and.callFake(()=>{});
      spyOn<any>(component, 'canFight').and.returnValue(true);
    })

    it('should do nothing if canFight is false.', () => {
      component.firstTeam = [];
      component.fightOneRound();
      expect(attackTeamSpy).not.toHaveBeenCalled();
      expect(setAliveHeroesSpy).not.toHaveBeenCalled();
    });

    it('should call AttackTeam twice and setAliveHeroes once if canFight is true.', () => {
      spyOnProperty(component, 'canFight', 'get').and.returnValue(true);
      component.fightOneRound();
      expect(attackTeamSpy).toHaveBeenCalledTimes(2);
      expect(setAliveHeroesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
