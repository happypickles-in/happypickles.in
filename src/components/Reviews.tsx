import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Tastes exactly like my grandmother\'s recipe. Pure nostalgia! The Gongura pickle brought back so many childhood memories.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Hyderabad',
    rating: 5,
    text: 'The chicken pickle is insane. Perfect with rice and roti. I\'ve been ordering every week for the past 3 months.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Anjali Reddy',
    location: 'Bangalore',
    rating: 5,
    text: 'Fast delivery and amazing packaging. Already ordering again. The quality is consistently excellent!',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Vikram Rao',
    location: 'Delhi',
    rating: 5,
    text: 'Finally found authentic Andhra pickles in Delhi! The Avakaya is just like back home. Thank you Happy Pickles!',
    image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Lakshmi Naidu',
    location: 'Chennai',
    rating: 5,
    text: 'My entire family is hooked! We\'ve tried almost every flavor. The mutton pickle is our absolute favorite.',
    image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Karthik Iyer',
    location: 'Pune',
    rating: 5,
    text: 'No artificial taste, just pure homemade goodness. You can taste the love in every jar. Highly recommended!',
    image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-[#F39C12] text-[#F39C12]" />
            ))}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#2D1F14] mb-4">Loved by 25,000+ Families</h2>
          <p className="text-lg text-[#6B5A4A] max-w-2xl mx-auto">
            Real stories. Real flavors. Real happiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="sticky top-40 md:top-48"
              style={{ zIndex: 10 + index * 1 }}
            >
              
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#E8E0D6]" />
              <div className="bg-[#F5EDE3] rounded-3xl p-6 md:p-10 max-w-3xl mx-auto shadow-[0_12px_40px_rgba(0,0,0,0.08)]">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <h4 className="font-semibold text-[#2D1F14]">
                      {review.name}
                    </h4>
                    <p className="text-sm text-[#6B5A4A]">
                      {review.location}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#F39C12] text-[#F39C12]"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-[#2D1F14] text-lg leading-relaxed">
                  “{review.text}”
                </p>
              </div>
            </div>
          ))}

        </div>

        <div className="text-center mt-12">
          <p className="text-[#6B5A4A] mb-4">Join thousands of happy customers</p>
          <a href="#bestsellers" className="bg-[#E67E22] hover:bg-[#CF6C13] text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            Shop Our Bestsellers
          </a>
        </div>
      </div>
    </section>
  );
}
