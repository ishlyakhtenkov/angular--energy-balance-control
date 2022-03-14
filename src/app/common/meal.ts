export class Meal {
    id: number;
    dateTime: Date;
    description: string;
    calories: number;

    constructor(id: number, dateTime: Date, description: string, calories: number) { 
        this.id = id;
        this.dateTime = dateTime;
        this.description = description;
        this.calories = calories;
    }
}