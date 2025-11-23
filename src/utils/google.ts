import axios from "axios";
import "dotenv/config";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

export async function fetchRecicladoras() {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const body = {
    textQuery: "centro de reciclaje en Ciudad de México",
    pageSize: 100,
    regionCode: "MX",
    languageCode: "es",
  };

  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType",
    },
  });

  console.log(res.data);

  const results = res.data.places?.map((p: any) => ({
    place_id: p.id,
    name: p.displayName?.text,
    address: p.formattedAddress,
    location: p.location,
    types: p.primaryType,
  })) ?? [];

  return {
    total: results.length,
    results,
  };
}
