db = db.getSiblingDB('usedcarsdb');

if (!db.getCollectionNames().includes('carAdListings')) {
  db.createCollection('carAdListings');
}

if (!db.getCollectionNames().includes('users')) {
  db.createCollection('users');
}
