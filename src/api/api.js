const API = 'http://localhost:8080/api'

export const auth = {
  login: (data) => fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.ok ? res.json() : Promise.reject('Login failed')),

  register: (data) => fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.ok ? res.json() : Promise.reject('Registration failed'))
}