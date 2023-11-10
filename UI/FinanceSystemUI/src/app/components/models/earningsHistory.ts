export class EarningsHistory {
    date: string;
    category: string;
    value: number;

    constructor(date: Date = new Date(), category: string = "", value: string = "") {
        this.date = date.toLocaleDateString();    
        this.category = category;
        this.value = Number.parseFloat(value);
    }
}
