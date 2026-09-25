const defaultTitle = 'Watch this journey';

const videoRows = [
  ['jiO-3RdbVGQ', 'Food', 'Mallika Biryani / Bengaluru', 'ka', 'Karnataka', 'Food journey'],
  ['XvvcGnWth7A', 'Travel', 'Yelagiri', 'tn', 'Tamil Nadu', 'Hill journey'],
  ['DAtrMaRw12I', 'Travel', 'Chikkamagaluru', 'ka', 'Karnataka', 'Scenic journey'],
  ['bZpDKFRw_xY', 'Hidden Gems', 'Kolar Gold Fields', 'ka', 'Karnataka', 'Heritage journey'],
  ['nqH-Ud87k-E', 'Travel', 'Wayanad', 'kl', 'Kerala', 'Nature journey'],
  ['O1E1oE0I_Ao', 'Travel', 'Sakleshpur', 'ka', 'Karnataka', 'Road trip'],
  ['OzXD8qmUOeU', 'Travel', 'Kolkata', 'wb', 'West Bengal', 'Culture journey'],
  ['SBLilh08v7o', 'Travel', '', '', '', 'Travel film'],
  ['eoZb1FBwQxY', 'Travel', '', '', '', 'Travel film'],
  ['FVb66KL3i5Q', 'Travel', '', '', '', 'Travel film'],
  ['Oo0TK_7neio', 'Travel', '', '', '', 'Travel film'],
  ['QfkdSQj8db8', 'Travel', '', '', '', 'Travel film'],
  ['wYReorgavaA', 'Travel', '', '', '', 'Travel film'],
  ['aj0Sg7dTOQ8', 'Travel', '', '', '', 'Travel film'],
  ['oSgkZDx1PZU', 'Travel', '', '', '', 'Travel film'],
  ['ocJUOt6TqyI', 'Travel', '', '', '', 'Travel film'],
  ['bAKtdR7maXA', 'Travel', '', '', '', 'Travel film'],
  ['nElw9hi4qf8', 'Travel', '', '', '', 'Travel film'],
  ['BlwO3yaBR-s', 'Travel', '', '', '', 'Travel film'],
  ['JKVAuyYkN_I', 'Travel', '', '', '', 'Travel film'],
  ['FoOfEOlGoUI', 'Travel', '', '', '', 'Travel film'],
  ['E4YsUZ8DYqg', 'Travel', '', '', '', 'Travel film'],
  ['DkPh89dK7WQ', 'Travel', '', '', '', 'Travel film'],
  ['I894LVpkTF8', 'Travel', '', '', '', 'Travel film'],
  ['mGsFkHFann0', 'Travel', '', '', '', 'Travel film'],
  ['e2FGMUJ-TYc', 'Travel', '', '', '', 'Travel film'],
  ['4tmHjZxzG2c', 'Travel', '', '', '', 'Travel film'],
  ['MAe2IZiFQcs', 'Travel', '', '', '', 'Travel film'],
  ['4tisBGcRsI0', 'Travel', '', '', '', 'Travel film'],
  ['0DaQTG4fPWQ', 'Travel', '', '', '', 'Travel film'],
  ['7CWQ89jMjEM', 'Travel', '', '', '', 'Travel film'],
];

const videos = videoRows.map(([id, category, destination, stateId, stateName, label]) => ({
  id,
  url: `https://youtu.be/${id}`,
  title: defaultTitle,
  category,
  destination,
  stateId,
  stateName,
  label,
  description: destination ? `A verified Explore with Me journey connected to ${destination}.` : 'A real Explore with Me video from the channel archive.',
}));

export const siteContent = {
  name: 'Explore with Me',
  featuredVideoId: 'nqH-Ud87k-E',
  socials: {
    youtube: 'https://youtube.com/@its.explorewithme',
    instagram: 'https://www.instagram.com/explore_with_me_vlogs',
  },
  get social() {
    return this.socials;
  },
  categories: ['All', 'Travel', 'Food', 'Guides', 'Hidden Gems'],
  videos,
  journeys: videos
    .filter((video) => video.destination && video.stateId)
    .map((video) => ({
      destination: video.destination,
      stateId: video.stateId,
      stateName: video.stateName,
      videoId: video.id,
      label: video.label,
      description: video.description,
    })),
  mapStates: {
    ka: {
      name: 'Karnataka',
      note: 'Verified journeys include Bengaluru, Chikkamagaluru, Kolar Gold Fields, and Sakleshpur.',
    },
    tn: {
      name: 'Tamil Nadu',
      note: 'Verified journey connected: Yelagiri.',
    },
    kl: {
      name: 'Kerala',
      note: 'Verified journey connected: Wayanad.',
    },
    wb: {
      name: 'West Bengal',
      note: 'Verified journey connected: Kolkata.',
    },
  },
};
