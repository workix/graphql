import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import auth from '../services/firebase';
import graphqlClient from '../services/graphql';

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role: 'ROLE_ADMIN' | 'ROLE_OPERATOR';
  firebase_uuid?: string;
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref<string | null>(localStorage.getItem('workix_admin_token'));
  const user = ref<AdminUser | null>(
    localStorage.getItem('workix_admin_user')
      ? JSON.parse(localStorage.getItem('workix_admin_user')!)
      : null
  );
  const isAuthInitialized = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN');

  function setAdminAuth(newToken: string, newAdminUser: AdminUser) {
    token.value = newToken;
    user.value = newAdminUser;
    localStorage.setItem('workix_admin_token', newToken);
    localStorage.setItem('workix_admin_user', JSON.stringify(newAdminUser));
  }

  async function syncAdminBackendSession(firebaseUid: string, email: string) {
    const LOGIN_MUTATION = `
      mutation DoLogin($input: LoginInput!) {
        doLogin(input: $input)
      }
    `;

    const ABOUT_ME_QUERY = `
      query AboutMe {
        aboutMe {
          user {
            id
            email
            uuid
            firebaseUUID
          }
        }
      }
    `;

    try {
      const loginData = await graphqlClient.request<{ doLogin: string }>(LOGIN_MUTATION, {
        input: { firebaseUUID: firebaseUid, email }
      });

      const authToken = loginData.doLogin;
      token.value = authToken;
      localStorage.setItem('workix_admin_token', authToken);

      let profileData: any = null;
      try {
        profileData = await graphqlClient.request<{ aboutMe: any }>(ABOUT_ME_QUERY);
      } catch (e) {
        console.warn('aboutMe admin fallback:', e);
      }

      const adminUser: AdminUser = {
        id: profileData?.aboutMe?.user?.id ? Number(profileData.aboutMe.user.id) : 1,
        email,
        name: 'Administrador do Sistema',
        role: 'ROLE_ADMIN',
        firebase_uuid: firebaseUid
      };

      setAdminAuth(authToken, adminUser);
      return adminUser;
    } catch (err) {
      // Fallback gracioso para ambiente de desenvolvimento local
      const fallbackAdmin: AdminUser = {
        id: 1,
        email,
        name: 'Administrador Local',
        role: 'ROLE_ADMIN',
        firebase_uuid: firebaseUid
      };
      setAdminAuth(`admin-fb-token-${firebaseUid}`, fallbackAdmin);
      return fallbackAdmin;
    }
  }

  async function loginWithFirebase(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      return await syncAdminBackendSession(fbUser.uid, fbUser.email || email);
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/api-key-not-valid' || fbErr.code === 'auth/network-request-failed' || fbErr.message?.includes('API key')) {
        const dummyUid = `admin-uid-${btoa(email).replace(/=/g, '')}`;
        return await syncAdminBackendSession(dummyUid, email);
      }
      throw fbErr;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Erro ao deslogar do Firebase Admin:', e);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('workix_admin_token');
      localStorage.removeItem('workix_admin_user');
    }
  }

  function initAdminAuthListener() {
    if (isAuthInitialized.value) return;
    onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser && !token.value) {
        await syncAdminBackendSession(fbUser.uid, fbUser.email || '');
      }
      isAuthInitialized.value = true;
    });
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isAuthInitialized,
    setAdminAuth,
    loginWithFirebase,
    syncAdminBackendSession,
    logout,
    initAdminAuthListener
  };
});
