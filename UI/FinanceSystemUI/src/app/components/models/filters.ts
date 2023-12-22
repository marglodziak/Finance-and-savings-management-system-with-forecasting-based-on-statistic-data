import { min } from "rxjs";

export class Filters {
    startDate: Date;
    endDate: Date;
    category: string;
    minValue: number;
    maxValue: number;
    numberOfItems: number;

    constructor(startDate: string, endDate: string, category: string, minValue: number, maxValue: number, numberOfItems: number) {
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.category = category;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.numberOfItems = numberOfItems;
    }
}