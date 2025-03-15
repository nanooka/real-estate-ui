import { useState } from "react";
import "./faqsPage.scss";
import { MdKeyboardArrowDown } from "react-icons/md";

const faqs = [
  {
    category: "General Questions",
    items: [
      {
        question: "What is this platform about?",
        answer:
          "Our platform connects buyers, sellers, and renters with real estate agents and property owners. We offer a seamless experience for listing, searching, and managing real estate transactions.",
      },
      {
        question: "How do I create an account?",
        answer:
          'Click on the "Log in" button, then click on "Don\'t you have an account?" and provide the required details. Once registered, you can start browsing or listing properties.',
      },
      {
        question: "Is the platform free to use?",
        answer:
          "Yes, users can browse listings for free. However, there may be premium features that require payment.",
      },
    ],
  },
  {
    category: "Listings & Properties",
    items: [
      {
        question: "How can I list a property?",
        answer:
          'Log in, go to your profile, go to "Create New Post", fill in details, upload images, and submit your listing.',
      },
      {
        question: "Can I edit or remove my listing?",
        answer:
          "Yes, you can manage your listings through your dashboard, edit details, or remove them anytime.",
      },
      {
        question: "How do I search for properties?",
        answer:
          "Use the search bar and filters to refine results based on location, price, and property type.",
      },
    ],
  },
  {
    category: "Transactions & Payments",
    items: [
      {
        question: "How do I contact a property owner or agent?",
        answer:
          "Each listing contains contact details, and you can also use our messaging feature to communicate directly.",
      },
      {
        question: "Is online payment available?",
        answer:
          "Yes, we support secure online transactions for bookings and premium services.",
      },
      {
        question: "Are transactions secure?",
        answer:
          "We use encrypted payment gateways and industry security standards to protect your transactions.",
      },
    ],
  },
  {
    category: "Support & Policies",
    items: [
      {
        question: "What if I encounter a problem with a listing?",
        answer:
          "You can report a listing using the 'Report' button or contact support for assistance.",
      },
      {
        question: "Can I get a refund for a premium service?",
        answer:
          "Refund policies vary by service. Check our terms or contact support for details.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach us via email, live chat, or phone through the 'Contact Us' page.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-category">
          <h3>{faq.category}</h3>
          {faq.items.map((item, i) => {
            const itemIndex = `${index}-${i}`;
            return (
              <div
                key={i}
                className={`faq-item ${openIndex === itemIndex ? "open" : ""}`}
                onClick={() => toggleAccordion(itemIndex)}
              >
                <div className="question">{item.question}</div>
                <div
                  className="arrow"
                  style={{
                    transform: openIndex == itemIndex && "rotate(-180deg)",
                  }}
                >
                  <MdKeyboardArrowDown size={24} />
                </div>
                <div
                  className="answerContainer"
                  style={{
                    maxHeight: openIndex === itemIndex ? "200px" : "0px",
                    opacity: openIndex === itemIndex ? 1 : 0,
                  }}
                >
                  <div className="answer">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
