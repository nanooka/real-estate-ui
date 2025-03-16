import { Link } from "react-router-dom";
import "./aboutUs.scss";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

export default function AboutUs() {
  return (
    <section className="about-us">
      <div className="container">
        <h1 className="title">About Us</h1>
        <p className="subtitle">Your Ultimate Real Estate Marketplace</p>
        <p className="description">
          Welcome to <strong>PrimeEstate</strong>, the go-to destination for
          buying, selling, and renting properties with ease. Our platform is
          designed to connect property owners, buyers, and real estate
          professionals seamlessly.
        </p>

        <div className="features">
          <div className="feature">
            <h3>For Buyers & Renters</h3>
            <ul>
              <li>Browse thousands of verified listings</li>
              <li>Use smart filters to find your perfect home</li>
              <li>Connect directly with property owners or agents</li>
            </ul>
          </div>

          <div className="feature">
            <h3>For Sellers & Landlords</h3>
            <ul>
              <li>List properties in minutes</li>
              <li>Get exposure to potential buyers and renters</li>
              <li>Manage inquiries and transactions easily</li>
            </ul>
          </div>

          <div className="feature">
            <h3>For Real Estate Professionals</h3>
            <ul>
              <li>Expand your reach and grow your business</li>
              <li>Gain access to real-time market insights</li>
              <li>Connect with motivated buyers and sellers</li>
            </ul>
          </div>
        </div>

        <div className="why-choose-us">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>
              <strong>User-Friendly Interface:</strong> Easy property searches
              and listings
            </li>
            <li>
              <strong>Verified Listings:</strong> Ensuring quality and
              authenticity
            </li>
            <li>
              <strong>Data-Driven Insights:</strong> Market trends and pricing
              analysis
            </li>
            <li>
              <strong>Secure & Transparent:</strong> Prioritizing trust and
              smooth transactions
            </li>
          </ul>
        </div>

        <div className="cta">
          <h2>Join Our Community Today!</h2>
          <p>Start browsing or list your property today!</p>
          <div className="contact-info">
            <Link to={"tel:(123) 456-7890"}>
              <FaPhoneAlt />
              <span>(123) 456-7890</span>
            </Link>
            <Link to="mailto:info@primeestate.com">
              <AiOutlineMail size={20} />
              <span>info@primeestate.com</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
