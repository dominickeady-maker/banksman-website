// Copy for the /for-<trade>/ landing pages. Each trade has its own words: don't copy one page's
// text into another with the trade name swapped. Feature names and "Coming soon" badges come from
// src/data/features.ts.
import type { FeatureId } from './features';

export interface Pain {
  /** The problem, in the trade's own words. */
  problem: string;
  detail: string;
  /** How Banksman deals with it. Only describe live features here. */
  fix: string;
  features: FeatureId[];
}

export interface Trade {
  slug: string;
  /** Short name for the footer and breadcrumbs, e.g. "Bricklayers". */
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  /** Short line for the share image. */
  ogTitle: string;
  /** Heading over the three problems. */
  painsHeading: string;
  pains: [Pain, Pain, Pain];
  /** Live features worth a mention beyond the three fixes. */
  alsoUseful: FeatureId[];
  /** Features on the way that matter to this trade. Shown with a "Coming soon" badge. */
  onTheWay: FeatureId[];
  /** One closing line above the call to action. */
  ctaHeading: string;
  /** Optional link to one of the free tools. */
  tool?: { href: string; text: string };
}

export const TRADES: Trade[] = [
  {
    slug: 'builders',
    name: 'Builders',
    title: 'Site management app for small builders | Banksman',
    description: 'Banksman helps small UK builders run several sites from one phone: tasks with photo proof, timesheets, material requests and drawings, in one app.',
    eyebrow: 'For builders',
    h1: 'Three sites on the go and you’re the only one who knows what’s happening on all of them.',
    lede: 'Most small building firms run on the gaffer’s memory, a pile of texts and a diary in the van. It works until you’re off for a day. Banksman puts the jobs, the hours and the orders where the whole firm can see them.',
    ogTitle: 'Run every site without ringing round',
    painsHeading: 'Where a small firm’s week goes.',
    pains: [
      {
        problem: 'You spend the morning ringing round to find out what got done.',
        detail: 'One lad says the footings are poured, another says they’re waiting on the pump. You only find out who’s right when you drive over.',
        fix: 'Set the tasks for each site from your phone. The lads tick them off and add a photo, so you can see the job moving without leaving the one you’re stood on.',
        features: ['tasks', 'photos'],
      },
      {
        problem: 'Friday’s hours turn into Monday’s argument.',
        detail: 'Hours written on a scrap of paper, texted late, or just remembered. Then someone’s short and it’s your word against theirs.',
        fix: 'Everyone logs their hours against the site on the day. You approve them, or query them with a reason and they fix it. It’s grouped by week ending, and the CSV goes straight to whoever does your wages.',
        features: ['timesheets'],
      },
      {
        problem: 'Orders get placed by text and lost somewhere between the merchant and the site.',
        detail: 'Nobody’s sure if the lintels were ordered, who ordered them, or when they’re turning up.',
        fix: 'The lads request what they need on the app with a needed-by date. You approve it and add the supplier and order ref, and everyone can see it go from ordered to delivered, with a photo of the drop.',
        features: ['materials'],
      },
    ],
    alsoUseful: ['drawings', 'messages', 'whitelabel', 'pwa'],
    onTheWay: ['labourCost', 'signIn', 'hsDocs'],
    ctaHeading: 'Run the firm, not the phone.',
  },
  {
    slug: 'bricklayers',
    name: 'Bricklayers',
    title: 'App for bricklayers: price work, drawings and orders | Banksman',
    description: 'Built by a bricklayer. Log price work by plot, keep drawings on every phone, and request bricks and blocks before the gang runs dry.',
    eyebrow: 'For bricklayers',
    h1: 'Price work logged plot by plot, not on the back of a fag packet.',
    lede: 'Banksman was started by a bricklayer who got sick of running his own sites on WhatsApp and a biro. It keeps the gang’s work, the drawings and the orders in one place.',
    ogTitle: 'Price work logged plot by plot',
    painsHeading: 'What stands a gang down.',
    pains: [
      {
        problem: 'Nobody agrees who laid what on which plot.',
        detail: 'Three gangs on one site, a rate per thousand, and a measure-up done from memory. Someone always ends up short.',
        fix: 'Log price work against the site and plot as you go. The manager approves it or queries it with a reason, and the lad sorts it and resubmits. No more settling it in the car park.',
        features: ['timesheets'],
      },
      {
        problem: 'Setting out from a drawing that’s already been changed.',
        detail: 'The architect moved a window. The drawing on the scaffold didn’t get the memo, and now there’s a course of facings to take down.',
        fix: 'Drawings go on every phone, sorted by site and labelled by version, so the gang can check which one they’re working from before the first course goes down.',
        features: ['drawings'],
      },
      {
        problem: 'The gang stands about because the blocks didn’t come.',
        detail: 'Someone said they’d order more ties and a few packs of blocks. They didn’t, or they did and it went to the wrong site.',
        fix: 'Ask for the bricks, blocks or ties on the app with the quantity and a needed-by date. You can see when it’s approved, ordered and on the wagon.',
        features: ['materials'],
      },
    ],
    alsoUseful: ['tasks', 'photos', 'messages', 'push'],
    onTheWay: ['cisInvoices', 'certExpiry', 'materialUrgency'],
    ctaHeading: 'Get the gang on it.',
    tool: { href: '/tools/day-rate-calculator/', text: 'Working out a day rate? Try the free day rate calculator.' },
  },
  {
    slug: 'groundworkers',
    name: 'Groundworkers',
    title: 'Groundworks app: photo records, daywork and deliveries | Banksman',
    description: 'For groundworkers: photo records of drainage and ducts before they’re backfilled, daywork logged on site, and deliveries tracked to the drop.',
    eyebrow: 'For groundworkers',
    h1: 'Prove what’s in the ground before it’s backfilled.',
    lede: 'Once the trench is filled in, nobody can see what you did down there. Banksman keeps a photo record of the work, the daywork for the extras, and the muck-and-stone orders that keep a groundworks job moving.',
    ogTitle: 'Prove what’s in the ground',
    painsHeading: 'What gets buried with the trench.',
    pains: [
      {
        problem: 'Six months on, someone asks how the drain was bedded.',
        detail: 'The photos are on a phone that’s since been dropped in a trench, or buried in a group chat between a load of thumbs-ups.',
        fix: 'Photos go into the site’s library, stamped with the upload time from our server, the site, the task and who took them. You can add location too, if the company switches it on.',
        features: ['photos', 'tasks'],
      },
      {
        problem: 'Daywork for the extras never gets signed for.',
        detail: 'Digging out a soft spot or breaking out an old footing is exactly the work that gets argued over, and the sheet’s gone soggy in the cab.',
        fix: 'Log the daywork hours against the site on the day. The manager approves it or queries it with a reason, and you can export it as a CSV when it’s time to put the bill in.',
        features: ['timesheets'],
      },
      {
        problem: 'The concrete turns up before the shuttering’s ready, and the stone doesn’t turn up at all.',
        detail: 'Deliveries booked by phone, changed by text, and remembered by nobody.',
        fix: 'Every request shows the supplier, the order ref and the expected delivery. When it lands, the lad takes a photo of the drop, so there’s no argument about what came.',
        features: ['materials'],
      },
    ],
    alsoUseful: ['messages', 'drawings', 'push', 'pwa'],
    onTheWay: ['plantChecks', 'offline', 'certExpiry'],
    ctaHeading: 'Keep a record before it’s covered up.',
  },
  {
    slug: 'roofers',
    name: 'Roofers',
    title: 'App for roofers: photo proof, hours and tile orders | Banksman',
    description: 'For roofers: show the work nobody can see from the ground with photo proof, log hours around the weather, and track every tile and slate order.',
    eyebrow: 'For roofers',
    h1: 'Show the client the work they can’t see from the ground.',
    lede: 'Felt, battens, leadwork and fixings are all out of sight once the tiles are on. Banksman gives you a photo record of every stage, hours that make sense on a wet week, and orders you can track.',
    ogTitle: 'Show the work they can’t see',
    painsHeading: 'What gets lost up top.',
    pains: [
      {
        problem: '“Did you actually replace the felt?”',
        detail: 'The customer or the main contractor can’t get up there, so they’ve only got your word for it.',
        fix: 'Set each stage as a task. The lad ticks it off with a photo before the next layer goes on, so you’ve got proof of every stage, kept against the job.',
        features: ['tasks', 'photos'],
      },
      {
        problem: 'Rain stops play and the hours go to pot.',
        detail: 'Half days, rained-off mornings and a quick run to another job. By Friday nobody remembers who was where.',
        fix: 'Hours are logged per site on the day. If something doesn’t look right, query it with a reason. The lad fixes it and resubmits, so the week adds up before it goes to wages.',
        features: ['timesheets'],
      },
      {
        problem: 'Short on tiles, wrong colour ridge, or delivered to the wrong address.',
        detail: 'One short pallet can stand a gang down for a day.',
        fix: 'Request the tiles, slates or lead with the quantity, unit and needed-by date. The office approves, orders and adds the expected delivery, and the delivery photo shows what actually turned up.',
        features: ['materials'],
      },
    ],
    alsoUseful: ['drawings', 'messages', 'push', 'whitelabel'],
    onTheWay: ['hsDocs', 'accidents', 'signIn'],
    ctaHeading: 'Get it on record, not just on the roof.',
  },
  {
    slug: 'electricians',
    name: 'Electricians',
    title: 'App for electricians: first fix photos and layouts | Banksman',
    description: 'For electrical contractors: photo records of first fix before the boards go up, layout drawings on every phone, and tasks across every job.',
    eyebrow: 'For electricians',
    h1: 'First fix, second fix, and a photo of both before the boards go up.',
    lede: 'Once the plasterer’s been, your cable runs are gone for good. Banksman keeps a record of what went where, puts the layouts on every phone, and shows you which jobs are ready for second fix.',
    ogTitle: 'A record of first fix before it’s boarded',
    painsHeading: 'What disappears behind the plasterboard.',
    pains: [
      {
        problem: 'Nobody can say where the cable runs once the walls are boarded.',
        detail: 'A kitchen fitter puts a screw through a cable and it’s your firm they ring.',
        fix: 'Photograph the first fix before it’s covered. Each photo is stamped with the upload time from our server, the site, the task and who took it, so you can find it again when you need it.',
        features: ['photos'],
      },
      {
        problem: 'Sockets put in where the old layout said.',
        detail: 'The client changed the kitchen. The drawing in the van is the old one.',
        fix: 'The layouts go on every phone, sorted by site and labelled by version, so the lads can check they’re working off the right one.',
        features: ['drawings'],
      },
      {
        problem: 'You don’t know which jobs are ready for second fix.',
        detail: 'Lads spread across four houses, and the only way to find out is to ring each of them.',
        fix: 'Set first fix and second fix as tasks for each site. When they’re ticked off with a photo, you can see where every job is up to from one screen.',
        features: ['tasks', 'push'],
      },
    ],
    alsoUseful: ['timesheets', 'materials', 'messages', 'tour'],
    onTheWay: ['certExpiry', 'hsDocs', 'labourCost'],
    ctaHeading: 'Know where every job’s up to.',
  },
  {
    slug: 'plumbers',
    name: 'Plumbers',
    title: 'App for plumbers and heating engineers | Banksman',
    description: 'For plumbing and heating firms: request fittings before the merchant run, photograph pipework before it’s boxed in, and keep job chat in one place.',
    eyebrow: 'For plumbers',
    h1: 'Stop losing half a day to the merchant for one fitting.',
    lede: 'Plumbing jobs stall on the little things: a fitting nobody ordered, a pipe run nobody photographed, a message lost in a chat with the builder. Banksman keeps the orders, photos and messages for each job together.',
    ogTitle: 'Fewer merchant runs, better records',
    painsHeading: 'What stalls a plumbing job.',
    pains: [
      {
        problem: 'The van’s short and nobody said.',
        detail: 'The lad finds out he’s missing a fitting at ten in the morning, and that’s the next hour gone.',
        fix: 'Lads request what they need with the quantity and a needed-by date, before they need it. The office approves and orders, and adds the order ref and expected delivery.',
        features: ['materials'],
      },
      {
        problem: 'Pipework boxed in with no record of where it runs.',
        detail: 'A leak behind the boxing a year later, and nobody can say where the joints are.',
        fix: 'Take photos before it’s covered. They’re stamped with the upload time, site, task and who took them, and kept in the site’s photo library.',
        features: ['photos', 'tasks'],
      },
      {
        problem: 'Job talk spread across five chats.',
        detail: 'One with the builder, one with the client, one with the lads and a couple you’ve muted.',
        fix: 'Each site gets its own group chat, and there are direct messages for one-to-one. It all stays with the job, not mixed in with your family chats.',
        features: ['messages', 'push'],
      },
    ],
    alsoUseful: ['timesheets', 'drawings', 'pwa', 'whitelabel'],
    onTheWay: ['offline', 'materialUrgency', 'labourCost'],
    ctaHeading: 'Keep every job in one place.',
  },
  {
    slug: 'subcontractors',
    name: 'Subcontractors',
    title: 'App for construction subcontractors | Banksman',
    description: 'For subcontractors working for main contractors: photo proof for every application, hours per site, and an app that carries your own branding.',
    eyebrow: 'For subcontractors',
    h1: 'Look organised to the main contractor, and have the proof when they query it.',
    lede: 'When you’re the sub, the main contractor holds the money. Banksman helps you keep records of what your lads did, when and where, so you’re not relying on memory when an application gets queried.',
    ogTitle: 'Have the proof when they query it',
    painsHeading: 'Where subbies lose money.',
    pains: [
      {
        problem: 'Your application gets queried and you can’t prove what was done when.',
        detail: 'The QS wants evidence. You’ve got a few photos on three different phones and no dates you’d trust.',
        fix: 'Tasks are ticked off with photos, and every photo is stamped with the upload time from our server, the site, the task and who took it. So the evidence for each site is in one place.',
        features: ['tasks', 'photos'],
      },
      {
        problem: 'Lads on four sites for three different main contractors.',
        detail: 'Hours come in by text, and working out what to charge each job takes your Sunday.',
        fix: 'Hours or price work are logged per site and grouped by week ending. Approve them, export the CSV, and archive them once they’re paid.',
        features: ['timesheets'],
      },
      {
        problem: 'You look like a one-man band next to the bigger firms.',
        detail: 'Main contractors notice who turns up with their paperwork sorted.',
        fix: 'Banksman can carry your company’s logo and colours, and installs on the phone like an app. A guided tour gets new lads going without you sitting with them.',
        features: ['whitelabel', 'pwa', 'tour'],
      },
    ],
    alsoUseful: ['messages', 'drawings', 'materials', 'push'],
    onTheWay: ['cisInvoices', 'certExpiry', 'hsDocs'],
    ctaHeading: 'Have the records before you need them.',
    tool: { href: '/tools/cis-calculator/', text: 'Checking what you’ll be paid after CIS? Try the free CIS calculator.' },
  },
];
