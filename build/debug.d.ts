/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/toGray
 * @param data `~lib/typedarray/Uint8ClampedArray`
 * @param width `i32`
 * @param height `i32`
 * @param gray `bool`
 * @returns `~lib/typedarray/Uint8ClampedArray`
 */
export declare function toGray(data: Uint8ClampedArray, width: number, height: number, gray: boolean): Uint8ClampedArray;
/**
 * assembly/index/toInverted
 * @param data `~lib/typedarray/Uint8ClampedArray`
 * @param width `i32`
 * @param height `i32`
 * @param inverted `bool`
 * @returns `~lib/typedarray/Uint8ClampedArray`
 */
export declare function toInverted(data: Uint8ClampedArray, width: number, height: number, inverted: boolean): Uint8ClampedArray;
