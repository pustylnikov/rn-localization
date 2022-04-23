export type AnyObjectKey = string | number | symbol;

export type AnyObject<T> = {[k: AnyObjectKey]: T};

export type TranslateArgs = {[key: string]: string | number | null | undefined};

export type ListenerType<T extends AnyLocalizationType> = (language: keyof T) => void;

export type AnyLocalizationType = {[k: AnyObjectKey]: AnyObject<string>};

export type LocalizationType<T extends AnyLocalizationType> = {
  [I in keyof T]: {
    [J in keyof T[I]]: string;
  };
};
