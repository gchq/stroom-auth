
export interface StoreState {
    tokens: Token[];
    showSearchLoader: boolean;
    selectedTokenRowId: String | undefined;
    results: Token[];
}

export interface Token {
    id: String;   
    enabled: any;


}