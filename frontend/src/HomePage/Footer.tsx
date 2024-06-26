import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">Clinic-O</h1>
          <p>
            Clinic-O is dedicated to providing compassionate healthcare services to our community. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/clinic-o" className="social-icon"><FaFacebook /></a>
            <a href="https://www.twitter.com/clinic-o" className="social-icon"><FaTwitter /></a>
            <a href="https://www.instagram.com/clinic-o" className="social-icon"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Clinic-O. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
