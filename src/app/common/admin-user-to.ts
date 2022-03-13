export class AdminUserTo {
    id: number;
    name: string;
    email: string;
    sex: string;
    weight: number;
    growth: number;
    age: number;
    roles: string[];

    constructor(id: number, name: string, email: string, sex: string, weight: number, growth: number, age: number, roles: string[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.sex = sex;
        this.weight = weight;
        this.growth = growth;
        this.age = age;
        this.roles = roles;       
    }
}