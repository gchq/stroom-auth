export interface StateById<TStatePerId> {
  [s: string]: TStatePerId;
}

export interface ActionId {
  id: string;
}
