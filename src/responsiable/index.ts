const data: Record<keyof any, any> = { text: "hello world" }

const bucket = new Set<Function>()

export function INTERNAL_effect() {
    console.log('effect run')
}

const responsiableData = new Proxy(data, {
    get(target, key) {
        bucket.add(INTERNAL_effect)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        bucket.forEach(fn => fn())
        return true
    }
})

export { responsiableData }