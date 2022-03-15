export class ExerciseTo {
    id: number;
    dateTime: Date;
    amount: number;
    exerciseTypeId: number;

    constructor(id: number, dateTime: Date, amount: number, exerciseTypeId: number) { 
        this.id = id;
        this.dateTime = dateTime;
        this.amount = amount;
        this.exerciseTypeId = exerciseTypeId;
    }
}