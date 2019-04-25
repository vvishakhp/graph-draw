export default class ArrayList<T> {

    private data: Array<T>;

    constructor(a?: Array<T>) {
        if (Array.isArray(a)) {
            this.data = a
        }
        else {
            this.data = []
        }
    }

    clear(): ArrayList<T> {
        this.data = [];
        return this;
    }

    reverse(): ArrayList<T> {
        this.data.reverse();
        return this;
    }

    getSize(): number {
        return this.data.length;
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }

    last(): T {
        return this.data[this.data.length - 1]
    }


    asArray(): Array<T> {
        return this.data
    }


    first(): T | null {
        if (this.data.length > 0) {
            return this.data[0]
        }
        return null;
    }


    get(i: number): T {
        return this.data[i]
    }


    add(...objs: Array<any>): ArrayList<T> {
        this.data.push(...objs)

        return this
    }


    grep(func: (element: T) => boolean) {
        this.data = this.data.filter(func)
        return this
    }


    find(func: () => boolean) {
        let result = this.data.filter(func)
        if (result.length === 0) {
            return null
        }
        return result[0]
    }




    unique() {
        this.data = this.data.filter((value, index, self) => self.indexOf(value) === index)
        return this
    }



    addAll(list: ArrayList<T>, avoidDuplicates: boolean = false): ArrayList<T> {
        if (!(list instanceof ArrayList)) {
            throw "Unable to handle unknown object type in ArrayList.addAll"
        }

        this.data = this.data.concat(list.data)
        if (avoidDuplicates) {
            this.unique()
        }
        return this
    }


    pop() {
        return this.removeElementAt(this.data.length - 1)
    }


    push(value: any) {
        this.add(value)
    }


    remove(obj: any) {
        let index = this.indexOf(obj)
        if (index >= 0) {
            return this.removeElementAt(index)
        }

        return null
    }



    insertElementAt(obj: any, index: number) {
        this.data.splice(index, 0, obj);
        return this
    }

    removeElementAt(index: number) {
        let element = this.data[index]

        this.data.splice(index, 1)

        return element
    }

    removeAll(elements: any) {
        if (elements instanceof ArrayList) {
            elements = elements.data
        }

        if (Array.isArray(elements)) {
            elements.forEach((e) => {
                this.remove(e)
            })
        }

        return this
    }

    indexOf(obj: T): number {
        return this.data.indexOf(obj)
    }


    contains(obj: T): boolean {
        return this.indexOf(obj) !== -1
    }

    sort(f: (a, b) => number) {
        if (typeof f === "function") {
            this.data.sort(f)
        }
        else {
            this.data.sort((a, b) => {
                if (a[f] < b[f])
                    return -1
                if (a[f] > b[f])
                    return 1
                return 0
            })
        }
        return this
    }

    clone(deep?: boolean): ArrayList<T> {
        let newVector = new ArrayList<T>()


        if (deep) {
            for (let i = 0; i < this.data.length; i++) {
                newVector.data.push((this.data[i] as any).clone())
            }
        }
        else {
            newVector.data = this.data.slice(0)
        }

        return newVector
    }


    each(func: (index: number, element: T) => any, reverse?: boolean) {
        if (typeof reverse !== "undefined" && reverse === true) {
            for (let i = this.data.length - 1; i >= 0; i--) {
                if (func(i, this.data[i]) === false)
                    break
            }
        }
        else {
            for (let i = 0; i < this.data.length; i++) {
                if (func(i, this.data[i]) === false)
                    break
            }
        }

        return this
    }

    overwriteElementAt(obj: T, index: number) {
        this.data[index] = obj

        return this
    }

    getPersistentAttributes() {
        return { data: this.data }
    }


    setPersistentAttributes(memento: { data: Array<T> }) {
        this.data = memento.data
    }

    map(func: (val: T, index?: number, array?: T[]) => any) {
        this.data = this.data.map(func)
        return this
    }
}
