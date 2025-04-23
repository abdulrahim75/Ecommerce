const Features = () => {
    const features = [
      "Premium quality fabrics",
      "Sustainable & eco-friendly production",
      "Trendy and timeless styles",
      "Affordable prices",
      "Easy returns and fast delivery",
    ];
  
    return (
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto rounded-3xl p-8 text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-6">Why Shop With Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3">
            {features.map((item, index) => (
              <li key={index} className="text-lg">{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };
  
  export default Features;
  