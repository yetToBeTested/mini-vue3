import { effect, track, trigger } from "./effect"


export function computed(fn:any){
    const effectFn = effect(fn,{
        lazy:true,
        scheduler(){
            dirty = true
            trigger(obj, 'value')
        }
    })
    let dirty = true
    let val:any 
    const obj = {
        get vlaue () {
            
            if (dirty) {
                dirty = false
                val = effectFn()
            }
            track(obj, 'value')
            return val
            
            
            
        }
    }
    return obj
}