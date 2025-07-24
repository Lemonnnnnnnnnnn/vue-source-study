import { describe, it, expect, beforeEach } from "bun:test"
import { effect, responsibleData } from "./index"

describe("响应式对象测试", () => {
    beforeEach(() => {
        // 简单的重置方式，避免触发复杂的响应式逻辑
        responsibleData.text = "hello world"
        // 清理其他可能存在的属性
        if ('count' in responsibleData) responsibleData.count = undefined
        if ('user' in responsibleData) responsibleData.user = undefined
        if ('firstName' in responsibleData) responsibleData.firstName = undefined
        if ('lastName' in responsibleData) responsibleData.lastName = undefined
        if ('items' in responsibleData) responsibleData.items = undefined
        if ('someProperty' in responsibleData) responsibleData.someProperty = undefined
    })

    it("应该能够执行基本的 effect 函数", () => {
        let dummy: any
        effect(() => {
            dummy = responsibleData.text
        })
        expect(dummy).toBe("hello world")
    })

    it("应该在数据变化时触发 effect 重新执行", () => {
        let dummy: any
        effect(() => {
            dummy = responsibleData.text
        })
        expect(dummy).toBe("hello world")
        
        // 修改数据应该触发 effect 重新执行
        responsibleData.text = "new value"
        expect(dummy).toBe("new value")
    })

    it("应该支持多个属性的响应式变化", () => {
        let result: string = ""
        effect(() => {
            result = `${responsibleData.text} - ${responsibleData.count || 0}`
        })
        expect(result).toBe("hello world - 0")

        responsibleData.count = 42
        expect(result).toBe("hello world - 42")

        responsibleData.text = "updated"
        expect(result).toBe("updated - 42")
    })

    it("应该支持多个 effect 监听同一个属性", () => {
        let dummy1: any
        let dummy2: any
        
        effect(() => {
            dummy1 = responsibleData.text + " (1)"
        })
        
        effect(() => {
            dummy2 = responsibleData.text + " (2)"
        })

        expect(dummy1).toBe("hello world (1)")
        expect(dummy2).toBe("hello world (2)")

        responsibleData.text = "changed"
        expect(dummy1).toBe("changed (1)")
        expect(dummy2).toBe("changed (2)")
    })

    it("应该支持不同属性的独立响应", () => {
        let textValue: any
        let countValue: any
        
        // 设置初始的 count 值
        responsibleData.count = 10
        
        effect(() => {
            textValue = responsibleData.text
        })
        
        effect(() => {
            countValue = responsibleData.count
        })

        expect(textValue).toBe("hello world")
        expect(countValue).toBe(10)

        // 只修改 text，count 相关的变量不应该改变
        responsibleData.text = "new text"
        expect(textValue).toBe("new text")
        expect(countValue).toBe(10) // 应该保持不变

        // 只修改 count，text 相关的变量不应该改变  
        responsibleData.count = 100
        expect(textValue).toBe("new text") // 应该保持不变
        expect(countValue).toBe(100)
    })

    it("应该支持简单对象属性的响应式", () => {
        let dummy: any
        
        // 先设置对象
        responsibleData.user = { name: "John" }
        
        effect(() => {
            dummy = responsibleData.user
        })
        expect(dummy).toEqual({ name: "John" })

        // 替换整个对象
        responsibleData.user = { name: "Jane" }
        expect(dummy).toEqual({ name: "Jane" })
    })

    it("应该支持计算属性式的 effect", () => {
        let computed: string = ""
        responsibleData.firstName = "John"
        responsibleData.lastName = "Doe"
        
        effect(() => {
            computed = `${responsibleData.firstName} ${responsibleData.lastName}`
        })
        expect(computed).toBe("John Doe")

        responsibleData.firstName = "Jane"
        expect(computed).toBe("Jane Doe")

        responsibleData.lastName = "Smith"
        expect(computed).toBe("Jane Smith")
    })

    it("应该正确处理数组数据", () => {
        let result: any
        // 先在 effect 外设置数组
        responsibleData.items = [1, 2, 3]
        
        effect(() => {
            result = responsibleData.items ? responsibleData.items.length : 0
        })
        expect(result).toBe(3)

        responsibleData.items = [1, 2, 3, 4, 5]
        expect(result).toBe(5)
    })
})
