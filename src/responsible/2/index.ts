const data: Record<keyof any, any> = { text: "hello world" }

const bucket = new WeakMap<object, Map<string | symbol, Set<Function>>>()
let activeEffect: Function | null = null

export function effect(fn: Function) {
    activeEffect = fn
    fn()
}

export function track(target: object, key: string | symbol) {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

export function trigger(target: object, key: string | symbol) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}

const responsibleData = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})

export { responsibleData }