export interface BlogPost {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    image: string;
    content: string; // HTML or Markdown content
}

export const featuredArticle: BlogPost = {
    slug: 'reimagining-urban-logistics-iraq',
    category: 'Technology',
    title: 'Reimagining Urban Logistics in Iraq: The Story Behind SmartRoute 2.0',
    excerpt: 'How we built a machine learning model that navigates Baghdad’s complex traffic patterns better than any veteran driver.',
    date: 'Sep 12, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>Baghdad's traffic is legendary, but so is our determination. SmartRoute 2.0 isn't just an algorithm; it's a love letter to efficiency in a chaotic environment.</p>
      <h2>The Challenge</h2>
      <p>Traditional GPS systems often fail to account for the dynamic nature of urban traffic in Iraq. Checkpoints, temporary closures, and rush hour surges can turn a 10-minute delivery into a an hour-long ordeal.</p>
      <h2>Our Solution</h2>
      <p>We gathered data from thousands of trips to build a predictive model that anticipates bottlenecks before they happen.</p>
      <p>The result? A 30% reduction in average delivery times and happier drivers who spend less time stuck in gridlock.</p>
    `
};

export const articles: BlogPost[] = [
    {
        slug: 'jayak-hub-launches-basra-najaf',
        category: 'Expansion',
        title: 'Jayak Hub Launches in Basra & Najaf',
        excerpt: 'Bringing reliable delivery to the south. Here is what you need to know about our expansion.',
        date: 'Oct 24, 2025',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2831&auto=format&fit=crop',
        content: '<p>The wait is over! Jayak Hub is now live in Basra and Najaf...</p>'
    },
    {
        slug: '50-new-brands-join',
        category: 'Partnership',
        title: 'Exclusive: 50+ New Brands Join the Platform',
        excerpt: 'From local gems to international chains, see who just joined the Jayak Hub family.',
        date: 'Aug 05, 2025',
        readTime: '3 min read',
        image: '/blog2.avif',
        content: '<p>We are thrilled to welcome over 50 new partners to our growing network...</p>'

    },
    {
        slug: 'rise-of-cloud-kitchens-2025',
        category: 'Analysis',
        title: 'The Rise of Cloud Kitchens in 2025',
        excerpt: 'Data shows a 300% surge in delivery-only restaurants. What does this mean for food culture?',
        date: 'Jul 18, 2025',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2080&auto=format&fit=crop',
        content: '<p>Cloud kitchens are reshaping the culinary landscape...</p>'
    },
    {
        slug: 'riders-charity-run',
        category: 'Community',
        title: 'Riders Charity Run: A Huge Success',
        excerpt: 'Over 200 riders gathered this weekend to raise funds for local education programs.',
        date: 'Jun 30, 2025',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
        content: '<p>It was a day to remember as our rider community came together...</p>'
    },
    {
        slug: 'group-ordering-here',
        category: 'Product',
        title: 'Group Ordering is Finally Here',
        excerpt: 'Work lunch made easy. Split bills and track everyone’s order in one simple cart.',
        date: 'May 12, 2025',
        readTime: '2 min read',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
        content: '<p>Say goodbye to the hassle of coordinating lunch orders...</p>'
    },
    {
        slug: 'meet-ahmed-rider-spotlight',
        category: 'Drivers',
        title: 'Meet Ahmed: The Rider Who Delivered 5000 Smiles',
        excerpt: 'A spotlight on one of our top-rated partners and his journey with Jayak Hub.',
        date: 'Apr 28, 2025',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2015&auto=format&fit=crop',
        content: '<p>Ahmed has been with us since day one...</p>'
    },
];
