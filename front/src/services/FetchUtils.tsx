import { getSha } from "../components/BannerContent";

const HEADERS_POST = {
    "accept": "application/json",
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

export const makeBody = (json: Object) => ({
    method: "POST",
    headers: HEADERS_POST,
    body: JSON.stringify({ sha: getSha(), ...json }),
});