"use client";

import { useEffect } from "react";
import { useMeQuery } from "./api/authApi";
import { setCredentials, setUser } from "./slices/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

/** Restore auth from localStorage after browser refresh. */
export function AuthHydrator() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { data: refreshedUser } = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("shopbot_auth");
      if (!raw) return;
      const auth = JSON.parse(raw);
      if (typeof auth?.token === "string" && auth.token.startsWith("demo-token")) {
        localStorage.removeItem("shopbot_auth");
        return;
      }
      dispatch(setCredentials(auth));
    } catch {
      localStorage.removeItem("shopbot_auth");
    }
  }, [dispatch]);

  useEffect(() => {
    if (refreshedUser) dispatch(setUser(refreshedUser));
  }, [dispatch, refreshedUser]);

  return null;
}
