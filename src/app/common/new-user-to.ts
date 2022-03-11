export class NewUserTo {
    name: string;
    email: string;
    password: string;
    sex: string;
    weight: number;
    growth: number;
    age: number;

    constructor(name: string, email: string, password: string, sex: string, weight: number, growth: number, age:number) { 
        this.name = name;
        this.email = email;
        this.password = password;
        this.sex = sex;
        this.weight = weight;
        this.growth = growth;
        this.age = age;        
    }
}