function loadGroup(path: string) {
  const files = import.meta.glob(path, { eager: true });
  return Object.values(files)
    .map((m: any) => m.default)
    .sort();
}

export const SEATTLE1_MEDIA = {
  threshold: loadGroup("../photos/trips/seattle1/threshold/*"),
  arrival: loadGroup("../photos/trips/seattle1/arrival/*"),
  explore: loadGroup("../photos/trips/seattle1/explore/*"),
  quiet: loadGroup("../photos/trips/seattle1/quiet/*"),
  reflect: loadGroup("../photos/trips/seattle1/reflect/*"),
};
