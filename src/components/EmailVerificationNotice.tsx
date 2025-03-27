import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useState } from 'react';

const EmailVerificationNotice = () => {
    const [verificationSent, setVerificationSent] = useState<boolean>(false);
    const handleResend = async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            await sendEmailVerification(user);
            setVerificationSent(true);
        }
    };

    return (
        <div>
            <p>
                <button
                    onClick={handleResend}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        color: '#646cff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        font: 'inherit'
                    }}
                >
                    Verify Email.
                </button>
                {verificationSent && <span>{' '}Email sent {' '}</span>}
            </p>
        </div>
    );
};

export default EmailVerificationNotice;
