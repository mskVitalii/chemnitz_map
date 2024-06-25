export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Radius of the Earth in kilometers
  const R = 6371.0;

  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Differences in coordinates
  const dlat = lat2Rad - lat1Rad;
  const dlon = lon2Rad - lon1Rad;

  // Haversine formula
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance;
}