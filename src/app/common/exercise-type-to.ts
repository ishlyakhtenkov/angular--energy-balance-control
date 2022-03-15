export class ExerciseTypeTo {
    id: number;
    description: string;
    measure: string;
    caloriesBurned: number;

    constructor(id: number, description: string, measure: string, caloriesBurned: number) { 
        this.id = id;
        this.description = description;
        this.measure = measure;
        this.caloriesBurned = caloriesBurned;
    }
}