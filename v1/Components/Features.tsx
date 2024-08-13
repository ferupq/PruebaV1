export default function Features() {
  return (
    <section id="features" className="p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="text-xl font-semibold">Feature 1</h3>
            <p>Description of feature 1.</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="text-xl font-semibold">Feature 2</h3>
            <p>Description of feature 2.</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="text-xl font-semibold">Feature 3</h3>
            <p>Description of feature 3.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
