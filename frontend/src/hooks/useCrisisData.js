import {
  useState,
  useEffect,
} from "react";

import API from "../services/api";

export default function useCrisisData() {

  const [data, setData] =
    useState([]);

  const fetchData = async () => {

    try {

      const res =
        await API.get("/crisis");

      const sorted =
        res.data.sort(
          (a, b) =>
            (b.threatScore || 0) -
            (a.threatScore || 0)
        );

      setData(sorted);

    } catch (err) {

      console.log(
        "FETCH ERROR:",
        err
      );

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  return {

    data,

    setData,

    fetchData,

  };

}