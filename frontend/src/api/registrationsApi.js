const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5205";
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

function formatProblemDetails(payload, status) {
  if (!payload || typeof payload !== "object") {
    return `Request failed with status ${status}.`;
  }

  if (payload.errors && typeof payload.errors === "object") {
    const messages = Object.entries(payload.errors).flatMap(([field, errs]) =>
      Array.isArray(errs) ? errs.map((msg) => `${field}: ${msg}`) : []
    );
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return payload.detail || payload.title || `Request failed with status ${status}.`;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json") || contentType.includes("+json");
  const data = hasJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = formatProblemDetails(data, response.status);
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function getRegistrations({
  participantName = "",
  type = "",
  status = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams();

  if (participantName && participantName.trim()) {
    params.set("participantName", participantName.trim());
  }
  if (type && type !== "All") {
    params.set("type", type);
  }
  if (status && status !== "All") {
    params.set("status", status);
  }
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  let response;
  try {
    response = await fetch(
      `${API_BASE_URL}/api/registrations?${params.toString()}`
    );
  } catch {
    throw new Error("Cannot reach the API. Please check if the backend server is running.");
  }

  const data = await parseJsonResponse(response);
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    page: data?.page ?? Number(page) ?? 1,
    pageSize: data?.pageSize ?? Number(pageSize) ?? 10,
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
  };
}

export async function getSummary() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/registrations/summary`);
  } catch {
    throw new Error("Cannot reach the API. Please check if the backend server is running.");
  }

  const data = await parseJsonResponse(response);
  return {
    totalRegistrations: data?.totalRegistrations ?? 0,
    confirmed: data?.confirmed ?? 0,
    checkedIn: data?.checkedIn ?? 0,
    pending: data?.pending ?? 0,
    cancelled: data?.cancelled ?? 0,
    totalFees: data?.totalFees ?? 0,
    totalPayments: data?.totalPayments ?? 0,
    uncollectedPayments: data?.uncollectedPayments ?? 0,
  };
}