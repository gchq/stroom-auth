import { useCallback } from 'react';
import useApi from 'src/api/tokens/useApi';
import { SearchConfig } from 'src/api/tokens/types';

const usePerformTokenSearch = (
  setResults: Function,
  setLastUsedSearchConfig: Function,
  setTotalPages: Function,
  lastUsedSearchConfig: SearchConfig,
) => {
  const { performTokenSearch } = useApi();
  return useCallback((searchConfig: SearchConfig) => {

    searchConfig.pageSize = getRowsPerPage();
    lastUsedSearchConfig.pageSize = searchConfig.pageSize;

    if (searchConfig.page === undefined) {
      searchConfig.page = lastUsedSearchConfig.page;
    } else {
      lastUsedSearchConfig.page = searchConfig.page;
    }

    if (searchConfig.sorting === undefined) {
      searchConfig.sorting = lastUsedSearchConfig.sorting;
    } else {
      lastUsedSearchConfig.sorting = searchConfig.sorting;
    }

    if (searchConfig.filters === undefined) {
      searchConfig.filters = lastUsedSearchConfig.filters;
    } else {
      lastUsedSearchConfig.filters = searchConfig.filters;
    }
    setLastUsedSearchConfig(lastUsedSearchConfig);

    performTokenSearch(searchConfig)
      .then(data => {
        // showSearchLoader(false);
        setResults(data.tokens);
        setTotalPages(data.totalPages);
      })
  },
    [performTokenSearch, setResults]
  );
}

export const getRowsPerPage = () => {
  const viewport = document.getElementById("User-content");
  let rowsInViewport = 20;
  if (viewport) {
    const viewportHeight = viewport.offsetHeight;
    const rowsHeight = viewportHeight - 60;
    rowsInViewport = Math.floor(rowsHeight / 26);
  }
  return rowsInViewport;
};

export default usePerformTokenSearch;