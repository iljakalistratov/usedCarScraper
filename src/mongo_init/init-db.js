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
  db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["chatId", "timePeriod", "cars"],
        properties: {
          chatId: {
            bsonType: "int",
            description: "Chat ID (Pflichtfeld, Typ: Integer)"
          },
          timePeriod: {
            bsonType: "int",
            description: "Zeitraum (Pflichtfeld, Typ: Integer)"
          },
          cars: {
            bsonType: "array",
            description: "Liste der Fahrzeuge (Pflichtfeld, Typ: Array)",
            items: {
              bsonType: "object",
              required: ["make", "model"],
              properties: {
                make: {
                  bsonType: "string",
                  description: "Marke des Fahrzeugs (Pflichtfeld, Typ: String)"
                },
                model: {
                  bsonType: "string",
                  description: "Modell des Fahrzeugs (Pflichtfeld, Typ: String)"
                }
              }
            }
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  });
}