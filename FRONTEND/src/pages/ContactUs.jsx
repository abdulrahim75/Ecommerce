const ContactUs = () => {
    return (
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto rounded-3xl p-8 text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-6">
            Have questions or feedback? We're here to help!
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300"
            ></textarea>
            <button className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800">
              Send Message
            </button>
          </form>
        </div>
      </section>
    );
  };
  
  export default ContactUs;
  