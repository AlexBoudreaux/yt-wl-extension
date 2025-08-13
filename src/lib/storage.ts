import { useEffect, useState } from "react";
import { Theme, type User } from "~/types";
import { type WxtStorageItem, storage as browserStorage } from "#imports";

export const StorageKey = {
  THEME: "local:theme",
  USER: "local:user",
  SUPADATA_API_KEY: "local:supadata_api_key",
  WL_SEARCH_QUERY: "local:wl_search_query",
  WL_FILTER_DURATION: "local:wl_filter_duration",
  WL_FILTER_DATE: "local:wl_filter_date",
  WL_FILTER_CHANNEL: "local:wl_filter_channel",
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

const storage = {
  [StorageKey.THEME]: browserStorage.defineItem<Theme>(StorageKey.THEME, {
    fallback: Theme.SYSTEM,
  }),
  [StorageKey.USER]: browserStorage.defineItem<User | null>(StorageKey.USER, {
    fallback: null,
  }),
  [StorageKey.SUPADATA_API_KEY]: browserStorage.defineItem<string | null>(
    StorageKey.SUPADATA_API_KEY,
    {
      fallback: null,
    },
  ),
  [StorageKey.WL_SEARCH_QUERY]: browserStorage.defineItem<string>(
    StorageKey.WL_SEARCH_QUERY,
    {
      fallback: "",
    },
  ),
  [StorageKey.WL_FILTER_DURATION]: browserStorage.defineItem<string | null>(
    StorageKey.WL_FILTER_DURATION,
    { fallback: null },
  ),
  [StorageKey.WL_FILTER_DATE]: browserStorage.defineItem<string | null>(
    StorageKey.WL_FILTER_DATE,
    { fallback: null },
  ),
  [StorageKey.WL_FILTER_CHANNEL]: browserStorage.defineItem<string | null>(
    StorageKey.WL_FILTER_CHANNEL,
    { fallback: null },
  ),
} as const;

type Value<T extends StorageKey> = (typeof storage)[T] extends WxtStorageItem<
  infer V,
  infer _
>
  ? V
  : never;

export const getStorage = <K extends StorageKey>(key: K) => {
  return storage[key];
};

export const useStorage = <K extends StorageKey>(key: K) => {
  const item = storage[key] as WxtStorageItem<
    Value<K>,
    Record<string, unknown>
  >;
  const [value, setValue] = useState<Value<K> | null>(null);

  useEffect(() => {
    const unwatch = item.watch((value) => {
      setValue(value);
    });

    return () => {
      unwatch();
    };
  }, [item]);

  useEffect(() => {
    (async () => {
      const value = await item.getValue();
      setValue(value);
    })();
  }, [item.getValue]);

  const remove = () => {
    void item.removeValue();
  };

  const set = (value: Value<K>) => {
    void item.setValue(value);
  };

  return { data: value ?? item.fallback, remove, set };
};
