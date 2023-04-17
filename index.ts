import { computed } from './computed'
import {jobQueue,flushJob,effect,track,trigger} from './effect'


const data:any = {bar:2, foo:1}

const obj = new Proxy(data,{
    get(target, key) {
        track(target,key)
        return target[key]
    },
    set(target,key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})


// const effectFn = effect(
//         // console.log(obj.foo);
//     () => obj.bar + obj.foo
//     ,{
//         // scheduler(fn:any){
//         //     // setTimeout(fn)
//         //     // fn()
//         //     jobQueue.add(fn)
//         //     flushJob()
//         // }
//         lazy:true
//     }
// )

// const val = effectFn()
// console.log(val);


const val2 = computed(() => obj.bar + obj.foo)
// console.log(val2.vlaue);
// console.log(val2.vlaue);
// console.log(val2.vlaue);
// obj.bar ++
// console.log(val2.vlaue);

// effect(()=>{
//     obj.bar ++
//     console.log(val2.vlaue);
    
// })

export {}