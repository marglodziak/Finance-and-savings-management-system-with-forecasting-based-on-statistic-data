export class Earning {
    id: number;
    username: string;
    date: Date;
    category: string;
    description: string;
    value: any;
    currencyCode: string;
    currentValueInPLN: any;

    constructor(id: number, username: string, date: string, category: string, description: string, value: string, currencyCode: string, currentValueInPLN: string) {
        this.id = id;
        this.username = username;
        this.date = new Date(date);        
        this.category = category;
        this.description = description;
        this.value = parseFloat(value);
        this.currencyCode = currencyCode;
        this.currentValueInPLN = parseFloat(currentValueInPLN);
    }
}
