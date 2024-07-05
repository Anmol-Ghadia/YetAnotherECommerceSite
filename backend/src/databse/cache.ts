import { log } from "../logger";

const cacheSize = parseInt(process.env.CACHE_SIZE as string);

// function that takes two inputs of same type and returns
//   true if they are equal
export type ComparatorFunction<T> = (first: T,seoncd: T) => boolean;

export default class Cache<T> {
    private list: T[];
    private comparator: ComparatorFunction<T>;

    constructor(comparator: ComparatorFunction<T>) {
        this.list = [];
        this.comparator = comparator;
        log(2,'CACHE','initialized Cache');
    }

    // Adds the item if not present
    push(item: T) {
        if (!this.has(item)) {
            if (this.list.length >= cacheSize) {
                log(2,'CACHE',`removed item from cache due to size == MaxCacheSize`);
                let count = 0;
                this.list = this.list.filter(()=>{
                    count++;
                    return (count!=1);
                })
            }
            this.list.push(item);
            log(2,'CACHE','Pushed to cache');
        }
    }

    // pushes all items that are not already present
    pushAll(items: T[]) {
        items.forEach((ele)=>{
            this.push(ele);
        })
    }

    // removes an item if present
    pop(item: T) {
        if (this.has(item)) {
            log(2,'CACHE',`removed item (pop)`);
            this.list = this.list.filter((element)=>{
                return (!this.isEqual(element,item));
            })
        }
    }

    // Returns the matching item
    get(item: T): T {
        this.list.forEach((ele)=>{
            if (this.isEqual(item,ele)) return ele;
        })
        return item;
    }

    // returns true if the cache has the item
    has(item:T):boolean {
        for (let index = 0; index < this.list.length; index++) {
            if (this.isEqual(this.list[index],item)) return true;
        }
        return false;
    }

    // Resets the entire cache by dropping all entries
    drop() {
        this.list = [];
    }

    // Returns true if equal
    private isEqual(firstItem: T, secondItem: T):boolean {
        return this.comparator(firstItem,secondItem);
    }
}
