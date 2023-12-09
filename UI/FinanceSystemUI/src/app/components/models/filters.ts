import { min } from "rxjs";

export class Filters {
    startDate: string;
    endDate: string;
    category: string;
    minValue: number;
    maxValue: number;
    numberOfItems: number;

    constructor(startDate: string, endDate: string, category: string, minValue: number, maxValue: number, numberOfItems: number) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.category = category;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.numberOfItems = numberOfItems;
    }
}