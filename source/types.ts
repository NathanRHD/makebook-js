export type ValueOf<T> = T[keyof T];

export type OpaqueType<Type, OpaqueKey extends string> = Type & { __opaqueKey: OpaqueKey }

export type OpaqueString<OpaqueKey extends string> = OpaqueType<string, OpaqueKey>