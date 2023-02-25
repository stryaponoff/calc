export class AbsurdError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_: never) {
    super('Unreachable statement')
  }
}
