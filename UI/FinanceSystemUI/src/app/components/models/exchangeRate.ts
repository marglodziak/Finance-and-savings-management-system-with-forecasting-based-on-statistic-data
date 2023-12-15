export class ExchangeRate {
    currencyCode: string;
    currencyName: string;
    currentExchangeRate: number;

    constructor(currencyCode: string, currencyName: string, currentExchangeRate: number) {
        this.currencyCode = currencyCode;
        this.currencyName = currencyName;
        this.currentExchangeRate = currentExchangeRate;
    }
}