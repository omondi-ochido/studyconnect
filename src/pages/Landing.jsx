import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="text-white">
              <div className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Trusted by students at JOOUST
              </div>
              <h1 className="text-6xl font-bold mb-6 leading-tight">Find Your Perfect Study Group</h1>
              <p className="text-xl mb-8 opacity-90">
                Connect with classmates, share knowledge and ace your exams together. Join thousands of students already studying smarter.
              </p>
              
              <div className="flex gap-4 mb-12">
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-8 py-3 rounded-lg font-semibold transition"
                >
                  Browse Groups
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 stat-item">
                <div className="pr-8 border-r border-white border-opacity-20">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-white opacity-90">Active Students</p>
                </div>
                <div className="pr-8 border-r border-white border-opacity-20">
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-white opacity-90">Study Groups</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">20+</p>
                  <p className="text-white opacity-90">Courses</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hero-image">
              <img
                src="https://images.pexels.com/photos/28993557/pexels-photo-28993557.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Study group collaboration"
                className="rounded-2xl shadow-2xl w-full"
                style={{ transform: 'rotate(2deg)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-block bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Browse Groups</h3>
              <p className="text-gray-600">
                Search for study groups by course, topic, or location that match your needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-block bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Join a Group</h3>
              <p className="text-gray-600">
                Click to join any group that has space. Connect with your study partners instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-block bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Start Studying</h3>
              <p className="text-gray-600">
                Meet with your group, collaborate on assignments, and ace your exams together.
              </p>
            </div>
          </div>

          {/* How It Works Image */}
          <div>
            <img
              src="https://images.pexels.com/photos/9572495/pexels-photo-9572495.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Students studying together"
              className="rounded-2xl w-full h-96 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Stacked Images */}
            <div className="space-y-6">
              <img
                src="https://images.pexels.com/photos/9572464/pexels-photo-9572464.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Study group discussion"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
              <div className="transform translate-y-6">
                <img
                  src="https://images.pexels.com/photos/10744384/pexels-photo-10744384.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Online collaboration"
                  className="rounded-xl shadow-lg w-3/4 h-48 object-cover ml-auto"
                />
              </div>
            </div>

            {/* Right Side - Features */}
            <div>
              <h2 className="text-4xl font-bold mb-12 text-gray-900">Why Choose StudyConnect?</h2>
              
              <div className="space-y-8">
                {/* Feature 1 */}
                <div className="flex gap-4">
                  <div className="text-3xl text-emerald-500">🔍</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Groups</h3>
                    <p className="text-gray-600">Browse by course, topic or location to find your perfect study match.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4">
                  <div className="text-3xl text-emerald-500">⚡</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Instantly</h3>
                    <p className="text-gray-600">One click to join any open group and start collaborating right away.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4">
                  <div className="text-3xl text-emerald-500">📚</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Together</h3>
                    <p className="text-gray-600">Collaborate and share resources with motivated study partners.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4">
                  <div className="text-3xl text-emerald-500">📊</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
                    <p className="text-gray-600">See your groups and study history in one convenient place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">What Students Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-sky-500">
              <p className="text-gray-700 mb-6 italic">
                "StudyConnect helped me find a group for my CS project. We aced the presentation!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-lg">
                  JK
                </div>
                <div>
                  <p className="font-semibold text-gray-900">James K</p>
                  <p className="text-sm text-gray-600">Computer Science</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-sky-500">
              <p className="text-gray-700 mb-6 italic">
                "I was struggling with calculus until I joined a study group here. Game changer!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                  AM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Aisha M</p>
                  <p className="text-sm text-gray-600">Mathematics</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-sky-500">
              <p className="text-gray-700 mb-6 italic">
                "Best way to meet serious students in your course. Highly recommend!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-lg">
                  BO
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Brian O</p>
                  <p className="text-sm text-gray-600">Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-sky-600 to-emerald-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Study Smarter?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join your classmates and find your perfect study group today
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-700">
            {/* Left - Logo */}
            <div>
              <h3 className="text-2xl font-bold mb-2">StudyConnect</h3>
              <p className="text-gray-400">Making studying together easier for students everywhere.</p>
            </div>

            {/* Right - Links */}
            <div className="flex justify-end gap-8">
              <Link to="/" className="text-gray-400 hover:text-white transition">
                Home
              </Link>
              <Link to="/login" className="text-gray-400 hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-white transition">
                Register
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center text-gray-400">
            <p>© 2026 StudyConnect. Built for JOOUST students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
