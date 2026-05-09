"use client";

import { useEffect } from "react";
import { setCredentials } from "./slices/authSlice";
import { useAppDispatch } from "./hooks";

/** Restore demo auth from localStorage after browser refresh. */
export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("shopbot_auth");
      if (!raw) return;
      dispatch(setCredentials(JSON.parse(raw)));
    } catch {
      localStorage.removeItem("shopbot_auth");
    }
  }, [dispatch]);

  return null;
}
