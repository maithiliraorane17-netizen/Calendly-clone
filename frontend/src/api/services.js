import API from "./axios";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login:    (data) => API.post("/auth/login", data),
  logout:   ()     => API.post("/auth/logout"),
  getMe:    ()     => API.get("/auth/me"),
  forgotPassword: (email)          => API.post("/auth/forgot-password", { email }),
  resetPassword:  (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
};

// ─── USER ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:      ()     => API.get("/users/profile"),
  updateProfile:   (data) => API.put("/users/profile", data),
  uploadAvatar:    (file) => {
    const form = new FormData();
    form.append("avatar", file);
    return API.put("/users/avatar", form, { headers: { "Content-Type": "multipart/form-data" } });
  },
  changePassword:    (data) => API.put("/users/change-password", data),
  getDashboardStats: ()     => API.get("/users/dashboard-stats"),
  deleteAccount:     ()     => API.delete("/users/account"),
};

// ─── EVENT TYPES ─────────────────────────────────────────────────────────────
export const eventAPI = {
  getAll:       ()         => API.get("/events"),
  create:       (data)     => API.post("/events", data),
  getOne:       (id)       => API.get(`/events/${id}`),
  update:       (id, data) => API.put(`/events/${id}`, data),
  delete:       (id)       => API.delete(`/events/${id}`),
  toggle:       (id)       => API.put(`/events/${id}/toggle`),
  getPublic:    (username, slug) => API.get(`/events/public/${username}/${slug}`),
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const bookingAPI = {
  // Public — no auth needed
  getAvailability: (eventTypeId, date) =>
    API.get(`/bookings/availability?eventTypeId=${eventTypeId}&date=${date}`),
  getAvailableMonths: (eventTypeId, month) =>
    API.get(`/bookings/availability?eventTypeId=${eventTypeId}&month=${month}`),
  create: (data) => API.post("/bookings", data),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
  reschedule: (id, data) => API.put(`/bookings/${id}/reschedule`, data),

  // Protected — host only
  getAll:      (params = {}) => API.get("/bookings", { params }),
  getOne:      (id)          => API.get(`/bookings/${id}`),
  markComplete:(id)          => API.put(`/bookings/${id}/complete`),
};
