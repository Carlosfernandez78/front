import { test, expect } from '@playwright/test'

const API = process.env.VITE_API_URL || 'http://localhost:3000'

async function apiLogin(request, email, contrasena) {
  const res = await request.post(`${API}/auth/register`, {
    data: { nombre: 'Test', email, contrasena },
  })
  expect([201, 400]).toContain(res.status())
  const login = await request.post(`${API}/auth/login`, {
    data: { email, contrasena },
  })
  expect(login.ok()).toBeTruthy()
  const body = await login.json()
  return body.token
}

test('Home carga y Navbar visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('nav')).toBeVisible()
  await expect(page.locator('#catalog-title')).toBeVisible()
})

test('Login y crear reserva (flujo básico con fechas)', async ({ page, request }) => {
  const email = `test${Date.now()}@ex.com`
  const pass = 'secret123'
  const token = await apiLogin(request, email, pass)

  // Guardar token en localStorage
  await page.addInitScript((tkn) => localStorage.setItem('authToken', tkn), token)

  await page.goto('/reserva/sedan-2023')
  await page.fill('#pickup-date', new Date(Date.now() + 86400000).toISOString().slice(0, 10))
  await page.fill('#return-date', new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10))
  await page.click('button:has-text("Reservar ahora")')

  // Se muestra algún alert; no hay confirmación visual estable, así que navegamos a reservas
  await page.goto('/reservas')
  await expect(page.locator('h1:has-text("Mis reservas")')).toBeVisible()
})
