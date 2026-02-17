import { useState, useEffect } from 'react';

// Hook personnalisé pour les appels API
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook pour les données avec pagination
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = { ...params, ...newParams };
      const result = await apiFunction(queryParams);
      
      setData(result.data);
      setPagination(result.pagination || pagination);
      setParams(queryParams);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      fetchData({ page: pagination.page + 1 });
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      fetchData({ page: pagination.page - 1 });
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchData({ page });
    }
  };

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    refresh,
    setParams
  };
};
