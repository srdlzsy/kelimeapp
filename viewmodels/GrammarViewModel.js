import { useState, useEffect, useCallback } from 'react';
import * as db from '../models/Grammar';

export const useGrammarViewModel = () => {
  const [tumUniteler, setTumUniteler] = useState([]);
  const [gramerUniteleri, setGramerUniteleri] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const verileriYukle = useCallback(async () => {
    setYukleniyor(true);
    let veri = await db.gramerVerileriniYukle();
    if (!veri) {
      await db.gramerVerileriniKaydet();
      veri = await db.gramerVerileriniYukle();
    }
    if (veri && veri.units) {
      setTumUniteler(veri.units);
      setGramerUniteleri(veri.units);
    }
    setYukleniyor(false);
  }, []);

  const uniteleriFiltrele = useCallback((konuAnahtarKelimesi = '', zorluk = '') => {
    const filtrelenmis = db.gramerVerileriniFiltrele({ units: tumUniteler }, konuAnahtarKelimesi, zorluk);
    setGramerUniteleri(filtrelenmis);
  }, [tumUniteler]);

  useEffect(() => {
    verileriYukle();
  }, [verileriYukle]);

  return { 
    gramerUniteleri, 
    yukleniyor, 
    verileriYukle, 
    uniteleriFiltrele 
  };
};