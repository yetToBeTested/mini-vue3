import {jobQueue,flushJob,effect,track,trigger} from './effect'


const data:any = {bar:true, foo:1}

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


effect(()=>{
        console.log(obj.foo);
    },{
        scheduler(fn:any){
            // setTimeout(fn)
            // fn()
            jobQueue.add(fn)
            flushJob()
        }
    }
)

obj.foo++
obj.foo++


export {}