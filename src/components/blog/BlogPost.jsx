import { useParams, Link, Navigate } from 'react-router-dom'
import { getBlogPostBySlug } from '../../data/blog-posts.jsx'
import { useEffect } from 'react'

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function SocialShare({ post }) {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(post.title)
  const text = encodeURIComponent(post.excerpt)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`
  }

  return (
    <div className="flex items-center gap-4 py-6 border-t border-gray-200">
      <span className="text-gray-600 font-medium">Share this article:</span>
      <div className="flex gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
          aria-label="Share on Twitter"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a
          href={shareLinks.email}
          className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Share via email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPostBySlug(slug)

  // If post not found, redirect to blog index
  if (!post) {
    return <Navigate to="/blog" replace />
  }

  useEffect(() => {
    // Set document title and meta description
    document.title = post.seoTitle || `${post.title} | Sam's TNR`
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', post.metaDescription)
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription,
      "author": {
        "@type": "Organization",
        "name": "Sam's TNR, Inc."
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sam's TNR, Inc.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://i.postimg.cc/QMwhWTWV/Logo-tipped-ear-transparent-with-text.png"
        }
      },
      "datePublished": post.date,
      "dateModified": post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Scroll to top
    window.scrollTo(0, 0)

    return () => {
      // Cleanup structured data script
      document.head.removeChild(script)
    }
  }, [post])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back to Blog Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-rust hover:text-rust-dark transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="p-8 pb-6 border-b border-gray-200">
            <div className="text-sm text-rust font-medium mb-3">
              {formatDate(post.date)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              {post.content}
            </div>

            {/* Social Share */}
            <div className="max-w-3xl mx-auto mt-8">
              <SocialShare post={post} />
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="bg-rust text-white rounded-xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Learn More About Sam's TNR
          </h2>
          <p className="text-lg mb-6">
            Discover how we're helping community cats in Brooks County, Georgia
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="bg-white text-rust font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Visit Our Homepage
            </Link>
            <Link
              to="/#contact"
              className="border-2 border-white text-white font-bold py-2 px-6 rounded-lg hover:bg-white hover:text-rust transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Related Articles - uncomment when more posts exist */}
      </div>
    </div>
  )
}