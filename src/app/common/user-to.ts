export class UserTo {
    id: number;
    name: string;
    sex: string;
    weight: number;
    growth: number;
    age: number;

    constructor(id: number, name: string, sex: string, weight: number, growth: number, age:number) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.weight = weight;
        this.growth = growth;
        this.age = age;        
    }
}