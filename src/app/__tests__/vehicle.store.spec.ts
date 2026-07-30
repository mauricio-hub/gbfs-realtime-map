import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Subject } from 'rxjs';
import { VehicleStore } from '../core/state/vehicle.store';
import { VehicleDataService } from '../core/services/vehicle-data.service';
import { Vehicle } from '../core/models/vehicle.model';

const vehicles$ = new Subject<Vehicle[]>();

const setup = () => {
    TestBed.configureTestingModule({
        providers: [
            provideZonelessChangeDetection(),
            VehicleStore,
            { provide: VehicleDataService, useValue: { vehicles$ } },
        ],
    });
    return TestBed.inject(VehicleStore);
};

describe('VehicleStore', () => {
    it('selectedId starts as null', () => {
        const store = setup();
        expect(store.selectedId()).toBeNull();
    });

    it('select() updates selectedId', () => {
        const store = setup();
        store.select('v1');
        expect(store.selectedId()).toBe('v1');
    });

    it('filter starts as all', () => {
        const store = setup();
        expect(store.filter()).toBe('all');
    });
});