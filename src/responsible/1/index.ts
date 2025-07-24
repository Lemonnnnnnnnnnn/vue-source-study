const data: Record<keyof any, any> = { text: "hello world" }

const bucket = new Set<Function>()

export function effect() {
    console.log('effect run')
}

const responsibleData = new Proxy(data, {
    get(target, key) {
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        bucket.forEach(fn => fn())
        return true
    }
})

export { responsibleData }