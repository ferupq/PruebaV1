export default function ContactSection() {
  return (
    <section
      id="contact"
      className="h-screen bg-white flex items-center justify-center"
    >
      <div className="text-center px-4 sm:px-8 md:px-16 lg:px-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Contact Us
        </h2>
        <p className="mt-4 text-lg sm:text-xl">
          Get in touch with us for more information
        </p>
        <form className="mt-8 max-w-lg mx-auto">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
