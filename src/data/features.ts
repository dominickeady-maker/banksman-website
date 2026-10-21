// Every feature the landing, tools and compare pages mention, in one place.
// When a feature ships, change its status to 'live' and every "Coming soon" badge for it disappears.
// Only add a feature here once it exists in the app or is genuinely on the way.

export type FeatureStatus = 'live' | 'coming-soon';

export interface Feature {
  name: string;
  /** One plain sentence: what it does in the app. */
  summary: string;
  status: FeatureStatus;
}

export const FEATURES = {
  tasks: {
    name: 'Tasks with photo proof',
    summary: 'The manager sets the task for each site. The worker ticks it off and adds the photo to prove it.',
    status: 'live',
  },
  messages: {
    name: 'Site group chats and direct messages',
    summary: 'A group chat for every site, plus direct messages, kept apart from your personal phone chats.',
    status: 'live',
  },
  drawings: {
    name: 'Drawings for every site',
    summary: 'Drawings on every phone, labelled by version, sorted by site and downloadable on site.',
    status: 'live',
  },
  photos: {
    name: 'Photo library',
    summary: 'Every photo is stamped with the upload time from our server, the site, the task and who took it. Location is optional, set by the company.',
    status: 'live',
  },
  timesheets: {
    name: 'Timesheets',
    summary: 'Daywork hours or price work per site or plot. The manager approves or queries with a reason, the worker fixes and resubmits. Grouped by week ending, CSV export, archived when paid.',
    status: 'live',
  },
  materials: {
    name: 'Material requests',
    summary: 'The worker asks for the item, quantity, unit and needed-by date. Tracked from requested to approved, ordered, dispatched and delivered (or declined), with supplier, order ref, expected delivery and a delivery photo.',
    status: 'live',
  },
  push: {
    name: 'Push notifications',
    summary: 'Notifications go straight to the phone, so updates don’t sit unread.',
    status: 'live',
  },
  pwa: {
    name: 'Installs like an app',
    summary: 'Add it to the home screen and it opens like any other app. No app store needed.',
    status: 'live',
  },
  whitelabel: {
    name: 'Your logo and colours',
    summary: 'The app can wear your company’s logo and colours, so the lads see your name, not ours.',
    status: 'live',
  },
  tour: {
    name: 'Guided tour',
    summary: 'A guided tour walks new users round the app the first time they log in.',
    status: 'live',
  },

  hsDocs: {
    name: 'Health and safety documents with sign-off',
    summary: 'Inductions, RAMS and safety procedures on every phone. Each worker reads and signs with their finger, a new revision asks everyone to sign again, and you see who has signed what.',
    status: 'live',
  },
  signIn: {
    name: 'Site sign-in and sign-out',
    summary: 'Sign in and out with a QR poster on site, with an optional location check at that moment only, and a fire roll call of who’s on site right now.',
    status: 'live',
  },
  accidents: {
    name: 'Accident and near-miss reports',
    summary: 'Report an accident or near miss from the phone, with stamped photos, while it’s fresh. Only the person who reported it and the managers can see it.',
    status: 'live',
  },
  labourCost: {
    name: 'Labour cost per job',
    summary: 'Approved hours times each worker’s rate, so you can see what a job is costing in labour.',
    status: 'coming-soon',
  },
  cisInvoices: {
    name: 'CIS worker invoices',
    summary: 'Invoices for CIS workers built from their approved timesheets.',
    status: 'coming-soon',
  },
  certExpiry: {
    name: 'Card and certificate expiry tracking',
    summary: 'Keep track of CSCS, CPCS and other cards, and see what’s about to run out.',
    status: 'coming-soon',
  },
  plantChecks: {
    name: 'Plant pre-start checks',
    summary: 'Daily pre-start checks for plant, done on the phone before the key goes in.',
    status: 'coming-soon',
  },
  offline: {
    name: 'Offline mode',
    summary: 'Saves your work when there’s no signal and syncs when you’re back in range.',
    status: 'coming-soon',
  },
  materialUrgency: {
    name: 'Urgency on material requests',
    summary: 'Mark a material request as urgent so the office knows what to chase first.',
    status: 'coming-soon',
  },
} satisfies Record<string, Feature>;

export type FeatureId = keyof typeof FEATURES;

export const feature = (id: FeatureId): Feature => FEATURES[id];
export const isLive = (id: FeatureId) => FEATURES[id].status === 'live';
