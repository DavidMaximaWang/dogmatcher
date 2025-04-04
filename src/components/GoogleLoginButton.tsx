import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { auth, db, googleProvider } from '../firebase/config';

const GoogleLoginButton = () => {
    const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;

          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'user',
                createdAt: new Date(),
            });
            } else {
            await setDoc(userRef, {
                lastLoginAt: new Date(),
            }, { merge: true });
            }


          console.log('User logged in or registered:', user);
        } catch (err) {
          console.error('Google Auth Error:', err);
        }
      };

  return (
      <button onClick={handleGoogleLogin} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FcGoogle size={20} />
          Login with Google
      </button>
  );
};

export default GoogleLoginButton;