export class EarningsInput {
    date: Date;
    category: string;
    value: string;

    constructor(date: Date = new Date(), category: string = "", value: string = "") {
        this.date = date;        
        this.category = category;
        this.value = value;
    }
}
