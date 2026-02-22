import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog-posts'

export default function BlogPreview() {
  const latestPost = blogPosts[0]

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">From Our Blog</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about TNR, community cats, and how you can make a difference in Brooks County.
          </p>
        </div>

        <Link
          to={`/blog/${latestPost.slug}`}
          className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden block"
        >
          <div className="p-8">
            <p className="text-sm text-gray-400 mb-2">{new Date(latestPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rust transition-colors mb-3">
              {latestPost.title}
            </h3>
            <p className="text-gray-600 text-lg">{latestPost.excerpt}</p>
            <span className="inline-block mt-4 text-rust font-semibold group-hover:underline">
              Read More →
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
