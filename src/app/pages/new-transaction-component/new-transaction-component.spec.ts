import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransactionComponent } from './new-transaction-component';

describe('NewTransactionComponent', () => {
  let component: NewTransactionComponent;
  let fixture: ComponentFixture<NewTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTransactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTransactionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
