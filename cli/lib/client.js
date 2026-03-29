import axios from "axios";

export async function apiCall(config, method, urlPath, params) {
  const url = `${config.apiBase}${urlPath}`;
  const headers = {
    "Authorization": `Bearer ${config.token}`,
    "Content-Type": "application/json",
  };

  let queryString = "";
  let data = undefined;

  if (method === "GET" && params) {
    queryString = "?" + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])
    ).toString();
  } else if (params) {
    data = params;
  }

  const fullUrl = `${url}${queryString}`;
  const response = await axios({
    method,
    url: fullUrl,
    headers,
    data,
  });

  const result = response.data;
  if (result.code !== 0 && result.code !== 200) {
    throw new Error(`API Error: ${result.message}`);
  }
  return result.data;
}
