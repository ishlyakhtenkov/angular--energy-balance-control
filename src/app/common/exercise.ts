import { ExerciseType } from "./exercise-type";

export class Exercise {
    id: number;
    dateTime: Date;
    amount: number;
    exerciseType: ExerciseType;
}