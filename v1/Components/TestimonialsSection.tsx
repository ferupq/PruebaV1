export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="h-screen bg-white flex items-center justify-center"
    >
      <div className="text-center px-4 sm:px-8 md:px-16 lg:px-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          What Our Clients Say
        </h2>
        <div className="mt-8 space-y-6">
          <blockquote className="p-6 bg-white border rounded shadow-lg">
            <p className="text-lg sm:text-xl">
              "Amazing service and support. Highly recommend!"
            </p>
            <footer className="mt-4 text-sm text-gray-600">- Client 1</footer>
          </blockquote>
          <blockquote className="p-6 bg-white border rounded shadow-lg">
            <p className="text-lg sm:text-xl">
              "The best investment I've made for my business."
            </p>
            <footer className="mt-4 text-sm text-gray-600">- Client 2</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
