const typeReg: Map<string, any> = new Map();

export function Type(typeName: string) {
    return (ctor: Function) => {
        ctor.prototype.NAME = typeName;
        if (typeReg.get(typeName)) {
            throw new Error(`Type "${typeName}" is alredy registered. A type can only be registered once`)
        }
        typeReg.set(typeName, ctor);
    }
}

export function createInstenceFromType(typeName: string) {
    const ctor = typeReg[typeName];
    if (ctor) {
        return new ctor();
    }
}