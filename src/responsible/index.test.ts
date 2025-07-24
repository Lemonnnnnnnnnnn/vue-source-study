import * as module from ".";
import { expect, jest, test } from "bun:test"

test('should trigger effect when data is changed', () => {
    // 使用 jest.spyOn 直接监控 INTERNAL_effect 函数
    const spy = jest.spyOn(module, 'effect');
    
    // 先访问属性以触发依赖收集（get trap）
    module.responsibleData.text;
    
    // 然后修改属性值，这会触发 effect
    module.responsibleData.text = 'hello vue3'
    // when responsiableData.text is changed, INTERNAL_effect should be called
    expect(spy).toHaveBeenCalledTimes(1)
    
    // 清理
    spy.mockRestore();
})