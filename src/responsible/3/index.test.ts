import { describe, it, expect, beforeEach } from "bun:test"
import { effect, responsibleData } from "."

describe("响应式对象嵌套 effect 测试", () => {
    beforeEach(() => {
        responsibleData.foo = true
        responsibleData.bar = true
    })

    it("effect 嵌套测试 outer", () => {
        let temp1: any;
        let temp2: any;
        let effectFn1Count = 0;
        let effectFn2Count = 0;

        function effectFn1() {
            effect(() => {
                effectFn1Count++
                // console.log("effectFn1 执行")

                effectFn2()
                temp1 = responsibleData.foo
            })
        }

        function effectFn2() {
            effect(() => {
                effectFn2Count++
                // console.log("effectFn2 执行")
                temp2 = responsibleData.bar
            })
        }

        effectFn1()

        expect(effectFn1Count).toBe(1)
        expect(effectFn2Count).toBe(1)
        expect(temp1).toBe(true)
        expect(temp2).toBe(true)

        responsibleData.foo = false
        expect(effectFn1Count).toBe(2)
        expect(effectFn2Count).toBe(2)
        expect(temp1).toBe(false)
        expect(temp2).toBe(true)
    })

    it("effect 嵌套测试 inner", () => {
        let temp1: any;
        let temp2: any;
        let effectFn1Count = 0;
        let effectFn2Count = 0;

        function effectFn1() {
            effect(() => {
                effectFn1Count++
                // console.log("effectFn1 执行")

                effectFn2()
                temp1 = responsibleData.foo
            })
        }

        function effectFn2() {
            effect(() => {
                effectFn2Count++
                // console.log("effectFn2 执行")
                temp2 = responsibleData.bar
            })
        }

        effectFn1()

        responsibleData.bar = false
        expect(effectFn1Count).toBe(1)
        expect(effectFn2Count).toBe(2)
        expect(temp1).toBe(true)
        expect(temp2).toBe(false)
    })

    
})