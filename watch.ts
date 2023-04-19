import { effect } from "./effect";

function traverse(value:any, seen = new Set()){
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    seen.add(value)
    for (const k in value) {
        traverse(value[k],seen)
    }
    return value
}

export function watch(source:any,cb:any){
    let getter:any
    if (typeof source == 'function'){
        getter=source
    }else{
        getter = ()=>traverse(source)
    }
    let oldValue:any,newValue:any
    const effectFn = effect(
        ()=>{ 
            return getter()
        },
        {
            lazy:true,
            scheduler() {
                newValue = effectFn()
                cb(newValue,oldValue)
                oldValue = newValue
            }
        }
    )
    oldValue = effectFn()
}