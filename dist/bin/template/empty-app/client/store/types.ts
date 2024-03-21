/**
 * This type is intended for the async operation of a "flow". A flow can have
 * several yield statements, but are NOT for the intention of returning values
 * to the caller, but rather for the intent of performing a mobx action that has
 * asynchronous properties.
 */
export type FlowType = Generator<unknown, unknown, unknown> | undefined;

/**
 * Return type for a flow method used
 */
export type FlowGenerator<TReturn = void> = Generator<
  Promise<void>,
  TReturn,
  void
>;

/**
 * An aid to use in conjunctin with yield statements to API calls to help TS and
 * mobx flow patterns meld with each other.
 */
export function flowApi<TArgs extends unknown[], TReturn = void>(
  fn: (...args: TArgs) => Promise<TReturn> | TReturn
): (...args: TArgs) => FlowGenerator<TReturn> {
  return function* flowGeneratorFunction(
    ...args: TArgs
  ): FlowGenerator<TReturn> {
    let value: TReturn = void 0 as TReturn;

    yield Promise.resolve(fn(...args)).then((result) => {
      value = result;
    });

    return value;
  };
}

/**
 * This is similar to flowApi except this is for when a flow statement needs to
 * call another flow statement and get the fully established result from the
 * chain. This should help TS resolve to the correct result type after it has
 * all completed.
 */
export function flowAll<TArgs extends unknown[], TReturn = void>(
  fn: (...args: TArgs) => FlowGenerator<TReturn>
): (...args: TArgs) => FlowGenerator<TReturn> {
  return function* flowGeneratorFunction(
    ...args: TArgs
  ): FlowGenerator<TReturn> {
    let value: TReturn = void 0 as TReturn;

    value = yield* fn(...args);

    return value;
  };
}
