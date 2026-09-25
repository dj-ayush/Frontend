export const siteContent = {
  name: 'Explore with Me',
  social: {
    youtube: 'https://youtube.com/@its.explorewithme',
    instagram: 'https://www.instagram.com/explore_with_me_vlogs',
  },
  videos: [
    {
      url: 'https://youtu.be/jiO-3RdbVGQ',
      destination: 'Mallika Biryani / Bengaluru',
      stateId: 'ka',
      stateName: 'Karnataka',
      label: 'Food journey',
    },
    {
      url: 'https://youtu.be/XvvcGnWth7A',
      destination: 'Yelagiri',
      stateId: 'tn',
      stateName: 'Tamil Nadu',
      label: 'Hill journey',
    },
    {
      url: 'https://youtu.be/DAtrMaRw12I',
      destination: 'Chikkamagaluru',
      stateId: 'ka',
      stateName: 'Karnataka',
      label: 'Scenic journey',
    },
    {
      url: 'https://youtu.be/bZpDKFRw_xY',
      destination: 'Kolar Gold Fields',
      stateId: 'ka',
      stateName: 'Karnataka',
      label: 'Heritage journey',
    },
    {
      url: 'https://youtu.be/nqH-Ud87k-E',
      destination: 'Wayanad',
      stateId: 'kl',
      stateName: 'Kerala',
      label: 'Nature journey',
    },
    {
      url: 'https://youtu.be/O1E1oE0I_Ao',
      destination: 'Sakleshpur',
      stateId: 'ka',
      stateName: 'Karnataka',
      label: 'Road trip',
    },
    {
      url: 'https://youtu.be/OzXD8qmUOeU',
      destination: 'Kolkata',
      stateId: 'wb',
      stateName: 'West Bengal',
      label: 'Culture journey',
    },
    {
      url: 'https://youtu.be/SBLilh08v7o',
      destination: 'Explore with Me Film',
      stateId: '',
      stateName: '',
      label: 'Travel film',
    },
  ],
  categories: ['Road trips', 'City walks', 'Nature', 'Food', 'Culture'],
  get destinations() {
    return this.videos
      .filter((video) => video.destination && video.destination !== 'Explore with Me Film')
      .map((video) => ({
        name: video.destination,
        stateId: video.stateId,
        stateName: video.stateName,
        label: video.label,
        video,
      }));
  },
  exploreIndia: {
    states: [
      {
        id: 'ka',
        name: 'Karnataka',
        note: 'Verified journeys include Bengaluru, Chikkamagaluru, Kolar Gold Fields, and Sakleshpur.',
      },
      {
        id: 'tn',
        name: 'Tamil Nadu',
        note: 'Verified journey connected: Yelagiri.',
      },
      {
        id: 'kl',
        name: 'Kerala',
        note: 'Verified journey connected: Wayanad.',
      },
      {
        id: 'wb',
        name: 'West Bengal',
        note: 'Verified journey connected: Kolkata.',
      },
    ],
  },
};
