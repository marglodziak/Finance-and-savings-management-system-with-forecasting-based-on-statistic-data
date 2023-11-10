import { EarningsHistory } from "../models/earningsHistory";

export class AddEarning {
    userId: number;
    earnings: EarningsHistory[];

    constructor(userId: number)
    {
        this.userId = userId;
        this.earnings = [];
    }
}