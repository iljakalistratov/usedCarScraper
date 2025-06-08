db = db.getSiblingDB('usedcarsdb');

if (!db.getCollectionNames().includes('carAdListings')) {
  db.createCollection('carAdListings', {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "link"],
        properties: {
          title: {
            bsonType: "string",
            description: "Titel des Fahrzeugs (Pflichtfeld, Typ: String)"
          },
          price: {
            bsonType: ["string", "null"],
            description: "Preis (Optional, Typ: String)"
          },
          km: {
            bsonType: ["string", "null"],
            description: "Kilometerstand (Optional, Typ: String)"
          },
          year: {
            bsonType: ["string", "null"],
            description: "Baujahr (Optional, Typ: String)"
          },
          link: {
            bsonType: "string",
            description: "URL zum Inserat (Pflichtfeld, Typ: String)"
          },
          imgSrc: {
            bsonType: ["string", "null"],
            description: "Bild-URL (Optional, Typ: String)"
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  });
}

if (!db.getCollectionNames().includes('users')) {
  db.createCollection('users')
}