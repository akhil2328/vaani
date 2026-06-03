import { useEffect } from "react";
import socket from "../services/socket";

export default function useSocket(setData) {

  useEffect(() => {

    socket.on("new_crisis", (newData) => {

      setData((prev) => [
        newData,
        ...prev,
      ]);

    });

    return () => {
      socket.off("new_crisis");
    };

  }, [setData]);

}