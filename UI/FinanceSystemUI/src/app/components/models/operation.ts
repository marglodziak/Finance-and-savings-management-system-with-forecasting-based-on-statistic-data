export class Operation {
    id: number;
    username: string;
    date: string;
    category: string;
    description: string;
    value: any;
    currencyCode: string;
    currentValueInPLN: any;

    constructor(id: number, username: string, date: string, category: string, description: string, value: string, currencyCode: string, currentValueInPLN: string) {
        this.id = id;
        this.username = username;
        this.date = date;   
        this.category = category;
        this.description = description;
        this.value = parseFloat(value);
        this.currencyCode = currencyCode;
        this.currentValueInPLN = parseFloat(currentValueInPLN);
    }
}
