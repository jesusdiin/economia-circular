import axios from "axios";
import "dotenv/config";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

export const CATEGORIES: Record<string, string[]> = {
  vidrio: ["vidrio", "reciclaje de vidrio"],
  madera: ["madera", "reciclaje de madera"],
  acero: ["acero", "reciclaje de acero", "chatarra"],
  electronicos: ["electrónicos", "e-waste", "residuos electrónicos"],
  lodos: ["lodos secos", "residuos industriales"],
  muebles: ["mobiliario retirado", "muebles"],
  plastico: ["plástico", "PET", "reciclaje de plástico"],
  papel: ["papel", "cartón", "reciclaje de papel"],
  organicos: ["residuos orgánicos", "compostaje"],
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.primaryType",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.websiteUri"
].join(",");


async function searchPlaces(textQuery: string) {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const body = {
    textQuery,
    pageSize: 50,
    regionCode: "MX",
    languageCode: "es",
  };

  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  return res.data.places || [];
}

export async function fetchAllRecicladoras() {
  const output: Record<string, any[]> = {};
  const seen = new Set<string>();

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    const query = `${keywords.join(" ")} centro reciclaje CDMX`;

    const places = await searchPlaces(query);

    const mapped = places.map((p: any) => ({
      place_id: p.id,
      name: p.displayName?.text,
      address: p.formattedAddress,
      location: p.location,
      type: p.primaryType,
      rating: p.rating,
      reviews: p.userRatingCount,
      maps_url: p.googleMapsUri,
      website: p.websiteUri,
      phone_local: p.nationalPhoneNumber,
      phone_intl: p.internationalPhoneNumber,
      hours: p.hours,
      categoria: category,
    }));

    const unique = mapped.filter((p) => {
      if (seen.has(p.place_id)) return false;
      seen.add(p.place_id);
      return true;
    });

    output[category] = unique;
  }

  return {
    total_categorias: Object.keys(CATEGORIES).length,
    total_lugares: [...seen].length,
    categorias: output,
  };
}


// 🔍 Buscar solo una categoría
export async function fetchByCategory(category: string) {
  if (!CATEGORIES[category]) {
    throw new Error(`La categoría "${category}" no existe`);
  }

  const query = `${CATEGORIES[category].join(" ")} centro reciclaje CDMX`;
  const places = await searchPlaces(query);

  return places.map((p: any) => ({
    place_id: p.id,
    name: p.displayName?.text,
    address: p.formattedAddress,
    location: p.location,
    type: p.primaryType,
    rating: p.rating,
    reviews: p.userRatingCount,
    maps_url: p.googleMapsUri,
    website: p.websiteUri,
    phone_local: p.nationalPhoneNumber,
    phone_intl: p.internationalPhoneNumber,
    hours: p.hours,
    categoria: category,
  }));
}

export async function fetchPlaceById(placeId: string) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;

  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  const p = res.data;

  return {
    place_id: p.id,
    name: p.displayName?.text,
    address: p.formattedAddress,
    location: p.location,
    type: p.primaryType,
    rating: p.rating,
    reviews: p.userRatingCount,
    maps_url: p.googleMapsUri,
    website: p.websiteUri,
    phone_local: p.nationalPhoneNumber,
    phone_intl: p.internationalPhoneNumber,
    hours: p.hours,
  };
}
