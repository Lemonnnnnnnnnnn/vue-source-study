const data: Record<keyof any, any> = { text: "hello world" }

const bucket = new WeakMap<object, Map<string | symbol, Set<Function>>>()
let activeEffect: Function | null = null

export function effect(fn: Function) {
    activeEffect = fn
    fn()
}

const responsibleData = new Proxy(data, {
    get(target, key) {
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

        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        const depsMap = bucket.get(target)
        if (!depsMap) return true
        const effects = depsMap.get(key)
        effects && effects.forEach(fn => fn())
        return true
    }
})

export { responsibleData }