import { Link } from "react-router-dom";
import "./aboutUs.scss";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Feature from "../../components/feature/Feature";
import { Suspense } from "react";
import Spinner from "../../components/spinner/Spinner";

export default function AboutUs() {
  return (
    <Suspense fallback={<Spinner />}>
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
            <Feature
              title="For Buyers & Renters"
              items={[
                "Browse thousands of verified listings",
                "Use smart filters to find your perfect home",
                "Connect directly with property owners or agents",
              ]}
            />

            <Feature
              title="For Sellers & Landlords"
              items={[
                "List properties in minutes",
                "Get exposure to potential buyers and renters",
                "Manage inquiries and transactions easily",
              ]}
            />

            <Feature
              title="For Real Estate Professionals"
              items={[
                "Expand your reach and grow your business",
                "Gain access to real-time market insights",
                "Connect with motivated buyers and sellers",
              ]}
            />
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
    </Suspense>
  );
}
