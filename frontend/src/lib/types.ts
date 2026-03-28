
export type SessionStatus = "queued" | "processing" | "completed" | "failed" | "stopped";
export type SessionType = "improve" | "match";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}


export interface ResumeSessionListItem {
  session_id: number;
  resume_file_id: number;
  filename: string;
  status: SessionStatus;
  current_iteration: number;
  session_type: SessionType;
  created_at: string;
  updated_at: string;
}

export interface ResumeErrorItem {
  original: string;
  improved: string;
  advice: string;
}

export interface ResumeAnalysisResult {
  greeting: string;
  errors: ResumeErrorItem[];
  final_message: string;
}

export interface ResumeSessionDetail {
  session_id: number;
  resume_file_id: number;
  filename: string;
  status: SessionStatus;
  current_iteration: number;
  session_type: SessionType;
  result: ResumeAnalysisResult;
  created_at: string;
  updated_at: string;
}

export interface JobItem {
  job_title: string;
  company: string;
  salary?: string;
  location?: string;
  source: string;
  url: string;
  remote: boolean;
  visa_support: boolean;
  match_score: number;
  why_match: string[];
  missing_skills: string[];
  candidate_profile?: string | null;
  source_type?: string | null;
}

export interface ResumeMatchResult {
  session_id: number;
  resume_file_id: number;
  filename: string;
  status: SessionStatus;
  current_iteration: number;
  skills_found: string[];
  jobs: JobItem[];
  final_message: string;
  created_at: string;
  updated_at: string;
}

export interface UploadQueuedResponse {
  resume_file_id: number;
  session_id: number;
  filename: string;
  status: string;
  message: string;
}