import { useState, useEffect } from 'react';
import { gramerVerileriniYukle } from '../models/storage';

export const useTopicDetailViewModel = (id) => {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopic = async () => {
        console.log('Loading topic with id:', id);
      setLoading(true);
      const veri = await gramerVerileriniYukle();
      const found = veri?.find(u => u.id === id);
      setTopic(found || null);
      setLoading(false);
    };
    loadTopic();
  }, [id]);

  return { topic, loading };
};
