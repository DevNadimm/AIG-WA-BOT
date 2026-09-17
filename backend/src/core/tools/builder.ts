export function renderTemplate(template: string, context: any): string {
  if (!template || typeof template !== "string") return template;
  
  const ALLOWED_NAMESPACES = ["customer", "conversation", "workflow", "variables", "args", "user_message"];
  
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const keys = path.split(".");
    if (!ALLOWED_NAMESPACES.includes(keys[0])) {
      return ""; // Deny access to anything outside allowed namespaces (e.g. process, env, secrets)
    }

    let value = context;
    for (const key of keys) {
      if (value === null || value === undefined) break;
      value = value[key];
    }
    return value !== undefined && value !== null ? String(value) : "";
  });
}

export function buildRequestBody(bodyMapping: any, context: any): any {
  if (bodyMapping === null || bodyMapping === undefined) return undefined;
  if (typeof bodyMapping === "string") {
    return renderTemplate(bodyMapping, context);
  }
  if (Array.isArray(bodyMapping)) {
    return bodyMapping.map(item => buildRequestBody(item, context));
  }
  if (typeof bodyMapping === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(bodyMapping)) {
      result[key] = buildRequestBody(value, context);
    }
    return result;
  }
  return bodyMapping;
}

export function buildRequestHeaders(headersConfig: Record<string, string>, context: any, authType?: string, authCredentials?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  
  if (headersConfig) {
    for (const [key, value] of Object.entries(headersConfig)) {
      headers[key] = renderTemplate(value, context);
    }
  }

  if (authType === "Bearer" && authCredentials) {
    headers["Authorization"] = `Bearer ${authCredentials}`;
  } else if (authType === "API Key" && authCredentials) {
    // Assuming API Key is passed in x-api-key if not explicitly mapped
    if (!headers["x-api-key"] && !headers["X-Api-Key"] && !headers["Authorization"]) {
       headers["x-api-key"] = authCredentials;
    }
  } else if (authType === "Basic" && authCredentials) {
    headers["Authorization"] = `Basic ${authCredentials}`;
  }

  return headers;
}

export function buildUrl(baseUrl: string, queryParams: Record<string, string>, context: any): string {
  let url = renderTemplate(baseUrl, context);
  if (queryParams && Object.keys(queryParams).length > 0) {
    const parsedUrl = new URL(url);
    for (const [key, value] of Object.entries(queryParams)) {
      parsedUrl.searchParams.append(key, renderTemplate(value, context));
    }
    url = parsedUrl.toString();
  }
  return url;
}
