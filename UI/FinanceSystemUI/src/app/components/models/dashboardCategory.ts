export class DashboardCategory {
    name: string = "";
    isActive: boolean = false;
    sum: string = "";
    averageNumberOfOperations: string = "";
    minValue: string = "";
    averageValue: string = "";
    maxValue: string = "";

    constructor(name: string, isActive: boolean) {
        this.name = name;
        this.isActive = isActive;
    }
}