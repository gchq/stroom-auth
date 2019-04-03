import useToggleState from './useToggleState';
import { useTokenSearchState } from './useTokenSearchState';
import usePerformTokenSearch from './actions/usePerformTokenSearch';
import useDeleteToken from './actions/useDeleteToken';

const useTokenSearch = () => {

    const {
        selectedTokenRowId,
        setSelectedTokenRowId,
        results,
        setResults,
        totalPages,
        setTotalPages,
        setLastUsedSearchConfig,
        lastUsedSearchConfig,
        toggleEnabled
    } = useTokenSearchState();
    return {
        selectedTokenRowId,
        setSelectedTokenRowId,
        results,
        searchConfig: lastUsedSearchConfig,
        totalPages,
        toggleState: useToggleState(toggleEnabled),
        performTokenSearch: usePerformTokenSearch(setResults, setLastUsedSearchConfig, setTotalPages, lastUsedSearchConfig),
        deleteSelectedToken: useDeleteToken(lastUsedSearchConfig, setSelectedTokenRowId, selectedTokenRowId),
    }
};

export default useTokenSearch;
