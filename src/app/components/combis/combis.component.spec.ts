import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombisComponent } from './combis.component';

describe('CombisComponent', () => {
  let component: CombisComponent;
  let fixture: ComponentFixture<CombisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
