import "./contactPage.scss";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { MdAccessTime } from "react-icons/md";

const ContactPage = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_bvw4zec", "template_g5ppyut", e.target, {
        publicKey: "4W7iqpzQysHsndBXK",
      })
      .then(
        () => {
          toast.success("Your message has been sent!");
          console.log("SUCCESS!");
          e.target.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="contact-wrapper">
      <div className="contact">
        <div className="contact-container">
          <h2>Contact Us</h2>
          <p>
            Looking to buy, sell, or rent a property? Have questions about our
            listings? Get in touch with us today!
          </p>

          <div className="contact-details">
            <Link className="contact-item" to={"tel:(123) 456-7890"}>
              <FaPhoneAlt color="teal" size={20} />
              <span>(123) 456-7890</span>
            </Link>
            <Link className="contact-item" to="mailto:info@primeestate.com">
              <AiOutlineMail color="teal" size={24} />
              <span>info@primeestate.com</span>
            </Link>
            <div className="contact-item">
              <MdAccessTime color="teal" size={24} />
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
            <Link
              className="contact-item"
              to="https://www.google.com/maps?q=285+Fulton+St,+New+York,+NY+10007"
              target="_blank"
            >
              <IoLocationSharp color="teal" size={24} />
              <span>285 Fulton St, New York, NY 10007</span>
            </Link>
          </div>

          <form className="contact-form" onSubmit={sendEmail}>
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit" value="Send">
              Send Message
            </button>
          </form>

          <div className="social-links">
            <Link
              to="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/48/facebook-new.png"
                alt="facebook-new"
              />
            </Link>
            <Link
              to="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/fluency/48/instagram-new.png"
                alt="instagram-new"
              />
            </Link>
            <Link
              to="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/3d-fluency/94/tiktok-logo.png"
                alt="tiktok-logo"
              />
            </Link>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default ContactPage;
