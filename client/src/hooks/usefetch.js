import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getApiData = async () => {
      setIsLoading(true);
      setData(null);
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setData(data);
        } else {
          setError(true);
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    getApiData();
  }, [url]);
  return { data, isLoading, error };
};

export default useFetch;
