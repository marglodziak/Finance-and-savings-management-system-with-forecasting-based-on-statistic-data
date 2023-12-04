export class Earning {
    date: string;
    category: string;
    value: number;

    constructor(date: string = "", category: string = "", value: string = "") {
        this.date = date;        
        this.category = category;
        this.value = parseFloat(value);
    }
}
