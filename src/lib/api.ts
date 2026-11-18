const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

let cachedToken: string | null = null;

export const clearToken = (): void => {
  cachedToken = null;
};

export const getToken = async (
  forceRefresh: boolean = false,
): Promise<string | null> => {
  if (cachedToken && !forceRefresh) {
    return cachedToken;
  }

  const res: Response = await fetch(`${API_URL}/api/jwt`, {
    credentials: "include",
  });

  if (!res.ok) {
    cachedToken = null;
    return null;
  }

  const data: { token: string } = await res.json();
  cachedToken = data.token;
  return cachedToken;
};

const sendRequest = async (
  path: string,
  options: RequestInit,
  token: string | null,
): Promise<Response> => {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_URL}${path}`, { ...options, headers });
};

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  let res: Response = await sendRequest(path, options, await getToken());

  // Token may have expired: get a fresh one and retry once
  if (res.status === 401) {
    res = await sendRequest(path, options, await getToken(true));
  }

  if (!res.ok) {
    const errorBody: { message?: string } = await res.json().catch(() => ({}));
    throw new Error(errorBody.message ?? `Request failed (${res.status})`);
  }

  return res.json();
};
