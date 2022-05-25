import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSessionInfoComponent } from './admin-session-info.component';

describe('AdminSessionInfoComponent', () => {
	let component: AdminSessionInfoComponent;
	let fixture: ComponentFixture<AdminSessionInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ AdminSessionInfoComponent ]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminSessionInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
