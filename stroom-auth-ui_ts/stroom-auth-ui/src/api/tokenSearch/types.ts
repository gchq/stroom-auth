
export interface StoreState {
    tokens: Token[];
    showSearchLoader: boolean;
    selectedTokenRowId: String | undefined;
    results: Token[];
    totalPages: Number;
    errorStatus: String;
    errorText: String,
    lastUsedPageSize: Number;
}

export interface Token {
    id: String;   
    enabled: any;


}