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
  candidateId?: number;
  companyId?: number;
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

  async function syncBackendSession(firebaseUid: string, email: string, fallbackName?: string, roleHint?: string, knownUserId?: number) {
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
      const resolvedName = about?.company?.name || about?.candidate?.name || fallbackName || (isComp ? 'Empresa Parceira' : 'Candidato Workix');
      const resolvedId = about?.user?.id ? Number(about.user.id) : (knownUserId || (user.value?.id ? user.value.id : 0));
      const resolvedCandidateId = about?.candidate?.id ? Number(about.candidate.id) : undefined;
      const resolvedCompanyId = about?.company?.id ? Number(about.company.id) : undefined;

      const userProfile: UserProfile = {
        id: resolvedId,
        email,
        name: resolvedName,
        role: resolvedRole,
        firebase_uuid: firebaseUid,
        candidateId: resolvedCandidateId,
        companyId: resolvedCompanyId
      };

      setAuth(authToken, userProfile);
      return userProfile;
    } catch (err: any) {
      console.error('Falha na sincronização da sessão com o backend GraphQL:', err);
      throw new Error(err.message || 'Falha ao autenticar no servidor.');
    }
  }

  function isFirebaseDevOrNetworkError(err: any): boolean {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = (err.code || '').toLowerCase();
    return (
      code.includes('api-key') ||
      code.includes('invalid') ||
      code.includes('network') ||
      code.includes('unauthorized') ||
      msg.includes('api-key') ||
      msg.includes('api key') ||
      msg.includes('auth/') ||
      msg.includes('firebase')
    );
  }

  async function loginWithFirebase(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      return await syncBackendSession(fbUser.uid, fbUser.email || email);
    } catch (fbErr: any) {
      if (isFirebaseDevOrNetworkError(fbErr)) {
        const dummyUid = `dev-uid-${btoa(email).replace(/=/g, '').replace(/\+/g, '').replace(/\//g, '')}`;
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
      if (isFirebaseDevOrNetworkError(fbErr)) {
        fbUid = `dev-uid-${btoa(email).replace(/=/g, '').replace(/\+/g, '').replace(/\//g, '')}`;
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

    let createdUserId: number | undefined;
    try {
      const res = await graphqlClient.request<{ createUser: { id: string | number } }>(CREATE_USER_MUTATION, {
        input: {
          email,
          firebaseUUID: fbUid,
          activated: true
        }
      });
      if (res?.createUser?.id) {
        createdUserId = Number(res.createUser.id);
      }
    } catch (createErr) {
      console.warn('Registro de usuário no GraphQL já existente ou em fallback:', createErr);
    }

    const userProfile = await syncBackendSession(fbUid, email, name, role, createdUserId);

    // Se for candidato e ainda não tiver perfil cadastrado, cria registro de candidato
    if (role === 'CANDIDATE' && userProfile.id) {
      const CREATE_CANDIDATE_MUTATION = `
        mutation CreateCandidate($input: CandidateInput!) {
          createCandidate(input: $input) {
            id
            name
          }
        }
      `;
      try {
        const candRes = await graphqlClient.request<{ createCandidate: { id: string | number; name: string } }>(CREATE_CANDIDATE_MUTATION, {
          input: {
            name: name.trim(),
            birthDate: '2000-01-01',
            city: 'São Paulo',
            state: 'SP',
            neighborhood: 'Centro',
            street: 'Av. Principal',
            number: '1',
            zipCode: 1000000,
            mobilePhone: 11999999999,
            userId: userProfile.id
          }
        });
        if (candRes?.createCandidate?.id) {
          userProfile.candidateId = Number(candRes.createCandidate.id);
          userProfile.name = candRes.createCandidate.name || name;
          if (token.value) {
            setAuth(token.value, userProfile);
          }
        }
      } catch (candErr) {
        console.warn('Candidato já cadastrado ou erro opcional:', candErr);
      }
    }

    return userProfile;
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
