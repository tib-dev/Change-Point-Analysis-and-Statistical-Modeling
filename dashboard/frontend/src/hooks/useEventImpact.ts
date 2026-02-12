import { useEffect, useState } from "react";
import { getPrices } from "../features/prices/price.service";

const useEventImpact = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getPrices().then(setData);
  }, []);

  return data;
};

export default useEventImpact;
