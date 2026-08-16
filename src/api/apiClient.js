const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "access_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, { method = "GET", body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  auth: {
    async register(email, password) {
      return request("/api/auth/register", { method: "POST", body: { email, password } });
    },
    async resendOtp(email) {
      return request("/api/auth/resend-otp", { method: "POST", body: { email } });
    },
    async verifyOtp(email, otpCode) {
      const data = await request("/api/auth/verify-otp", { method: "POST", body: { email, otpCode } });
      if (data?.access_token) setToken(data.access_token);
      return data;
    },
    async login(email, password) {
      const data = await request("/api/auth/login", { method: "POST", body: { email, password } });
      if (data?.access_token) setToken(data.access_token);
      return data;
    },
    async me() {
      return request("/api/auth/me");
    },
    logout() {
      setToken(null);
    },
    async forgotPassword(email) {
      return request("/api/auth/forgot-password", { method: "POST", body: { email } });
    },
    async resetPassword(resetToken, newPassword) {
      return request("/api/auth/reset-password", { method: "POST", body: { resetToken, newPassword } });
    },
    // Google OAuth deferred to a second release — backend routes are commented out
    // in server/src/routes/auth.js.
    // redirectToGoogle() {
    //   window.location.href = `${API_BASE_URL}/api/auth/google`;
    // },
    setToken,
    getToken,
    isLoggedIn() {
      return Boolean(getToken());
    },
  },

  loyaltyAccounts: {
    async filter({ user_id }) {
      return request(`/api/loyalty-accounts?user_id=${encodeURIComponent(user_id)}`);
    },
    async create(payload) {
      return request("/api/loyalty-accounts", { method: "POST", body: payload });
    },
  },

  labResults: {
    async filter({ product_id, is_visible }) {
      const params = new URLSearchParams();
      if (product_id) params.set("product_id", product_id);
      if (is_visible !== undefined) params.set("is_visible", String(is_visible));
      return request(`/api/lab-results?${params.toString()}`);
    },
    async create(payload) {
      return request("/api/lab-results", { method: "POST", body: payload });
    },
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/upload", { method: "POST", body: formData, isFormData: true });
  },

  newsletter: {
    async subscribe(email) {
      return request("/api/newsletter/subscribe", { method: "POST", body: { email } });
    },
  },

  orders: {
    async paymentConfig() {
      return request("/api/orders/payment-config");
    },
    async create(payload) {
      return request("/api/orders", { method: "POST", body: payload });
    },
    async get(id) {
      return request(`/api/orders/${id}`);
    },
    async cryptoCheckout(id) {
      return request(`/api/orders/${id}/crypto-checkout`, { method: "POST" });
    },
    async cardCheckout(id) {
      return request(`/api/orders/${id}/card-checkout`, { method: "POST" });
    },
    async simulatePaid(id) {
      return request(`/api/orders/${id}/simulate-paid`, { method: "POST" });
    },
    async adminList(status) {
      const params = status ? `?status=${encodeURIComponent(status)}` : "";
      return request(`/api/orders/admin/list${params}`);
    },
    async markPaid(id) {
      return request(`/api/orders/${id}/mark-paid`, { method: "POST" });
    },
  },

  forms: {
    // type: "contact" | "wholesale" | "ambassador"
    async submit(type, email, payload) {
      return request(`/api/forms/${type}`, { method: "POST", body: { email, payload } });
    },
  },

  reviews: {
    async list(product_id) {
      return request(`/api/reviews?product_id=${encodeURIComponent(product_id)}`);
    },
    async create(payload) {
      return request("/api/reviews", { method: "POST", body: payload });
    },
  },
};
