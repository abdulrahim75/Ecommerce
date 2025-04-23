const FAQs = () => {
    const faqData = [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return policy. Items must be unused and in original condition.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-7 business days depending on your location.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "Yes, we ship to most countries. International shipping charges may apply.",
      },
    ];
  
    return (
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto rounded-3xl p-8 text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default FAQs;
  