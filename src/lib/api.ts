const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface User {
  _id?: string;
  username: string;
  email: string;
  name?: string;
  githubLink?: string;
  linkedinLink?: string;
  bio?: string;
  __v?: number;
}

export interface Hackathon {
  _id?: string;
  hackName: string;
  organization?: string;
  officialLink: string;
  appliedDate: string;
  lastDateToApply: string;
  lastDateToSubmit?: string;
  status?: 'Applied' | 'Accepted' | 'Rejected' | 'In Progress' | 'Completed';
  projectLink?: string;
  githubLink?: string;
  certificateUrl?: string;
  teamType?: 'Solo' | 'Team';
  description?: string;
  techStack?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log("Using token:", token);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const text = await response.text();
    console.log("Response text:", text);
    if (contentType?.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        if (!response.ok) {
          throw new Error(json.msg || json.error || "Request failed");
        }
        return json;
      } catch (err) {
        throw new Error("Invalid JSON from server");
      }
    }

    throw new Error(`Server error: ${response.status} ${response.statusText || "Unknown error"}`);
  }

  async getPublicProfile(username: string): Promise<{
    user: User;
    hackathons: Hackathon[];
    profile: any;
  }> {
    const response = await fetch(`${API_BASE_URL}/profile/${username}/full`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${username}`);
    }

    return response.json();
  }

  async getPublicHackathons(username: string): Promise<Hackathon[]> {
    const response = await fetch(`${API_BASE_URL}/profile/${username}/full`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hackathons for ${username}`);
    }

    const data = await response.json();
    return data.data;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async updateProfile(data: {
    username: string;
    email: string;
    bio?: string;
    githubLink?: string;
    linkedinLink?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const resJson = await this.handleResponse<{ user: User }>(response);
    return resJson.user;
  }

  async getHackathons(): Promise<Hackathon[]> {
    const response = await fetch(`${API_BASE_URL}/hackathons`, {
      headers: this.getAuthHeaders(),
    });
    const data = await this.handleResponse<{ success: boolean; data: Hackathon[] }>(response);
    return data.data;
  }

  async createHackathon(hackathon: Omit<Hackathon, '_id' | 'createdAt'>): Promise<Hackathon> {
    const response = await fetch(`${API_BASE_URL}/hackathons`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(hackathon),
    });
    console.log("Raw response:", response);

    const data = await this.handleResponse<{ hackathon: Hackathon }>(response);
    return data.hackathon;
  }

  async updateHackathon(id: string, hackathon: Partial<Hackathon>): Promise<Hackathon> {
    const response = await fetch(`${API_BASE_URL}/hackathons/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(hackathon),
    });
    const data = await this.handleResponse<{ hackathon: Hackathon }>(response);
    return data.hackathon;
  }
}

export const apiClient = new ApiClient();
