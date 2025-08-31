import { useState, useEffect } from 'react';
import { gramerVerileriniYukle, gramerVerileriniKaydet,gramerVerileriniTemizle } from '../models/storage';

export const useTopicListViewModel = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadTopics = async () => {
     await gramerVerileriniTemizle(); // Temizle
      setLoading(true);
      let veri = await gramerVerileriniYukle();

      if (!veri || veri.length === 0) {
        await gramerVerileriniKaydet(); // İlk yükleme
        veri = await gramerVerileriniYukle();
      }

      setTopics(veri || []); // units yok, direkt veri array
      setLoading(false);
    };

    loadTopics();
  }, []);

  // Arama ve filtreleme
  const filteredTopics = topics.filter(item =>
    item.topic.toLowerCase().includes(search.toLowerCase())
  );

  return {
    topics: filteredTopics,
    loading,
    search,
    setSearch
  };
};
