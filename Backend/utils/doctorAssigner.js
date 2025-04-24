const doctors = [
    {
      id: 'doc1',
      name: 'Dr. Asha Reddy',
      languages: ['English', 'Telugu', 'Hindi'],
      avatar: '/uploads/doctors/asha_reddy.png',
    },
    {
      id: 'doc2',
      name: 'Dr. Rajeev Kumar',
      languages: ['English', 'Hindi', 'Telugu'],
      avatar: '/uploads/doctors/rajeev_kumar.png',
    },
    {
      id: 'doc3',
      name: 'Dr. Neha Sharma',
      languages: ['English', 'Hindi'],
      avatar: '/uploads/doctors/neha_sharma.png',
    },
    {
      id: 'doc4',
      name: 'Dr. Karthik Iyer',
      languages: ['English', 'Telugu'],
      avatar: '/uploads/doctors/karthik_iyer.png',
    },
    {
      id: 'doc5',
      name: 'Dr. Priya Nair',
      languages: ['English', 'Hindi'],
      avatar: '/uploads/doctors/priya_nair.png',
    },
  ];
  
  function assignRandomDoctor() {
    const randomIndex = Math.floor(Math.random() * doctors.length);
    return doctors[randomIndex];
  }
  
  module.exports = assignRandomDoctor;
  