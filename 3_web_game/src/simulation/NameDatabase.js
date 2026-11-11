export const MALE_NAMES = [
  'Jafar', 'Jumbo', 'Juju', 'Ludo', 'Konan', 'Rumbo', 'Milo', 'Kipp',
  'Errrbo', 'Gumbo', 'Edwood', 'Arnni', 'Erk', 'Bookah', 'Ukkko', 'Ukmol',
  'Deano', 'Barney', 'Noggin', 'Chico', 'Tupik', 'Makka', 'Gizzz', 'Rilo'
];

export const FEMALE_NAMES = [
  'Tazza', 'Loula', 'Treena', 'Dorris', 'Ethel', 'Tessa', 'Nora', 'Flora',
  'Fauna', 'Mila', 'Daisi', 'Margo', 'Murli', 'Lavka', 'Manka', 'Bunki',
  'Arida', 'Mayka', 'Vanni', 'Buffi', 'Polka', 'Zorka', 'Bilma', 'Alika'
];

export function pickUniqueTribeName(gender, existingVillagers = []) {
  const used = new Set(existingVillagers.map((v) => v.name.toLowerCase()));
  const pool = gender === 'female' ? FEMALE_NAMES : MALE_NAMES;
  const available = pool.filter((n) => !used.has(n.toLowerCase()));
  const source = available.length > 0 ? available : pool;
  return source[Math.floor(Math.random() * source.length)];
}
