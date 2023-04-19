let activEffect:any = null
const effectStack = <any>[]
const buck = new WeakMap()

function effect(fn:any, options:any={}) {
    const effectFn:any = () => {
        cleanup(effectFn)
        activEffect = effectFn
        effectStack.push(effectFn)
        // console.log('effct执行啦');
        
        const res = fn()     
        effectStack.pop()
        activEffect = effectStack[effectStack.length - 1]
        return res
    }
    //options挂载effectFn
    effectFn.options = options
    effectFn.deps = []
    if (!options.lazy) {
        effectFn()
    }
    
    return effectFn
}

function cleanup(effectFn:any) {
    for (let i = 0; i < effectFn.deps.length; i++){
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

const jobQueue:any = new Set()
const p = Promise.resolve()
let isFulshing = false

function flushJob() {
    if (isFulshing) return

    isFulshing = true

    p.then(()=>{
        jobQueue.forEach((job:any)=>job())
    }).finally(()=>{
        isFulshing = false
    })
}

function track(target:any, key:any) {
    if (!activEffect) return
    let depsMap = buck.get(target)
    if (!depsMap) {
        buck.set(target, depsMap = new Map())
    }

    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, deps = new Set())
    }
    deps.add(activEffect)
    activEffect.deps.push(deps)
}

function trigger(target:any, key:any){
    const depsMap = buck.get(target)
    if (!depsMap) return
    const effects:any = depsMap.get(key)

    const effectsToRun:any = new Set()
    effects.forEach((effect:any)=>{
        if (effect != activEffect){
            // console.log('effct');
            
            effectsToRun.add(effect)
        }
    })
    effectsToRun && effectsToRun.forEach((effectFn:any)=>{
        if (effectFn.options.scheduler){
            effectFn.options.scheduler(effectFn)
        }else{
            effectFn()
        }
    })
    // effects && effects.forEach(fn=>fn())
}

export {jobQueue,flushJob,effect,track,trigger}