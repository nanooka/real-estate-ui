import "./feature.scss";

const Feature = ({ title, items }) => {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feature;
