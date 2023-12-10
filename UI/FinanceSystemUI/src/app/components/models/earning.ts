export class Earning {
    date: string;
    category: string;
    description: string;
    value: any;
    currency: string;

    constructor(date: string = "", category: string = "", description: string = "", value: string = "", currency: string = "") {
        this.date = date;        
        this.category = category;
        this.description = description;
        this.value = parseFloat(value);
        this.currency = currency;
    }
}
