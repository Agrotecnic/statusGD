import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const useAutoSave = (initialData, saveFunction, options = {}) => {
  const { delay = 1000 } = options;
  const [data, setData] = useState(initialData);
  const [saveStatus, setSaveStatus] = useState('idle');
  
  const debouncedSave = useCallback(
    debounce(async (dataToSave) => {
      try {
        setSaveStatus('saving');
        await saveFunction(dataToSave);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        console.error('AutoSave error:', error);
      }
    }, delay),
    [saveFunction, delay]
  );

  useEffect(() => {
    if (data !== initialData) {
      debouncedSave(data);
    }
    
    return () => {
      debouncedSave.cancel();
    };
  }, [data, initialData, debouncedSave]);

  const setDataAndSave = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    data,
    setData: setDataAndSave,
    saveStatus
  };
};