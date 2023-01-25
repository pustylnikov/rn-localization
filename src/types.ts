export type Args = {[key: string]: string | number | null | undefined};

export type TranslationKeys<T> = keyof T[keyof T];

export type TranslateArgs<T> = [TranslationKeys<T>, (Args | null)?, (keyof T)?];

export type LocaleListener<T extends Translations<T>> = (language: keyof T) => void;

export type Translations<T> = {
  [P in keyof T]: {
    [Q in keyof T[P]]: string;
  };
};
