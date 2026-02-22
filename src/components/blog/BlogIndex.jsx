import { Link } from 'react-router-dom'
import { getAllBlogPosts } from '../../data/blog-posts.jsx'
import { useEffect } from 'react'

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogIndex() {
  const blogPosts = getAllBlogPosts()

  useEffect(() => {
    document.title = 'Blog | Sam\'s TNR - Community Cat Education & Resources'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Educational articles about TNR, community cats, and animal welfare in Brooks County, Georgia. Learn from Sam\'s TNR\'s expertise in humane cat population management.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-rust mb-4">
            TNR Education & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about community cats, TNR methods, and how you can make a difference in Brooks County, Georgia
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="text-sm text-rust font-medium mb-2">
                  {formatDate(post.date)}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="hover:text-rust transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-rust font-medium hover:text-rust-dark transition-colors"
                >
                  Read More
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-rust text-white rounded-2xl p-8 mt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Help Community Cats?
          </h2>
          <p className="text-lg mb-6">
            Join Sam's TNR in making a difference for community cats in Brooks County
          </p>
          <Link
            to="/#contact"
            className="inline-block bg-white text-rust font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Involved Today
          </Link>
        </div>
      </div>
    </div>
  )
}