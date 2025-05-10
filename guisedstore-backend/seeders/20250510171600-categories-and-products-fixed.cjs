'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, insert categories
    const categories = [
      {
        id: uuidv4(),
        name: 'Online Courses',
        description: 'Self-help and healing programs for emotional wellness',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Community Events',
        description: 'Virtual and in-person meetups for connection and support',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mental Health Resources',
        description: 'Books, guides, and digital tools for mental wellbeing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Branded Merchandise',
        description: 'Apparel and accessories with empowering messages',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'One-on-One Counseling',
        description: 'Professional guidance through difficult times',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Educational Webinars',
        description: 'Learning opportunities around emotional intelligence',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});

    // Get the inserted categories
    const insertedCategories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Map category names to their IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Create products with correct category references
    const products = [
      // Online Courses
      {
        id: uuidv4(),
        name: 'Mindfulness Mastery Program',
        description: 'A comprehensive 8-week online course teaching mindfulness practices for daily life. Includes guided meditations, weekly live sessions, and practical exercises.',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
        price: 8999,
        status: 'available',
        categoryId: categoryMap['Online Courses'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Self-Discovery Journey',
        description: 'An introspective 12-week program focused on personal growth and emotional awareness. Includes journaling prompts and self-reflection exercises.',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',
        price: 7499,
        status: 'available',
        categoryId: categoryMap['Online Courses'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Anxiety Management Course',
        description: '6-week program teaching evidence-based techniques for managing anxiety and stress.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        price: 5999,
        status: 'available',
        categoryId: categoryMap['Online Courses'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Community Events
      {
        id: uuidv4(),
        name: 'Monthly Wellness Circle',
        description: 'Virtual community gathering for support, sharing, and connection. Professional facilitator guides meaningful discussions.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
        price: 899,
        status: 'available',
        categoryId: categoryMap['Community Events'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Healing Through Art Workshop',
        description: 'In-person creative workshop combining art therapy techniques with emotional expression. All materials included.',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
        price: 2699,
        status: 'available',
        categoryId: categoryMap['Community Events'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Meditation Retreat Day',
        description: 'Full-day immersive experience with guided meditations, mindful movement, and group discussions.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        price: 4499,
        status: 'available',
        categoryId: categoryMap['Community Events'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mental Health Resources
      {
        id: uuidv4(),
        name: 'Anxiety Management Toolkit',
        description: 'Comprehensive digital resource packed with CBT techniques, coping strategies, and practical exercises.',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9',
        price: 1499,
        status: 'available',
        categoryId: categoryMap['Mental Health Resources'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Emotional Intelligence Guide',
        description: 'In-depth ebook on understanding and managing emotions, with practical exercises and assessments.',
        image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e',
        price: 749,
        status: 'available',
        categoryId: categoryMap['Mental Health Resources'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sleep Better Program',
        description: 'Digital program with sleep meditation audios, bedtime routine guide, and sleep tracking tools.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
        price: 1199,
        status: 'available',
        categoryId: categoryMap['Mental Health Resources'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Branded Merchandise
      {
        id: uuidv4(),
        name: 'Empowerment T-Shirt',
        description: 'Soft, organic cotton t-shirt with inspirational message. Available in multiple sizes.',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        price: 899,
        status: 'available',
        categoryId: categoryMap['Branded Merchandise'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Wellness Journal Set',
        description: 'Beautiful journal set with guided prompts, gratitude pages, and mood tracking.',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57',
        price: 1049,
        status: 'available',
        categoryId: categoryMap['Branded Merchandise'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Healing Crystal Kit',
        description: 'Set of carefully selected crystals with guide for emotional healing and meditation.',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
        price: 1799,
        status: 'available',
        categoryId: categoryMap['Branded Merchandise'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // One-on-One Counseling
      {
        id: uuidv4(),
        name: 'Initial Consultation',
        description: '45-minute video session with a licensed therapist to discuss your needs and goals.',
        image: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df',
        price: 2699,
        status: 'available',
        categoryId: categoryMap['One-on-One Counseling'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: '4-Session Package',
        description: 'Package of four 60-minute therapy sessions with the same counselor.',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
        price: 8999,
        status: 'available',
        categoryId: categoryMap['One-on-One Counseling'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Crisis Support Session',
        description: 'Same-day emergency counseling session with an experienced therapist.',
        image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41',
        price: 3899,
        status: 'available',
        categoryId: categoryMap['One-on-One Counseling'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Educational Webinars
      {
        id: uuidv4(),
        name: 'Stress Management Masterclass',
        description: '2-hour live webinar teaching practical stress management techniques.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        price: 1799,
        status: 'available',
        categoryId: categoryMap['Educational Webinars'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Boundaries Workshop',
        description: 'Interactive online workshop about setting and maintaining healthy boundaries.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
        price: 1499,
        status: 'available',
        categoryId: categoryMap['Educational Webinars'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Emotional Intelligence at Work',
        description: 'Professional development webinar on applying EQ skills in the workplace.',
        image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70',
        price: 2399,
        status: 'available',
        categoryId: categoryMap['Educational Webinars'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};
