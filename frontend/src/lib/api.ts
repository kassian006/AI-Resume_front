import {
  LoginResponse,
  ResumeMatchResult,
  ResumeSessionDetail,
  ResumeSessionListItem,
  UploadQueuedResponse,
  User,
} from "./types";
import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {}
    throw new Error(detail);
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/auth/login/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    false
  );
}

export async function register(email: string, password: string) {
  return apiRequest<User>(
    "/auth/register/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    false
  );
}

export async function getMe() {
  return apiRequest<User>("/auth/me");
}

export async function getSessions() {
  return apiRequest<ResumeSessionListItem[]>("/resumes/sessions");
}

export async function getSessionDetail(sessionId: number) {
  return apiRequest<ResumeSessionDetail>(`/resumes/sessions/${sessionId}`);
}

export async function getSessionMatches(sessionId: number) {
  return apiRequest<ResumeMatchResult>(`/resumes/sessions/${sessionId}/matches`);
}

export async function uploadForAnalysis(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<UploadQueuedResponse>("/resumes/upload", {
    method: "POST",
    body: formData,
  });
}

export async function uploadForMatching(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<UploadQueuedResponse>("/resumes/match-upload", {
    method: "POST",
    body: formData,
  });
}