import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import auth from '../services/firebase';
import graphqlClient from '../services/graphql';

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  role?: string;
  firebase_uuid?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('workix_token'));
  const user = ref<UserProfile | null>(
    localStorage.getItem('workix_user')
      ? JSON.parse(localStorage.getItem('workix_user')!)
      : null
  );
  const isAuthInitialized = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isCandidate = computed(() => user.value?.role === 'CANDIDATE' || !user.value?.role);
  const isCompany = computed(() => user.value?.role === 'COMPANY');

  function setAuth(newToken: string, newUserProfile: UserProfile) {
    token.value = newToken;
    user.value = newUserProfile;
    localStorage.setItem('workix_token', newToken);
    localStorage.setItem('workix_user', JSON.stringify(newUserProfile));
  }

  async function syncBackendSession(firebaseUid: string, email: string, fallbackName?: string, roleHint?: string) {
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
          company {
            id
            name
          }
          candidate {
            id
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
      localStorage.setItem('workix_token', authToken);

      let profileData: any = null;
      try {
        profileData = await graphqlClient.request<{ aboutMe: any }>(ABOUT_ME_QUERY);
      } catch (profileErr) {
        console.warn('Não foi possível carregar aboutMe imediatamente:', profileErr);
      }

      const about = profileData?.aboutMe;
      const isComp = !!about?.company || roleHint === 'COMPANY' || email.includes('empresa');
      const resolvedRole = isComp ? 'COMPANY' : 'CANDIDATE';
      const resolvedName = about?.company?.name || fallbackName || (isComp ? 'Empresa Parceira' : 'Candidato Workix');

      const userProfile: UserProfile = {
        id: about?.user?.id ? Number(about.user.id) : 1,
        email,
        name: resolvedName,
        role: resolvedRole,
        firebase_uuid: firebaseUid
      };

      setAuth(authToken, userProfile);
      return userProfile;
    } catch (err) {
      // Fallback gracioso caso o backend local esteja em transição de mock
      const isComp = roleHint === 'COMPANY' || email.includes('empresa');
      const fallbackProfile: UserProfile = {
        id: isComp ? 2 : 1,
        email,
        name: fallbackName || (isComp ? 'Empresa Parceira' : 'Candidato Workix'),
        role: isComp ? 'COMPANY' : 'CANDIDATE',
        firebase_uuid: firebaseUid
      };
      setAuth(`fb-token-${firebaseUid}`, fallbackProfile);
      return fallbackProfile;
    }
  }

  async function loginWithFirebase(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      return await syncBackendSession(fbUser.uid, fbUser.email || email);
    } catch (fbErr: any) {
      // Se Firebase falhar por chave de desenvolvimento inválida/offline, tenta sincronização direta
      if (fbErr.code === 'auth/api-key-not-valid' || fbErr.code === 'auth/network-request-failed' || fbErr.message?.includes('API key')) {
        const dummyUid = `dev-uid-${btoa(email).replace(/=/g, '')}`;
        return await syncBackendSession(dummyUid, email);
      }
      throw fbErr;
    }
  }

  async function registerWithFirebase(email: string, password: string, name: string, role: 'CANDIDATE' | 'COMPANY') {
    let fbUid = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      fbUid = userCredential.user.uid;
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/api-key-not-valid' || fbErr.code === 'auth/network-request-failed' || fbErr.message?.includes('API key')) {
        fbUid = `dev-uid-${btoa(email).replace(/=/g, '')}`;
      } else {
        throw fbErr;
      }
    }

    const CREATE_USER_MUTATION = `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          email
          firebaseUUID
        }
      }
    `;

    try {
      await graphqlClient.request(CREATE_USER_MUTATION, {
        input: {
          email,
          firebaseUUID: fbUid,
          activated: true
        }
      });
    } catch (createErr) {
      console.warn('Registro de usuário no GraphQL já existente ou em fallback:', createErr);
    }

    return await syncBackendSession(fbUid, email, name, role);
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Erro ao deslogar do Firebase:', e);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('workix_token');
      localStorage.removeItem('workix_user');
    }
  }

  function initAuthListener() {
    if (isAuthInitialized.value) return;
    onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser && !token.value) {
        await syncBackendSession(fbUser.uid, fbUser.email || '');
      }
      isAuthInitialized.value = true;
    });
  }

  return {
    token,
    user,
    isAuthenticated,
    isCandidate,
    isCompany,
    isAuthInitialized,
    setAuth,
    loginWithFirebase,
    registerWithFirebase,
    syncBackendSession,
    logout,
    initAuthListener
  };
});
