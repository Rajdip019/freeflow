const Free = {
  members: 5,
  storage: 2097152, // 2GB in KB
  fileLimit: 51200, // 50 MB in KB
};

const Basic = {
  members: 10,
  storage: 104857600, // 100GB in KB
  fileLimit: 25600, // 250 MB in KB
};

const Pro = {
  members: 16,
  storage: 524288000, // 500GB in KB
  fileLimit: Infinity,
};

export function getPlan(type: string): {
  members: number;
  storage: number;
  fileLimit: number;
} {
  switch (type) {
    case "free":
      return Free;
    case "basic":
      return Basic;
    case "pro":
      return Pro;
    default:
      return Free;
  }
}
