const typeReg: { [key: string]: any } = {};

export function Type(typeName: string) {
    return (ctor: Function) => {
        ctor.prototype.NAME = typeName;
        typeReg[typeName] = ctor;
    }
}

export function createInstenceFromType(typeName: string) {
    const ctor = typeReg[typeName];
    if (ctor) {
        return new ctor();
    }
}