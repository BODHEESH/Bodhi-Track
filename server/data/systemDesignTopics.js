const systemDesignTopics = [
  {
    section: "HLD",
    title: "Fundamentals",
    topics: [
      {
        id: 1,
        title: "CAP Theorem",
        subtopics: ["Consistency", "Availability", "Partition Tolerance"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 2,
        title: "Load Balancing Strategies",
        subtopics: ["Round Robin", "Least Connections", "IP Hash"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 3,
        title: "Caching Strategies",
        subtopics: ["Redis", "Memcached", "LRU Cache"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 4,
        title: "Database Sharding & Replication",
        subtopics: ["Horizontal Sharding", "Vertical Sharding", "Master-Slave Replication"],
        difficulty: "hard",
        status: "todo"
      },
      {
        id: 5,
        title: "API Gateway & Rate Limiting",
        subtopics: ["Throttling", "Rate Limiting Algorithms", "API Security"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 6,
        title: "Event-Driven Architecture",
        subtopics: ["Kafka", "RabbitMQ", "Message Queues"],
        difficulty: "hard",
        status: "todo"
      },
      {
        id: 7,
        title: "Architecture Patterns",
        subtopics: ["Microservices", "Monolith", "Serverless"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 8,
        title: "Content Delivery",
        subtopics: ["CDN", "Cloudflare", "AWS CloudFront"],
        difficulty: "medium",
        status: "todo"
      },
      {
        id: 9,
        title: "System Monitoring",
        subtopics: ["Logging", "Monitoring", "Observability"],
        difficulty: "medium",
        status: "todo"
      }
    ]
  },
  {
    section: "HLD",
    title: "Real-world System Designs",
    topics: [
      {
        id: 10,
        title: "URL Shortener (Bit.ly)",
        difficulty: "medium",
        status: "todo",
        components: ["Load Balancer", "Hash Function", "Database", "Cache"]
      },
      {
        id: 11,
        title: "Pastebin",
        difficulty: "medium",
        status: "todo",
        components: ["Storage", "Rate Limiting", "Text Processing"]
      },
      {
        id: 12,
        title: "Rate Limiter",
        difficulty: "medium",
        status: "todo",
        components: ["Token Bucket", "Leaky Bucket", "Fixed Window"]
      },
      {
        id: 13,
        title: "Notification System",
        difficulty: "hard",
        status: "todo",
        components: ["Push Notifications", "Email", "SMS", "Queue"]
      },
      {
        id: 14,
        title: "E-commerce System",
        difficulty: "hard",
        status: "todo",
        components: ["Product Catalog", "Cart", "Payment", "Order Management"]
      },
      {
        id: 15,
        title: "Ride-Sharing App",
        difficulty: "hard",
        status: "todo",
        components: ["Location Tracking", "Matching", "Payment", "Rating"]
      },
      {
        id: 16,
        title: "Social Media Platform",
        difficulty: "hard",
        status: "todo",
        components: ["Feed", "Following", "Posts", "Notifications"]
      },
      {
        id: 17,
        title: "File Storage System",
        difficulty: "hard",
        status: "todo",
        components: ["Storage", "Sync", "Sharing", "Versioning"]
      },
      {
        id: 18,
        title: "Chat Application",
        difficulty: "hard",
        status: "todo",
        components: ["Real-time Messaging", "Presence", "Group Chat"]
      },
      {
        id: 19,
        title: "Video Streaming Platform",
        difficulty: "hard",
        status: "todo",
        components: ["Transcoding", "CDN", "Recommendations"]
      }
    ]
  },
  {
    section: "LLD",
    title: "Fundamentals",
    topics: [
      {
        id: 20,
        title: "SOLID Principles",
        difficulty: "medium",
        status: "todo",
        principles: [
          "Single Responsibility",
          "Open-Closed",
          "Liskov Substitution",
          "Interface Segregation",
          "Dependency Inversion"
        ]
      },
      {
        id: 21,
        title: "Design Patterns",
        difficulty: "hard",
        status: "todo",
        patterns: [
          "Singleton",
          "Factory",
          "Observer",
          "Strategy",
          "Decorator"
        ]
      },
      {
        id: 22,
        title: "Object-Oriented Analysis and Design",
        difficulty: "medium",
        status: "todo",
        concepts: ["Classes", "Inheritance", "Polymorphism", "Encapsulation"]
      },
      {
        id: 23,
        title: "API Design",
        difficulty: "medium",
        status: "todo",
        types: ["REST", "GraphQL", "gRPC"]
      },
      {
        id: 24,
        title: "Database Schema Design",
        difficulty: "medium",
        status: "todo",
        concepts: ["Normalization", "Indexing", "Relationships"]
      }
    ]
  },
  {
    section: "LLD",
    title: "Real-world LLD Problems",
    topics: [
      {
        id: 25,
        title: "Parking Lot System",
        difficulty: "medium",
        status: "todo",
        components: ["Spots", "Vehicles", "Pricing", "Payment"]
      },
      {
        id: 26,
        title: "Library Management System",
        difficulty: "medium",
        status: "todo",
        components: ["Books", "Members", "Borrowing", "Fines"]
      },
      {
        id: 27,
        title: "Movie Ticket Booking System",
        difficulty: "medium",
        status: "todo",
        components: ["Shows", "Seats", "Booking", "Payment"]
      },
      {
        id: 28,
        title: "Chess Game",
        difficulty: "hard",
        status: "todo",
        components: ["Board", "Pieces", "Moves", "Game Rules"]
      },
      {
        id: 29,
        title: "Elevator System",
        difficulty: "hard",
        status: "todo",
        components: ["Scheduling", "Direction", "Floor Management"]
      },
      {
        id: 30,
        title: "Stock Exchange System",
        difficulty: "hard",
        status: "todo",
        components: ["Order Matching", "Price Updates", "Transaction"]
      }
    ]
  },
  {
    section: "Case Studies",
    title: "System Design Case Studies",
    topics: [
      {
        id: 31,
        title: "Distributed Cache (Redis)",
        difficulty: "hard",
        status: "todo",
        aspects: ["Architecture", "Data Structures", "Eviction Policies"]
      },
      {
        id: 32,
        title: "Message Queue (Kafka)",
        difficulty: "hard",
        status: "todo",
        aspects: ["Pub/Sub", "Partitioning", "Replication"]
      },
      {
        id: 33,
        title: "Payment Gateway",
        difficulty: "hard",
        status: "todo",
        aspects: ["Security", "Transaction Management", "Integration"]
      },
      {
        id: 34,
        title: "Search Engine",
        difficulty: "hard",
        status: "todo",
        aspects: ["Indexing", "Ranking", "Query Processing"]
      },
      {
        id: 35,
        title: "Fraud Detection System",
        difficulty: "hard",
        status: "todo",
        aspects: ["Real-time Processing", "Machine Learning", "Rules Engine"]
      }
    ]
  }
];

module.exports = systemDesignTopics;
