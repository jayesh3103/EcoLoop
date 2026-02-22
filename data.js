// Mock data for EcoLoop MVP

export const campusNeeds = [
  {
    id: 'n1',
    item: 'Stepper Motor',
    club: 'Robotics Club',
    urgency: 'High',
    message: 'We need a 12V stepper motor for our autonomous rover project.',
  },
  {
    id: 'n2',
    item: '12V Brushless DC Fan',
    club: 'Engineering Senior Capstone',
    urgency: 'Medium',
    message: 'Looking for a 12V fan to build a custom drone cooling system.',
  },
  {
    id: 'n3',
    item: 'Arduino Uno',
    club: 'IoT Society',
    urgency: 'Low',
    message: 'Need an extra Arduino for a smart gardening workshop.',
  }
];

export const diyGuides = {
  'Broken Fan': {
    title: 'Solder Fume Extractor',
    item: 'PC Fan',
    steps: [
      '1. Clean the fan blades and ensure the motor still spins freely.',
      '2. Attach a 12V power supply to the positive and negative terminals.',
      '3. Cut a piece of activated carbon filter to match the fan size.',
      '4. Secure the filter to the intake side of the fan using zip ties or a 3D-printed bracket.',
      '5. Mount the fan on a small stand and place it near your soldering iron.'
    ],
    co2Saved: 2.5 // kg
  }
};

export const recentActivity = [
  { id: 'a1', action: 'Old RAM -> Upcycled', time: '2 hours ago' },
  { id: 'a2', action: 'Stepper Motor -> Donated to Robotics Club', time: '1 day ago' },
  { id: 'a3', action: 'Broken PSU -> E-waste Facility', time: '3 days ago' },
];

export const userStats = {
  co2Saved: 12.5, // Total kg of CO2 saved
  ecoPoints: 340,
  itemsRescued: 7
};
