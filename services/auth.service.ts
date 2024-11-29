import Router from 'next/router'
import { hashSha256 } from '../utils/sha256-hash';
import { fetcher } from '../hooks/fetcher';
const isLoggedInKey = 'isLoggedIn'
export const wasLoggedOutKey = 'wasLoggedOut'
export const isFirstTimeUserKey = 'isFirstTimeUser'

export async function getCsrfToken(): Promise<string> {
  document.cookie = "csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  const response = await fetch(`/csrf-token`, {
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    throw new Error('Token was not received.');
  }

  return await response.text();
}
const login = async (apiBase: string, password: string) => {
  const sha256digest = await hashSha256(password);
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${apiBase}/auth/login`, {
    headers: { 'Content-Type': 'application/json' , 'X-Csrf-Token': csrfToken},
    method: 'POST',
    body: JSON.stringify({ password: sha256digest }),
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('The password you’ve entered is invalid. Please enter the correct password');
    } else if (res.status === 429) {
      throw new Error('Too many login attempts from this IP, please try again after 20 minutes');
    } else {
      throw new Error('Something went wrong. Please try again later.');
    }
  }
  await res.json();
  localStorage.setItem(isLoggedInKey, 'true');

  const isFirstTimeUserFlagPresent = localStorage.getItem(isFirstTimeUserKey);
  if (isFirstTimeUserFlagPresent) {
    localStorage.setItem(isFirstTimeUserKey, 'false');
  }
  else {
    localStorage.setItem(isFirstTimeUserKey, 'true');
  }
}

async function logout(apiBase: string) {
  const res = await fetch(`${apiBase}/auth/logout`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (res.status != 200) {
    throw new Error('Error logging out!');
  }
  localStorage.removeItem(isLoggedInKey)
  localStorage.setItem(wasLoggedOutKey, "true")
  Router.push('/login')
}

export async function checkServerAuth(): Promise<boolean> {
  const url = '/api/auth/check';
  console.log(`Checking auth at: ${url}`);
  try {
    const data = await fetcher<{ authenticated: boolean }>(url, {
      method: 'GET',
    }, (errorMsg) => console.error(errorMsg));

    return data.authenticated === true;
  } catch (error) {
    console.error('checkServerAuth: Error checking authentication:', error);
    return false;
  }
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(isLoggedInKey)
  },
  login,
  logout,
}
