export class ExerciseType {
    id: number;
    description: string;
    measure: string;
    caloriesBurned: number;
    deleted: boolean;

    constructor(id: number, description: string, measure: string, caloriesBurned: number, deleted: boolean) { 
        this.id = id;
        this.description = description;
        this.measure = measure;
        this.caloriesBurned = caloriesBurned;
        this.deleted = deleted;
    }
}