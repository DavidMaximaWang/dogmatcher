import LoginLinks from '../components/LoginLinks';
import { useAuth } from '../context/AuthContext';

const About = () => {
    const {user} = useAuth();
    return (
        <div>
           { !user ? <LoginLinks /> : null}
            <p style={!user ? { marginTop: '3.2rem' } : {}}>
                Thank you for visiting! Check out more of my projects on: &nbsp;
                <a href="https://github.com/davidmaximawang" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
            </p>
            <p>
                {' '}
                email: qunlingw@gmail.com
                {/* <a href="https://github.com/DavidMaximaWang/fetch-react" target="_blank" rel="noopener noreferrer">
                    Fetch React Project(private, email: qunlingw@gmail.com)
                </a> */}
            </p>
            <p>
                <img style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} src="http://res.cloudinary.com/dcmo3iprb/image/upload/v1743706355/unsigned_dog_uploads/dog1_p8lgzn.jpg" alt="screens" />
            </p>
            <p>
                <img style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} src="http://res.cloudinary.com/dcmo3iprb/image/upload/v1743706362/unsigned_dog_uploads/dog2_dafa2k.jpg" alt="screens" />
            </p>
        </div>
    );
};

export default About;
