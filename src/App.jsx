// ═══════════════════════════════════════════════════════════════════
//  Ensemble CRM  ·  App.jsx                          v5.1
//  Ensemble Digital Labs  ·  ensembledigilabs.com
//
//  Modules: Login · User Admin · Leads · Accounts · Contacts
//           Opportunities · Contracts & Proposals · Activities
//           Import / Export
//
//  Pre-loaded: 15 Accounts + 20 Contacts (incl. Customers.xls import)
//  Login credentials display removed from login screen.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef, useMemo } from 'react';


/* ═══ CONSTANTS ═══ */
const INDUSTRIES=["Healthcare","Technology","Agriculture","Manufacturing","Logistics","Professional Services","Dental","Chiropractic","Retail","Finance","Other"];
const ACCT_TYPES=["Client","Prospect","Partner","Vendor"];
const ACCT_STATUS=["Active","At Risk","Inactive","Churned"];
const OPP_STAGES=["Prospecting","Qualification","Needs Analysis","Proposal","Negotiation","Closed Won","Closed Lost"];
const ACT_TYPES=["Call","Email","Meeting","Proposal","Follow-up","Demo","Note"];
const LEAD_ACT_TYPES=["In Person","Email","Video Conferencing","Phone Call","Follow-up","Demo"];
const LEAD_ACT_META={
  "In Person":{e:"🤝",c:"#10b981",bg:"#ecfdf5"},
  "Email":{e:"✉️",c:"#6366f1",bg:"#eef2ff"},
  "Video Conferencing":{e:"🎥",c:"#8b5cf6",bg:"#f5f3ff"},
  "Phone Call":{e:"📞",c:"#0ea5e9",bg:"#e0f2fe"},
  "Follow-up":{e:"🔔",c:"#f59e0b",bg:"#fef3c7"},
  "Demo":{e:"🖥️",c:"#f97316",bg:"#fff7ed"},
};
const ROLES=["Decision Maker","Champion","Executive Sponsor","Technical Contact","Billing Contact","Influencer","End User"];
const DEPTS=["Executive","Sales","Marketing","IT","Finance","Operations","Clinical","Other"];
const TEAM=["Senthil","Sijesh","Arun","Unassigned"];
const PERIODS=["Monthly","Quarterly","Annually"];

const AT_META={
  Client:{c:"#10b981",bg:"#ecfdf5"},Prospect:{c:"#6366f1",bg:"#eef2ff"},
  Partner:{c:"#f59e0b",bg:"#fef3c7"},Vendor:{c:"#64748b",bg:"#f1f5f9"},
};
const AS_META={
  Active:{c:"#10b981",bg:"#ecfdf5"},"At Risk":{c:"#f97316",bg:"#fff7ed"},
  Inactive:{c:"#64748b",bg:"#f1f5f9"},Churned:{c:"#ef4444",bg:"#fef2f2"},
};
const OS_META={
  Prospecting:{c:"#64748b",bg:"#f1f5f9"},Qualification:{c:"#0ea5e9",bg:"#e0f2fe"},
  "Needs Analysis":{c:"#8b5cf6",bg:"#f5f3ff"},Proposal:{c:"#6366f1",bg:"#eef2ff"},
  Negotiation:{c:"#f97316",bg:"#fff7ed"},"Closed Won":{c:"#10b981",bg:"#ecfdf5"},
  "Closed Lost":{c:"#ef4444",bg:"#fef2f2"},
};
const AM={Call:{e:"📞"},Email:{e:"✉️"},Meeting:{e:"🤝"},Proposal:{e:"📄"},"Follow-up":{e:"🔔"},Demo:{e:"🖥️"},Note:{e:"📝"}};
const CONTRACT_TYPES=["BAA","Signed Contract","NDA","MSA","SOW","LOI","Other"];
const CT_META={
  BAA:{c:"#0ea5e9",bg:"#e0f2fe",icon:"🏥"},
  "Signed Contract":{c:"#10b981",bg:"#ecfdf5",icon:"✅"},
  NDA:{c:"#8b5cf6",bg:"#f5f3ff",icon:"🔒"},
  MSA:{c:"#f59e0b",bg:"#fef3c7",icon:"📋"},
  SOW:{c:"#6366f1",bg:"#eef2ff",icon:"📝"},
  LOI:{c:"#f97316",bg:"#fff7ed",icon:"📨"},
  Other:{c:"#64748b",bg:"#f1f5f9",icon:"📄"},
};

/* ─── Lead Constants ─── */
const LEAD_STATUSES=["New","Contacted","Working","Qualified","Unqualified","Converted"];
const LEAD_SOURCES=["Website","Referral","LinkedIn","Cold Outreach","Event / Conference","Partner","Inbound Call","Trade Show","Email Campaign","Other"];
const LEAD_RATINGS=["Hot","Warm","Cold"];
const LS_META={
  New:{c:"#6366f1",bg:"#eef2ff"},
  Contacted:{c:"#0ea5e9",bg:"#e0f2fe"},
  Working:{c:"#8b5cf6",bg:"#f5f3ff"},
  Qualified:{c:"#10b981",bg:"#ecfdf5"},
  Unqualified:{c:"#64748b",bg:"#f1f5f9"},
  Converted:{c:"#7c3aed",bg:"#ede9fe"},
};
const LR_META={
  Hot:{c:"#ef4444",bg:"#fef2f2"},
  Warm:{c:"#f97316",bg:"#fff7ed"},
  Cold:{c:"#0ea5e9",bg:"#e0f2fe"},
};

/* ─── User / Auth ─── */
const USER_ROLES=["Admin","Manager","Sales Rep","Viewer"];
const USER_STATUSES=["Active","Inactive"];
const ROLE_META={
  Admin:    {c:"#7c3aed",bg:"#ede9fe",icon:"🛡️"},
  Manager:  {c:"#0ea5e9",bg:"#e0f2fe",icon:"📊"},
  "Sales Rep":{c:"#10b981",bg:"#ecfdf5",icon:"💼"},
  Viewer:   {c:"#64748b",bg:"#f1f5f9",icon:"👁️"},
};
/* Default built-in Admin — always present */
const DEFAULT_ADMIN={id:"u0",username:"Admin",password:"Admin",name:"Administrator",email:"admin@ensembledigilabs.com",role:"Admin",status:"Active",createdAt:"2025-01-01",lastLogin:null};

/* ═══ DEMO DATA ═══ */
const D_ACCOUNTS=[
  /* ── Existing Ensemble accounts ── */
  {id:"a1",name:"STL IO|IR Clinics",industry:"Healthcare",type:"Client",status:"Active",website:"stlioir.com",phone:"314-555-0100",address:"St. Louis, MO",assignedTo:"Senthil",createdAt:"2025-10-01",notes:"Interventional oncology & radiology practice. Dr. Vaheesan's clinic. 2 locations. HIPAA compliance + social media marketing."},
  {id:"a2",name:"SoluGrowth",industry:"Professional Services",type:"Prospect",status:"Active",website:"solugrowth.com",phone:"011-555-0200",address:"Johannesburg, SA",assignedTo:"Senthil",createdAt:"2026-01-15",notes:"South African BPO, ex-Deloitte founders. US mid-market entry advisory engagement."},
  {id:"a3",name:"Smart Pain Solutions",industry:"Chiropractic",type:"Client",status:"Active",website:"smartpainsolutions.com",phone:"(314) 298-1400",address:"11901 St Charles Rock Road, Bridgeton, MO 63044",assignedTo:"Arun",createdAt:"2025-09-01",notes:"Chiropractic clinics. 2 locations + 18 regional chiropractors. Facebook ads + Doc Chain PI referral platform."},
  {id:"a4",name:"Bayer Crop Science",industry:"Agriculture",type:"Prospect",status:"Active",website:"bayer.com",phone:"314-555-0400",address:"St. Louis, MO",assignedTo:"Senthil",createdAt:"2026-02-01",notes:"Arrow Program – channel partner IT solution for SeedPros. Salesforce CRM implementation."},
  {id:"a5",name:"Westgate Chiropractic",industry:"Chiropractic",type:"Prospect",status:"Active",website:"westgatechiro.com",phone:"314-555-0500",address:"St. Louis, MO",assignedTo:"Sijesh",createdAt:"2026-03-12",notes:"3 clinic locations. Local SEO engagement in discussion."},
  {id:"a6",name:"MidWest Dental Group",industry:"Dental",type:"Prospect",status:"Active",website:"mwdental.com",phone:"314-555-0600",address:"St. Louis, MO",assignedTo:"Sijesh",createdAt:"2026-04-01",notes:"5-location dental group. New website + patient portal refresh."},
  {id:"a7",name:"Gateway Logistics",industry:"Logistics",type:"Prospect",status:"Active",website:"gwlogistics.com",phone:"636-555-0700",address:"St. Louis, MO",assignedTo:"Arun",createdAt:"2026-04-18",notes:"Met at St. Louis B2B Summit. Email marketing drip campaign."},
  /* ── Imported from Customers.xls ── */
  {id:"a8",name:"Frontenac S.P.I.N.E Center",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"(314) 557-3472",address:"10435 Clayton Road, Suite 120, Saint Louis, MO 63131",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"Spine specialty practice. Contact: Dr. Amit Bhandarkar. Imported from QuickBooks customer list."},
  {id:"a9",name:"Chesterfield Bariatric Surgery",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"(314) 412-4430",address:"10004 Kennerly Road, Suite 295B, Chesterfield, MO 63128",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"Physician Services and Consulting LLC DBA Chesterfield Bariatric Surgery. Open balance: $3,025.47. Contact: Dr. Deepu Sudhakaran."},
  {id:"a10",name:"Agafay Weight Loss LLC",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"(401) 787-8864",address:"",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"Weight loss practice. Open balance: $178.90. Contact: Dr. Penninah Mutave Mutungi. Imported from QuickBooks."},
  {id:"a11",name:"Alliance of Independent Physicians",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"",address:"",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"Independent physician network. Contact: Dr. Robert Hacker. Imported from QuickBooks customer list."},
  {id:"a12",name:"Midwest Hand and Wrist Surgery LLC",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"(859) 699-8768",address:"",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"Hand and wrist surgery specialty practice. Contact: Dr. Vikas Dhawan. Imported from QuickBooks."},
  {id:"a13",name:"ThinkHealth Integrative Psychiatry",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"(315) 395-0572",address:"",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"ThinkHealth Integrative Psychiatry, PLLC. Open balance: $400. Contact: Priyanka Patil. Imported from QuickBooks."},
  {id:"a14",name:"Local Providers Midwest LLC",industry:"Healthcare",type:"Client",status:"Active",website:"",phone:"",address:"11901 St Charles Rock Road, Bridgeton, MO 63044",assignedTo:"Arun",createdAt:"2026-04-28",notes:"Local physician network group. Contact: Robert Bo Andel. Bridgeton, MO. Imported from QuickBooks."},
  {id:"a15",name:"STL IOIR Associates LLC",industry:"Healthcare",type:"Client",status:"Active",website:"stl-ioir.com",phone:"(305) 310-4583",address:"",assignedTo:"Senthil",createdAt:"2026-04-28",notes:"STL IOIR Associates, LLC. Open balance: $7,778. Contact: Kirubahara Vaheesan. Imported from QuickBooks."},
];
const D_CONTACTS=[
  /* ── Existing Ensemble contacts ── */
  {id:"c1",accountId:"a1",name:"Hosea Bartlett",title:"Director of Marketing",dept:"Marketing",role:"Decision Maker",phone:"314-555-0101",email:"hosea@stlioir.com",primary:true,createdAt:"2025-10-05"},
  {id:"c2",accountId:"a1",name:"Dr. Kirubahara Vaheesan",title:"Medical Director",dept:"Clinical",role:"Executive Sponsor",phone:"314-555-0102",email:"kvaheesan@stlioir.com",primary:false,createdAt:"2025-10-05"},
  {id:"c3",accountId:"a1",name:"Donna Reyes",title:"Practice Administrator",dept:"Operations",role:"Billing Contact",phone:"314-555-0103",email:"donna@stlioir.com",primary:false,createdAt:"2025-10-10"},
  {id:"c4",accountId:"a2",name:"Zandile Myeni",title:"CEO",dept:"Executive",role:"Decision Maker",phone:"011-555-0201",email:"zandile@solugrowth.com",primary:true,createdAt:"2026-01-20"},
  {id:"c5",accountId:"a2",name:"Nelmari Carter-Johnson",title:"Head of Strategy",dept:"Sales",role:"Champion",phone:"011-555-0202",email:"nelmari@solugrowth.com",primary:false,createdAt:"2026-01-20"},
  {id:"c6",accountId:"a3",name:"Dr. Bo Andel",title:"Clinic Owner",dept:"Clinical",role:"Decision Maker",phone:"(314) 479-2579",email:"drbo@smartpainsolutions.com",primary:true,createdAt:"2025-09-05"},
  {id:"c7",accountId:"a4",name:"Sintu Pal",title:"Program Director",dept:"IT",role:"Champion",phone:"314-555-0401",email:"sintu@bayer.com",primary:true,createdAt:"2026-02-05"},
  {id:"c8",accountId:"a4",name:"Sujeeth Kumar Verma",title:"Solutions Architect",dept:"IT",role:"Technical Contact",phone:"314-555-0402",email:"sujeeth@bayer.com",primary:false,createdAt:"2026-02-05"},
  {id:"c9",accountId:"a4",name:"Harish Ojha",title:"IT Manager",dept:"IT",role:"Influencer",phone:"314-555-0403",email:"harish@bayer.com",primary:false,createdAt:"2026-02-10"},
  {id:"c10",accountId:"a5",name:"Dr. Melissa Tran",title:"Clinic Owner",dept:"Clinical",role:"Decision Maker",phone:"314-555-0501",email:"mtran@westgatechiro.com",primary:true,createdAt:"2026-03-14"},
  {id:"c11",accountId:"a6",name:"Tom Haines",title:"COO",dept:"Operations",role:"Decision Maker",phone:"314-555-0601",email:"tom@mwdental.com",primary:true,createdAt:"2026-04-03"},
  {id:"c12",accountId:"a7",name:"Angela Kim",title:"Marketing Manager",dept:"Marketing",role:"Decision Maker",phone:"636-555-0701",email:"angela@gwlogistics.com",primary:true,createdAt:"2026-04-18"},
  /* ── Imported from Customers.xls ── */
  {id:"c13",accountId:"a8",name:"Dr. Amit Bhandarkar",title:"Physician / Owner",dept:"Clinical",role:"Decision Maker",phone:"(314) 557-3472",email:"dr.amit@onlinespinecare.com",primary:true,createdAt:"2026-04-28"},
  {id:"c14",accountId:"a9",name:"Dr. Deepu Sudhakaran",title:"Physician / Owner",dept:"Clinical",role:"Decision Maker",phone:"(314) 412-4430",email:"physicianscllc@gmail.com",primary:true,createdAt:"2026-04-28"},
  {id:"c15",accountId:"a10",name:"Dr. Penninah Mutave Mutungi",title:"Physician / Owner",dept:"Clinical",role:"Decision Maker",phone:"(401) 787-8864",email:"mutave@gmail.com",primary:true,createdAt:"2026-04-28"},
  {id:"c16",accountId:"a11",name:"Dr. Robert Hacker",title:"Physician",dept:"Clinical",role:"Decision Maker",phone:"",email:"Roberthackermd@gmail.com",primary:true,createdAt:"2026-04-28"},
  {id:"c17",accountId:"a12",name:"Dr. Vikas Dhawan",title:"Surgeon / Owner",dept:"Clinical",role:"Decision Maker",phone:"(859) 699-8768",email:"dr_vikasdhawan@yahoo.com",primary:true,createdAt:"2026-04-28"},
  {id:"c18",accountId:"a13",name:"Priyanka Patil",title:"Psychiatrist / Owner",dept:"Clinical",role:"Decision Maker",phone:"(315) 395-0572",email:"priyankasmarawar@gmail.com",primary:true,createdAt:"2026-04-28"},
  {id:"c19",accountId:"a14",name:"Robert Bo Andel",title:"Principal",dept:"Executive",role:"Decision Maker",phone:"",email:"drbo@smartpainsolutions.com",primary:true,createdAt:"2026-04-28"},
  {id:"c20",accountId:"a15",name:"Kirubahara Vaheesan",title:"Managing Director",dept:"Executive",role:"Decision Maker",phone:"(305) 310-4583",email:"kirubahara.vaheesan@stl-ioir.com",primary:true,createdAt:"2026-04-28"},
];
const D_OPPS=[
  {id:"o1",accountId:"a1",name:"Social Media Retainer – UFE Campaign",stage:"Closed Won",oneTime:2500,recurring:4500,recurringPeriod:"Monthly",startDate:"2026-02-01",endDate:"2026-12-31",probability:100,notes:"Facebook & LinkedIn. 18-creative calendar."},
  {id:"o2",accountId:"a1",name:"HIPAA Compliance Package",stage:"Closed Won",oneTime:3200,recurring:0,recurringPeriod:"Monthly",startDate:"2026-01-15",endDate:"2026-03-31",probability:100,notes:"BAA, Privacy Policy, IT Policy documentation."},
  {id:"o3",accountId:"a1",name:"Tumor BAE Campaign",stage:"Closed Won",oneTime:1800,recurring:0,recurringPeriod:"",startDate:"2026-03-01",endDate:"2026-06-30",probability:100,notes:"One-time production + paid spend setup."},
  {id:"o4",accountId:"a2",name:"Foundation Sprint – Brand & ICP",stage:"Proposal",oneTime:8500,recurring:0,recurringPeriod:"",startDate:"2026-05-01",endDate:"2026-06-30",probability:60,notes:"Positioning, ICP, sales collateral, Zoho CRM."},
  {id:"o5",accountId:"a2",name:"Growth Retainer – ABM + Content",stage:"Negotiation",oneTime:0,recurring:2500,recurringPeriod:"Monthly",startDate:"2026-07-01",endDate:"2027-06-30",probability:50,notes:"Monthly advisory + ABM activation post sprint."},
  {id:"o6",accountId:"a3",name:"Facebook Ads Management",stage:"Closed Won",oneTime:500,recurring:1500,recurringPeriod:"Monthly",startDate:"2026-01-15",endDate:"2026-12-31",probability:100,notes:"I-70 corridor DOT Physical geo targeting."},
  {id:"o7",accountId:"a3",name:"Doc Chain Platform Build",stage:"Closed Won",oneTime:9850,recurring:0,recurringPeriod:"",startDate:"2026-01-01",endDate:"2026-04-30",probability:100,notes:"PI referral SaaS. Fixed fee. 40/30/30 milestones."},
  {id:"o8",accountId:"a4",name:"Arrow Program – Salesforce Implementation",stage:"Negotiation",oneTime:35000,recurring:0,recurringPeriod:"",startDate:"2026-05-01",endDate:"2026-11-30",probability:55,notes:"CRM build for SeedPros channel partners."},
  {id:"o9",accountId:"a4",name:"Post-Launch Salesforce Support",stage:"Prospecting",oneTime:0,recurring:5000,recurringPeriod:"Monthly",startDate:"2026-12-01",endDate:"2027-11-30",probability:30,notes:"Ongoing enhancement sprints post go-live."},
  {id:"o10",accountId:"a5",name:"Local SEO – 3 Locations",stage:"Proposal",oneTime:1200,recurring:800,recurringPeriod:"Monthly",startDate:"2026-05-01",endDate:"2027-04-30",probability:65,notes:"GMB optimization, citation building, local pack."},
  {id:"o11",accountId:"a6",name:"Website Redesign + Patient Portal",stage:"Qualification",oneTime:6500,recurring:350,recurringPeriod:"Monthly",startDate:"2026-06-01",endDate:"2026-10-31",probability:40,notes:"5-location group. New site + maintenance retainer."},
  {id:"o12",accountId:"a7",name:"Email Drip Campaign Setup",stage:"Prospecting",oneTime:2400,recurring:0,recurringPeriod:"",startDate:"2026-06-01",endDate:"2026-08-31",probability:25,notes:"B2B Summit lead. Drip automation + copywriting."},
];
const D_ACTS=[
  {id:"ac1",accountId:"a1",type:"Meeting",description:"Kickoff – reviewed 18-creative pre-launch campaign plan with Hosea and Donna.",date:"2026-01-18",createdAt:"2026-01-18"},
  {id:"ac2",accountId:"a1",type:"Email",description:"Sent BAA and Privacy Policy documentation for HIPAA compliance review.",date:"2026-01-22",createdAt:"2026-01-22"},
  {id:"ac3",accountId:"a2",type:"Call",description:"Discovery call with Zandile and Nelmari. ICP development confirmed as priority.",date:"2026-02-15",createdAt:"2026-02-15"},
  {id:"ac4",accountId:"a2",type:"Proposal",description:"Sent revised proposal: Foundation Sprint $8,500 + $2,500/mo retainer.",date:"2026-03-20",createdAt:"2026-03-20"},
  {id:"ac5",accountId:"a4",type:"Meeting",description:"Kick-off with Sintu. RACI and 12-week Arrow Program roadmap reviewed.",date:"2026-03-05",createdAt:"2026-03-05"},
  {id:"ac6",accountId:"a4",type:"Follow-up",description:"Following up on SOW signatures and Salesforce org access provisioning.",date:"2026-04-10",createdAt:"2026-04-10"},
  {id:"ac7",accountId:"a3",type:"Meeting",description:"Doc Chain platform walkthrough with Dr. Bo. Milestone 1 delivered.",date:"2026-02-01",createdAt:"2026-02-01"},
  {id:"ac8",accountId:"a5",type:"Call",description:"Discovery call. 3 locations confirmed. Local search keyword strategy discussed.",date:"2026-03-14",createdAt:"2026-03-14"},
];
const D_CONTRACTS=[
  {id:"ct1",accountId:"a1",name:"HIPAA BAA – STL IO|IR",type:"BAA",startDate:"2026-01-15",endDate:"2027-01-14",value:"",status:"Active",notes:"Business Associate Agreement covering PHI handling for all marketing data.",fileName:"BAA_STL_IOIR_2026.pdf",fileSize:420000,fileData:null,createdAt:"2026-01-15"},
  {id:"ct2",accountId:"a1",name:"Social Media Services Agreement",type:"Signed Contract",startDate:"2026-02-01",endDate:"2026-12-31",value:"54000",status:"Active",notes:"12-month retainer for UFE and Tumor BAE campaigns. $4,500/mo.",fileName:"ServiceAgreement_STLIOIR_2026.pdf",fileSize:685000,fileData:null,createdAt:"2026-02-01"},
  {id:"ct3",accountId:"a3",name:"Doc Chain Platform SOW",type:"SOW",startDate:"2026-01-01",endDate:"2026-04-30",value:"9850",status:"Active",notes:"Fixed-fee build. 40/30/30 milestone payments. GCP/React/Node.js.",fileName:"DocChain_SOW_v2.pdf",fileSize:310000,fileData:null,createdAt:"2026-01-01"},
  {id:"ct4",accountId:"a3",name:"Smart Pain BAA",type:"BAA",startDate:"2025-09-01",endDate:"2026-08-31",value:"",status:"Active",notes:"BAA for chiropractic clinic Facebook ads — patient data handling.",fileName:"BAA_SmartPain_2025.pdf",fileSize:195000,fileData:null,createdAt:"2025-09-01"},
  {id:"ct5",accountId:"a2",name:"SoluGrowth NDA",type:"NDA",startDate:"2026-01-20",endDate:"2027-01-19",value:"",status:"Active",notes:"Mutual NDA covering US market entry strategy and competitive positioning data.",fileName:"NDA_SoluGrowth_2026.pdf",fileSize:145000,fileData:null,createdAt:"2026-01-20"},
];
const D_LEADS=[
  {id:"l1",firstName:"Sarah",lastName:"Chen",company:"Arch Radiology Partners",title:"Medical Director",email:"schen@archradiology.com",phone:"314-555-1001",source:"Referral",industry:"Healthcare",status:"Qualified",rating:"Hot",assignedTo:"Senthil",createdAt:"2026-04-10",notes:"Referred by Dr. Vaheesan. 3-location radiology group. Budget ~$5K/mo. Interested in social media + web redesign.",isConverted:false,convertedAccountId:null,convertedContactId:null,convertedAt:null},
  {id:"l2",firstName:"Marcus",lastName:"Webb",company:"Heartland Physical Therapy",title:"Practice Owner",email:"mwebb@heartlandpt.com",phone:"636-555-1002",source:"LinkedIn",industry:"Healthcare",status:"Working",rating:"Warm",assignedTo:"Arun",createdAt:"2026-04-14",notes:"Responded to LinkedIn outreach. 2 PT clinics. Wants to compete on Google local. Follow-up call scheduled.",isConverted:false,convertedAccountId:null,convertedContactId:null,convertedAt:null},
  {id:"l3",firstName:"Priya",lastName:"Nair",company:"Cardinal Health Analytics",title:"VP of Marketing",email:"pnair@cardinalha.com",phone:"314-555-1003",source:"Event / Conference",industry:"Technology",status:"Contacted",rating:"Warm",assignedTo:"Senthil",createdAt:"2026-04-17",notes:"Met at Salesforce World Tour Chicago. Healthcare data analytics startup. CRM implementation + ABM strategy.",isConverted:false,convertedAccountId:null,convertedContactId:null,convertedAt:null},
  {id:"l4",firstName:"James",lastName:"Kowalski",company:"Ozark Orthopedic",title:"CEO",email:"jkowalski@ozarkortho.com",phone:"417-555-1004",source:"Website",industry:"Healthcare",status:"New",rating:"Cold",assignedTo:"Sijesh",createdAt:"2026-04-21",notes:"Filled out contact form. Single-location orthopedic practice in Springfield, MO. Interested in SEO.",isConverted:false,convertedAccountId:null,convertedContactId:null,convertedAt:null},
  {id:"l5",firstName:"Tyler",lastName:"Brooks",company:"Midwest Urgent Care",title:"Operations Manager",email:"tbrooks@mwurgentcare.com",phone:"314-555-1006",source:"Referral",industry:"Healthcare",status:"Converted",rating:"Hot",assignedTo:"Senthil",createdAt:"2026-03-15",notes:"Referred by Smart Pain Solutions. 4-clinic group. Converted — now managing paid ads + SEO.",isConverted:true,convertedAccountId:"a3",convertedContactId:"c6",convertedAt:"2026-04-05"},
];
const D_LEAD_ACTS=[
  {id:"la1",leadId:"l1",type:"In Person",subject:"Discovery Meeting – Radiology Practice",notes:"Met at clinic. Dr. Chen very engaged. Discussed social media strategy and website redesign. Confirmed 3 locations, budget $5K/mo. Next step: send proposal.",date:"2026-04-15",duration:60,createdAt:"2026-04-15"},
  {id:"la2",leadId:"l1",type:"Video Conferencing",subject:"Follow-up – Zoom Call",notes:"Walked through case studies for similar radiology clients. Addressed HIPAA compliance questions. Requested formal proposal by end of week.",date:"2026-04-20",duration:45,createdAt:"2026-04-20"},
  {id:"la3",leadId:"l2",type:"Phone Call",subject:"Initial Qualification Call",notes:"Confirmed 2 PT locations in West County. Budget is tight at ~$1.5K/mo. Primarily interested in Google local SEO + GMB optimization.",date:"2026-04-16",duration:30,createdAt:"2026-04-16"},
  {id:"la4",leadId:"l3",type:"In Person",subject:"Salesforce World Tour – Booth Meeting",notes:"15-min intro at our booth. Priya is evaluating CRM vendors for a Salesforce implementation. Exchanged contact info. Will follow up with capabilities deck.",date:"2026-04-17",duration:15,createdAt:"2026-04-17"},
];
const D_LEAD_PROPOSALS=[
  {id:"lp1",leadId:"l1",name:"Arch Radiology – Social Media & Web Proposal",version:"v1.0",status:"Sent",amount:62000,sentDate:"2026-04-22",expiryDate:"2026-05-22",notes:"12-month social media retainer + website redesign. Presented via email.",fileName:"Proposal_ArchRadiology_v1.pdf",fileSize:1240000,fileData:null,createdAt:"2026-04-22"},
  {id:"lp2",leadId:"l2",name:"Heartland PT – Local SEO Package",version:"v1.0",status:"Draft",amount:18000,sentDate:"",expiryDate:"",notes:"Annual SEO + GMB management for 2 locations. Pending internal review before sending.",fileName:"",fileSize:0,fileData:null,createdAt:"2026-04-20"},
];

/* ═══ HELPERS ═══ */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2)}
function fmt(d){if(!d)return"—";try{return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return d}}
function fmtS(d){if(!d)return"";try{return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}catch{return d}}
function currency(n){return"$"+(Number(n)||0).toLocaleString()}
function ls(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch{return null}}
function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function initials(name){return(name||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
function oppTotal(o){
  const ot=Number(o.oneTime)||0,rc=Number(o.recurring)||0;
  if(!rc||!o.startDate||!o.endDate)return ot;
  const mo=Math.max(1,Math.round((new Date(o.endDate)-new Date(o.startDate))/(1000*60*60*24*30.44)));
  return ot+(rc*mo);
}

/* ═══ BASE COMPONENTS ═══ */
function Tag({text,color,bg,size="sm"}){
  const s=size==="sm"?{fontSize:11,padding:"2px 9px"}:{fontSize:12,padding:"3px 11px"};
  return<span style={{background:bg,color,borderRadius:20,fontWeight:600,whiteSpace:"nowrap",...s}}>{text}</span>
}
function Avatar({name,size=32,color="#6366f1",bg="#eef2ff"}){
  return<div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:700,color,flexShrink:0}}>{initials(name)}</div>
}
function Lbl({children}){return<div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:"#94a3b8",marginBottom:4}}>{children}</div>}
function StatCard({label,value,sub,color="#6366f1"}){
  return<div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"15px 18px"}}>
    <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}</div>
    <div style={{fontSize:24,fontWeight:700,color,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{sub}</div>}
  </div>
}
function SectionCard({title,count,action,children,noPad=false}){
  return<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
    <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>{title}{count!=null&&<span style={{fontSize:12,color:"#94a3b8",fontWeight:400,marginLeft:6}}>({count})</span>}</span>
      {action}
    </div>
    <div style={noPad?{}:{padding:"6px 20px 16px"}}>{children}</div>
  </div>
}
function Btn({children,onClick,v="primary",sz="md",style={}}){
  const base={border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontFamily:"inherit",transition:"opacity .15s"};
  const szs={sm:{padding:"5px 12px",fontSize:12},md:{padding:"8px 16px",fontSize:13},lg:{padding:"10px 20px",fontSize:14}};
  const vs={primary:{background:"#6366f1",color:"#fff"},ghost:{background:"#f8fafc",color:"#475569",border:"1px solid #e2e8f0"},danger:{background:"#fff0f0",color:"#ef4444",border:"1px solid #fee2e2"},indigo:{background:"#eef2ff",color:"#6366f1",border:"1px solid #c7d2fe"}};
  return<button onClick={onClick} style={{...base,...szs[sz],...vs[v],...style}}>{children}</button>
}
function Field({label,value,onChange,type="text",placeholder="",span=1}){
  return<div style={{gridColumn:`span ${span}`}}>
    <Lbl>{label}</Lbl>
    <input type={type} value={value||""} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
  </div>
}
function Select({label,value,onChange,options,span=1}){
  return<div style={{gridColumn:`span ${span}`}}>
    <Lbl>{label}</Lbl>
    <select value={value||""} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  </div>
}
function TextArea({label,value,onChange,rows=3,span=2}){
  return<div style={{gridColumn:`span ${span}`}}>
    <Lbl>{label}</Lbl>
    <textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows}
      style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",resize:"vertical"}}/>
  </div>
}

/* ═══ MODAL ═══ */
function Modal({title,onClose,onSave,wide=false,children}){
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:500,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:wide?740:560,boxShadow:"0 20px 60px rgba(0,0,0,0.2)",marginTop:20,marginBottom:20}}>
      <div style={{padding:"18px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{title}</span>
        <button onClick={onClose} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:14,color:"#64748b"}}>✕</button>
      </div>
      <div style={{padding:"20px 24px",maxHeight:"72vh",overflowY:"auto"}}>{children}</div>
      <div style={{padding:"14px 24px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn v="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={onSave}>Save</Btn>
      </div>
    </div>
  </div>
}

/* ═══ FORMS ═══ */
function AccountForm({account,onClose,onSave}){
  const[f,sf]=useState({name:account?.name||"",industry:account?.industry||INDUSTRIES[0],type:account?.type||"Prospect",status:account?.status||"Active",website:account?.website||"",phone:account?.phone||"",address:account?.address||"",assignedTo:account?.assignedTo||TEAM[0],notes:account?.notes||""});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  return<Modal title={account?"Edit Account":"New Account"} onClose={onClose} onSave={()=>{if(!f.name.trim())return alert("Account name required.");onSave(f);}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Field label="Account Name *" value={f.name} onChange={v=>set("name",v)} span={2}/>
      <Select label="Industry" value={f.industry} onChange={v=>set("industry",v)} options={INDUSTRIES}/>
      <Select label="Account Type" value={f.type} onChange={v=>set("type",v)} options={ACCT_TYPES}/>
      <Select label="Status" value={f.status} onChange={v=>set("status",v)} options={ACCT_STATUS}/>
      <Select label="Assigned To" value={f.assignedTo} onChange={v=>set("assignedTo",v)} options={TEAM}/>
      <Field label="Website" value={f.website} onChange={v=>set("website",v)} placeholder="domain.com"/>
      <Field label="Phone" value={f.phone} onChange={v=>set("phone",v)}/>
      <Field label="Address / Location" value={f.address} onChange={v=>set("address",v)} span={2}/>
      <TextArea label="Notes" value={f.notes} onChange={v=>set("notes",v)} span={2}/>
    </div>
  </Modal>
}
function ContactForm({contact,accounts,defaultAccountId,onClose,onSave}){
  const[f,sf]=useState({accountId:contact?.accountId||defaultAccountId||accounts[0]?.id||"",name:contact?.name||"",title:contact?.title||"",dept:contact?.dept||DEPTS[0],role:contact?.role||ROLES[0],phone:contact?.phone||"",email:contact?.email||"",primary:contact?.primary||false});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  return<Modal title={contact?"Edit Contact":"New Contact"} onClose={onClose} onSave={()=>{if(!f.name.trim())return alert("Contact name required.");onSave(f);}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{gridColumn:"span 2"}}><Lbl>Account *</Lbl>
        <select value={f.accountId} onChange={e=>set("accountId",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <Field label="Full Name *" value={f.name} onChange={v=>set("name",v)} span={2}/>
      <Field label="Job Title" value={f.title} onChange={v=>set("title",v)}/>
      <Select label="Department" value={f.dept} onChange={v=>set("dept",v)} options={DEPTS}/>
      <Select label="Role / Influence" value={f.role} onChange={v=>set("role",v)} options={ROLES}/>
      <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:18}}>
        <input type="checkbox" id="pchk" checked={f.primary} onChange={e=>set("primary",e.target.checked)} style={{width:15,height:15,cursor:"pointer"}}/>
        <label htmlFor="pchk" style={{fontSize:13,color:"#334155",cursor:"pointer",fontWeight:500}}>Primary contact</label>
      </div>
      <Field label="Phone" value={f.phone} onChange={v=>set("phone",v)}/>
      <Field label="Email" value={f.email} onChange={v=>set("email",v)} type="email"/>
    </div>
  </Modal>
}
function OppForm({opp,accounts,defaultAccountId,onClose,onSave}){
  const[f,sf]=useState({accountId:opp?.accountId||defaultAccountId||accounts[0]?.id||"",name:opp?.name||"",stage:opp?.stage||OPP_STAGES[0],oneTime:opp?.oneTime||"",recurring:opp?.recurring||"",recurringPeriod:opp?.recurringPeriod||"Monthly",startDate:opp?.startDate||"",endDate:opp?.endDate||"",probability:opp?.probability||"",notes:opp?.notes||""});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  const dur=f.startDate&&f.endDate?Math.max(0,Math.round((new Date(f.endDate)-new Date(f.startDate))/(1000*60*60*24*30.44))):null;
  const preview=()=>{const ot=Number(f.oneTime)||0,rc=Number(f.recurring)||0;if(!dur)return ot||rc?`${currency(ot+rc)} (duration TBD)`:null;return`${currency(ot+(rc*(dur||0)))} total over ${dur} months`;};
  return<Modal title={opp?"Edit Opportunity":"New Opportunity"} onClose={onClose} onSave={()=>{if(!f.name.trim())return alert("Opportunity name required.");onSave(f);}} wide>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{gridColumn:"span 2"}}><Lbl>Account *</Lbl>
        <select value={f.accountId} onChange={e=>set("accountId",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <Field label="Opportunity Name *" value={f.name} onChange={v=>set("name",v)} span={2}/>
      <Select label="Stage" value={f.stage} onChange={v=>set("stage",v)} options={OPP_STAGES}/>
      <Field label="Probability (%)" value={f.probability} onChange={v=>set("probability",v)} type="number" placeholder="0–100"/>
      <Field label="One-time Value ($)" value={f.oneTime} onChange={v=>set("oneTime",v)} type="number" placeholder="0"/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10}}>
        <Field label="Recurring Value ($)" value={f.recurring} onChange={v=>set("recurring",v)} type="number" placeholder="0"/>
        <Select label="Period" value={f.recurringPeriod} onChange={v=>set("recurringPeriod",v)} options={PERIODS}/>
      </div>
      <Field label="Start Date" value={f.startDate} onChange={v=>set("startDate",v)} type="date"/>
      <Field label="Close / End Date" value={f.endDate} onChange={v=>set("endDate",v)} type="date"/>
    </div>
    {preview()&&<div style={{marginTop:12,padding:"10px 14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,fontSize:13,color:"#166534",fontWeight:600}}>💰 {preview()}</div>}
    <div style={{marginTop:14}}><TextArea label="Notes" value={f.notes} onChange={v=>set("notes",v)} rows={2} span={1}/></div>
  </Modal>
}
function ActivityForm({accountId,oppId,accounts,onClose,onSave}){
  const[f,sf]=useState({accountId:accountId||accounts[0]?.id||"",type:"Call",description:"",date:new Date().toISOString().slice(0,10)});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  return<Modal title="Log Activity" onClose={onClose} onSave={()=>{if(!f.description.trim())return alert("Description required.");onSave(f);}}>
    {!accountId&&<div style={{marginBottom:14}}><Lbl>Account</Lbl>
      <select value={f.accountId} onChange={e=>set("accountId",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
        {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Select label="Activity Type" value={f.type} onChange={v=>set("type",v)} options={ACT_TYPES}/>
      <Field label="Date" value={f.date} onChange={v=>set("date",v)} type="date"/>
    </div>
    <div style={{marginTop:14}}><Lbl>Description *</Lbl>
      <textarea value={f.description} onChange={e=>set("description",e.target.value)} rows={3} placeholder="What happened? Key points, next steps…"
        style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",resize:"vertical"}}/>
    </div>
  </Modal>
}

/* ═══ OPPORTUNITY STAGE PROGRESS ═══ */
function StageBar({stage}){
  const idx=OPP_STAGES.indexOf(stage);
  return<div style={{display:"flex",gap:2}}>
    {OPP_STAGES.map((s,i)=>{
      const m=OS_META[s];
      const active=i===idx,past=i<idx&&idx<OPP_STAGES.length-2;
      return<div key={s} style={{flex:1,padding:"4px 0",background:active?m.c:past?"#c7d2fe":"#f1f5f9",color:active?"#fff":past?"#4338ca":"#94a3b8",fontSize:9,fontWeight:active?700:400,textAlign:"center",borderRadius:i===0?"5px 0 0 5px":i===OPP_STAGES.length-1?"0 5px 5px 0":"0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s}</div>
    })}
  </div>
}

/* ═══ TIMELINE BAR ═══ */
function Timeline({opps}){
  const valid=opps.filter(o=>o.startDate&&o.endDate);
  if(!valid.length)return<div style={{padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:13}}>Add opportunities with start and end dates to see the timeline.</div>;
  const dates=valid.flatMap(o=>[new Date(o.startDate),new Date(o.endDate)]);
  const minD=Math.min(...dates.map(d=>d.getTime()));
  const maxD=Math.max(...dates.map(d=>d.getTime()));
  const range=maxD-minD||1;
  const colors=["#6366f1","#10b981","#f59e0b","#0ea5e9","#f97316","#8b5cf6","#ef4444","#14b8a6"];
  return<div style={{padding:"16px 20px"}}>
    <div style={{position:"relative",paddingTop:20}}>
      {(()=>{const mk=[];const sy=new Date(minD).getFullYear(),ey=new Date(maxD).getFullYear();
        for(let y=sy;y<=ey+1;y++){const p=((new Date(y,0,1)-minD)/range)*100;
          if(p>=0&&p<=105)mk.push(<div key={y} style={{position:"absolute",left:`${p}%`,top:0,bottom:0,borderLeft:"1px dashed #e2e8f0"}}>
            <span style={{fontSize:9,color:"#cbd5e1",position:"absolute",top:-16,transform:"translateX(-50%)"}}>{y}</span>
          </div>);}
        return mk;})()}
      {valid.map((o,i)=>{
        const left=((new Date(o.startDate)-minD)/range)*100;
        const width=Math.max(2,((new Date(o.endDate)-new Date(o.startDate))/range)*100);
        const m=OS_META[o.stage];
        return<div key={o.id} style={{position:"relative",height:26,marginBottom:5}} title={`${o.name} | ${fmt(o.startDate)} → ${fmt(o.endDate)}`}>
          <div style={{position:"absolute",left:`${left}%`,width:`${Math.min(width,100-left)}%`,height:"100%",background:colors[i%colors.length],borderRadius:5,display:"flex",alignItems:"center",overflow:"hidden",minWidth:4}}>
            <span style={{color:"#fff",fontSize:10,fontWeight:600,padding:"0 7px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.name}</span>
          </div>
        </div>;
      })}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:"5px 14px",marginTop:12}}>
      {valid.map((o,i)=><div key={o.id} style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{width:8,height:8,borderRadius:2,background:colors[i%colors.length],display:"inline-block"}}/>
        <span style={{fontSize:10,color:"#64748b"}}>{o.name}</span>
      </div>)}
    </div>
  </div>;
}

/* ═══ ACCOUNT DETAIL ═══ */
function AccountDetail({account,contacts,opps,acts,contracts,allAccounts,onBack,onEdit,onDelete,onStatusChange,
  onSaveContact,onDeleteContact,onSaveOpp,onDeleteOpp,onSaveAct,onDeleteAct,onSaveContract,onDeleteContract,onViewContact,onViewOpp}){
  const[tab,setTab]=useState("overview");
  const[showCF,setSCF]=useState(false);
  const[editC,setEC]=useState(null);
  const[showOF,setSOF]=useState(false);
  const[editO,setEO]=useState(null);
  const[showAF,setSAF]=useState(false);
  const[showCTF,setSCTF]=useState(false);
  const[editCT,setECT]=useState(null);

  const sm=AS_META[account.status]||AS_META.Active;
  const tm=AT_META[account.type]||AT_META.Prospect;
  const sortedActs=[...acts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const totalContract=opps.reduce((s,o)=>s+oppTotal(o),0);
  const totalOT=opps.reduce((s,o)=>s+(Number(o.oneTime)||0),0);
  const totalRC=opps.filter(o=>Number(o.recurring)>0).reduce((s,o)=>s+(Number(o.recurring)||0),0);
  const wonValue=opps.filter(o=>o.stage==="Closed Won").reduce((s,o)=>s+oppTotal(o),0);
  const pipeline=opps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).reduce((s,o)=>s+oppTotal(o),0);
  const pc=contacts.find(c=>c.primary)||contacts[0];

  const tabs=[["overview","Overview"],["contacts",`Contacts (${contacts.length})`],["opportunities",`Opportunities (${opps.length})`],["contracts",`Contracts (${contracts.length})`],["timeline","Timeline"],["activity",`Activity (${acts.length})`]];

  return<div style={{padding:"22px 24px",maxWidth:980,margin:"0 auto"}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",gap:4}}>← Accounts</button>

    {/* Header */}
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"22px 26px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Avatar name={account.name} size={48} color={tm.c} bg={tm.bg}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:5}}>
              <h2 style={{fontSize:21,fontWeight:700,color:"#0f172a"}}>{account.name}</h2>
              <Tag text={account.type} color={tm.c} bg={tm.bg}/>
              <Tag text={account.status} color={sm.c} bg={sm.bg}/>
            </div>
            <div style={{fontSize:13,color:"#64748b",display:"flex",gap:12,flexWrap:"wrap"}}>
              <span>{account.industry}</span>
              {account.website&&<a href={`https://${account.website}`} target="_blank" rel="noopener" style={{color:"#6366f1"}}>{account.website}</a>}
              {account.phone&&<span>{account.phone}</span>}
              {account.address&&<span>📍 {account.address}</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={()=>{if(window.confirm("Delete this account and all related data?"))onDelete();}}>Delete</Btn>
        </div>
      </div>

      {/* Status mover */}
      <div style={{marginBottom:16}}>
        <Lbl>Account Status</Lbl>
        <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
          {ACCT_STATUS.map(s=>{const m=AS_META[s];const active=account.status===s;
            return<button key={s} onClick={()=>onStatusChange(s)} style={{padding:"5px 13px",borderRadius:20,border:`1.5px solid ${active?m.c:"#e2e8f0"}`,background:active?m.bg:"#fff",color:active?m.c:"#94a3b8",fontSize:12,fontWeight:active?700:400,cursor:"pointer"}}>{s}</button>;
          })}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:account.notes?14:0}}>
        {[["Won Revenue",currency(wonValue)],["Open Pipeline",currency(pipeline)],["Total Contract",currency(totalContract)],["One-time",currency(totalOT)],["Monthly Rec.",totalRC>0?`${currency(totalRC)}/mo`:"—"],["Assigned To",account.assignedTo],["Since",fmt(account.createdAt)]].map(([l,v])=>
          <div key={l} style={{background:"#f8fafc",borderRadius:9,padding:"10px 12px"}}>
            <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#334155"}}>{v}</div>
          </div>)}
      </div>
      {account.notes&&<div style={{padding:"11px 14px",background:"#fffbeb",border:"1px solid #fef3c7",borderRadius:9,marginTop:4}}>
        <div style={{fontSize:9,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>NOTES</div>
        <div style={{fontSize:13,color:"#78350f",lineHeight:1.6}}>{account.notes}</div>
      </div>}
    </div>

    {/* Tabs */}
    <div style={{display:"flex",gap:2,background:"#fff",padding:4,borderRadius:10,border:"1px solid #e2e8f0",width:"fit-content",marginBottom:16,flexWrap:"wrap"}}>
      {tabs.map(([k,lbl])=><button key={k} onClick={()=>setTab(k)} style={{padding:"7px 14px",borderRadius:7,border:"none",background:tab===k?"#6366f1":"transparent",color:tab===k?"#fff":"#64748b",fontSize:12,fontWeight:tab===k?600:400,cursor:"pointer",whiteSpace:"nowrap"}}>{lbl}</button>)}
    </div>

    {/* Overview tab */}
    {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {/* Primary contact */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:20}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
          Primary Contact
          <button onClick={()=>{setEC(null);setSCF(true);}} style={{background:"none",border:"none",color:"#6366f1",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Add</button>
        </div>
        {pc?<div style={{display:"flex",gap:12,alignItems:"center",cursor:"pointer"}} onClick={()=>onViewContact(pc)}>
          <Avatar name={pc.name} size={42}/>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:"#0f172a"}}>{pc.name}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{pc.title} · {pc.role}</div>
            <div style={{fontSize:12,color:"#6366f1",marginTop:2}}>{pc.email}</div>
          </div>
        </div>:<div style={{color:"#94a3b8",fontSize:13}}>No contacts yet.</div>}
        {contacts.length>1&&<div style={{marginTop:10,fontSize:12,color:"#94a3b8",cursor:"pointer"}} onClick={()=>setTab("contacts")}>+{contacts.length-1} more contact{contacts.length-1!==1?"s":""} →</div>}
      </div>

      {/* Open opportunities */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:20}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
          Open Opportunities
          <button onClick={()=>{setEO(null);setSOF(true);}} style={{background:"none",border:"none",color:"#6366f1",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Add</button>
        </div>
        {opps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).slice(0,3).map(o=>{
          const m=OS_META[o.stage];
          return<div key={o.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #f1f5f9"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:600,color:"#0f172a",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</div>
              <span style={{marginLeft:8,flexShrink:0,fontSize:12,fontWeight:700,color:"#10b981"}}>{currency(oppTotal(o))}</span>
            </div>
            <Tag text={o.stage} color={m.c} bg={m.bg}/>
          </div>;
        })}
        {opps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).length===0&&<div style={{color:"#94a3b8",fontSize:13}}>No open opportunities.</div>}
      </div>

      {/* Recent activity */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:20,gridColumn:"span 2"}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
          Recent Activity
          <Btn sz="sm" onClick={()=>setSAF(true)}>+ Log</Btn>
        </div>
        {sortedActs.slice(0,4).map((act,i)=>{
          const am=AM[act.type]||{e:"•"};
          return<div key={act.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<Math.min(3,sortedActs.length-1)?"1px solid #f1f5f9":"none"}}>
            <div style={{width:30,height:30,borderRadius:8,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{am.e}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,fontWeight:600,color:"#334155"}}>{act.type}</span>
                <span style={{fontSize:11,color:"#94a3b8"}}>{fmtS(act.date)}</span>
              </div>
              <div style={{fontSize:12,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{act.description}</div>
            </div>
          </div>;
        })}
        {sortedActs.length===0&&<div style={{color:"#94a3b8",fontSize:13}}>No activity yet.</div>}
      </div>
    </div>}

    {/* Contacts tab */}
    {tab==="contacts"&&<SectionCard title="Contacts" count={contacts.length} noPad
      action={<Btn sz="sm" onClick={()=>{setEC(null);setSCF(true);}}>+ Add Contact</Btn>}>
      {contacts.length===0&&<div style={{padding:24,textAlign:"center",color:"#94a3b8",fontSize:13}}>No contacts yet.</div>}
      {contacts.length>0&&<div style={{overflowX:"auto"}}>
        <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f8fafc"}}>
            {["","Name","Title","Department","Role","Phone","Email",""].map((h,i)=><th key={i} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {contacts.map((c,i)=><tr key={c.id} style={{borderTop:"1px solid #f1f5f9",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background=""}>
              <td style={{padding:"10px 8px 10px 16px",width:28}} onClick={()=>onViewContact(c)}>
                {c.primary&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20}}>Primary</span>}
              </td>
              <td style={{padding:"10px 16px"}} onClick={()=>onViewContact(c)}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Avatar name={c.name} size={28} color="#6366f1" bg="#eef2ff"/>
                  <span style={{fontWeight:600,color:"#0f172a"}}>{c.name}</span>
                </div>
              </td>
              <td style={{padding:"10px 16px",color:"#64748b"}} onClick={()=>onViewContact(c)}>{c.title||"—"}</td>
              <td style={{padding:"10px 16px"}} onClick={()=>onViewContact(c)}><span style={{background:"#f1f5f9",color:"#475569",borderRadius:6,padding:"2px 8px",fontSize:11}}>{c.dept}</span></td>
              <td style={{padding:"10px 16px",color:"#64748b"}} onClick={()=>onViewContact(c)}>{c.role}</td>
              <td style={{padding:"10px 16px"}}><a href={`tel:${c.phone}`} style={{color:"#334155",fontSize:12}}>{c.phone||"—"}</a></td>
              <td style={{padding:"10px 16px"}}><a href={`mailto:${c.email}`} style={{color:"#6366f1",fontSize:12}}>{c.email||"—"}</a></td>
              <td style={{padding:"10px 16px",textAlign:"right"}}>
                <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                  <Btn sz="sm" v="ghost" onClick={()=>{setEC(c);setSCF(true);}}>Edit</Btn>
                  <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Remove contact?"))onDeleteContact(c.id);}}>✕</Btn>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>}
    </SectionCard>}

    {/* Opportunities tab */}
    {tab==="opportunities"&&<SectionCard title="Opportunities" count={opps.length}
      action={<Btn sz="sm" onClick={()=>{setEO(null);setSOF(true);}}>+ Add Opportunity</Btn>}>
      {opps.length===0&&<div style={{paddingTop:12,paddingBottom:4,textAlign:"center",color:"#94a3b8",fontSize:13}}>No opportunities yet.</div>}
      {opps.map((o,i)=>{
        const m=OS_META[o.stage];
        const dur=o.startDate&&o.endDate?Math.max(0,Math.round((new Date(o.endDate)-new Date(o.startDate))/(1000*60*60*24*30.44))):null;
        return<div key={o.id} style={{paddingTop:14,paddingBottom:14,borderBottom:i<opps.length-1?"1px solid #f1f5f9":"none"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:10}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:5,cursor:onViewOpp?"pointer":"default"}}
                onClick={()=>onViewOpp&&onViewOpp(o)}>{o.name}</div>
              <Tag text={o.stage} color={m.c} bg={m.bg}/>
              {o.probability!=null&&Number(o.probability)>0&&<span style={{marginLeft:8,fontSize:11,color:"#94a3b8"}}>{o.probability}% probability</span>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <Btn sz="sm" v="indigo" onClick={()=>onViewOpp&&onViewOpp(o)}>View Details →</Btn>
              <Btn sz="sm" v="ghost" onClick={()=>{setEO(o);setSOF(true);}}>Edit</Btn>
              <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Remove opportunity?"))onDeleteOpp(o.id);}}>✕</Btn>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:10}}>
            {[["One-time",Number(o.oneTime)>0?currency(o.oneTime):"—"],["Recurring",Number(o.recurring)>0?`${currency(o.recurring)}/${o.recurringPeriod||"mo"}`:"—"],["Duration",dur!=null?`${dur} mo`:"—"],["Total",currency(oppTotal(o))],["Start",fmt(o.startDate)],["Close",fmt(o.endDate)]].map(([l,v])=>
              <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"8px 11px"}}>
                <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:l==="Total"?"#10b981":"#334155"}}>{v}</div>
              </div>)}
          </div>
          <StageBar stage={o.stage}/>
          {o.notes&&<div style={{marginTop:8,fontSize:12,color:"#64748b",fontStyle:"italic"}}>{o.notes}</div>}
        </div>;
      })}
      {opps.length>1&&<div style={{paddingTop:12,borderTop:"1px solid #f1f5f9",display:"flex",gap:20,flexWrap:"wrap",marginTop:4}}>
        <div><span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Total one-time </span><span style={{fontWeight:700,color:"#334155",fontSize:14}}>{currency(totalOT)}</span></div>
        {totalRC>0&&<div><span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Monthly rec. </span><span style={{fontWeight:700,color:"#334155",fontSize:14}}>{currency(totalRC)}/mo</span></div>}
        <div><span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Total contract </span><span style={{fontWeight:700,color:"#10b981",fontSize:14}}>{currency(totalContract)}</span></div>
      </div>}
    </SectionCard>}

    {/* Timeline tab */}
    {tab==="timeline"&&<SectionCard title="Opportunity Timeline" action={<Btn sz="sm" onClick={()=>{setEO(null);setSOF(true);}}>+ Add</Btn>}>
      <Timeline opps={opps}/>
    </SectionCard>}

    {/* Activity tab */}
    {tab==="activity"&&<SectionCard title="Activity Log" count={acts.length} action={<Btn sz="sm" onClick={()=>setSAF(true)}>+ Log Activity</Btn>}>
      {sortedActs.length===0&&<div style={{paddingTop:12,textAlign:"center",color:"#94a3b8",fontSize:13}}>No activities yet.</div>}
      {sortedActs.map((act,i)=>{
        const am=AM[act.type]||{e:"•"};
        return<div key={act.id} style={{display:"flex",gap:12,padding:"13px 0",borderBottom:i<sortedActs.length-1?"1px solid #f1f5f9":"none"}}>
          <div style={{width:34,height:34,borderRadius:9,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{am.e}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:13,fontWeight:600,color:"#334155"}}>{act.type}</span>
              <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,marginLeft:8}}>
                <span style={{fontSize:11,color:"#94a3b8"}}>{fmt(act.date)}</span>
                <button onClick={()=>{if(window.confirm("Remove?"))onDeleteAct(act.id);}} style={{background:"none",border:"none",color:"#ef4444",fontSize:11,cursor:"pointer",padding:0}}>✕</button>
              </div>
            </div>
            <div style={{fontSize:13,color:"#64748b",lineHeight:1.5}}>{act.description}</div>
          </div>
        </div>;
      })}
    </SectionCard>}

    {showCF&&<ContactForm contact={editC} accounts={allAccounts} defaultAccountId={account.id} onClose={()=>{setSCF(false);setEC(null);}}
      onSave={d=>{onSaveContact({...d,id:editC?.id||uid(),accountId:account.id,createdAt:editC?.createdAt||new Date().toISOString().slice(0,10)});setSCF(false);setEC(null);}}/>}
    {showOF&&<OppForm opp={editO} accounts={allAccounts} defaultAccountId={account.id} onClose={()=>{setSOF(false);setEO(null);}}
      onSave={d=>{onSaveOpp({...d,id:editO?.id||uid(),accountId:account.id,createdAt:editO?.createdAt||new Date().toISOString().slice(0,10)});setSOF(false);setEO(null);}}/>}
    {showAF&&<ActivityForm accountId={account.id} accounts={allAccounts} onClose={()=>setSAF(false)}
      onSave={d=>{onSaveAct({...d,id:uid(),accountId:account.id,createdAt:d.date});setSAF(false);}}/>}

    {/* Contracts tab content */}
    {tab==="contracts"&&<SectionCard title="Contracts & Proposals" count={contracts.length} action={<Btn sz="sm" onClick={()=>{setECT(null);setSCTF(true);}}>+ New Contract</Btn>}>
      {contracts.length===0&&<div style={{paddingTop:16,paddingBottom:8,textAlign:"center",color:"#94a3b8",fontSize:13}}>No contracts yet. Click + New Contract to add one.</div>}
      {contracts.map(function(ct,idx){
        const cm=CT_META[ct.type]||CT_META.Other;
        const statColor=ct.status==="Active"?"#10b981":ct.status==="Expired"?"#64748b":ct.status==="Pending"?"#f59e0b":"#ef4444";
        const isExpired=ct.endDate&&new Date(ct.endDate)<new Date();
        const daysLeft=ct.endDate?Math.round((new Date(ct.endDate)-new Date())/86400000):null;
        const urgent=daysLeft!==null&&daysLeft>=0&&daysLeft<=30;
        function fmtBytes(b){if(!b)return"";if(b<1048576)return(b/1024).toFixed(0)+"KB";return(b/1048576).toFixed(2)+"MB";}

        function handleQuickFile(e){
          const file=e.target.files[0];
          if(!file)return;
          if(file.size>5*1024*1024){alert("File exceeds 5 MB limit.");return;}
          const reader=new FileReader();
          reader.onload=function(ev){
            const updated={...ct,fileName:file.name,fileSize:file.size,fileData:ev.target.result};
            onSaveContract(updated);
          };
          reader.readAsDataURL(file);
        }

        return<div key={ct.id} style={{paddingTop:16,paddingBottom:16,borderBottom:idx<contracts.length-1?"1px solid #f1f5f9":"none"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:cm.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cm.icon}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:3}}>{ct.name}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{background:cm.bg,color:cm.c,borderRadius:20,fontSize:11,fontWeight:600,padding:"2px 10px"}}>{ct.type}</span>
                  <span style={{background:ct.status==="Active"?"#ecfdf5":ct.status==="Expired"?"#f1f5f9":ct.status==="Pending"?"#fef3c7":"#fef2f2",color:statColor,borderRadius:20,fontSize:11,fontWeight:600,padding:"2px 10px"}}>{ct.status}</span>
                  {urgent&&<span style={{background:"#fff7ed",color:"#f97316",borderRadius:20,fontSize:11,fontWeight:600,padding:"2px 10px"}}>⚠️ {daysLeft}d left</span>}
                  {isExpired&&ct.status!=="Expired"&&<span style={{background:"#fef2f2",color:"#ef4444",borderRadius:20,fontSize:11,fontWeight:600,padding:"2px 10px"}}>Expired</span>}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {/* Quick attach button */}
              <label style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                📎 Attach
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleQuickFile} style={{display:"none"}}/>
              </label>
              <Btn sz="sm" v="ghost" onClick={()=>{setECT(ct);setSCTF(true);}}>Edit</Btn>
              <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Delete this contract?"))onDeleteContract(ct.id);}}>Delete</Btn>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:ct.notes||ct.fileName?10:0}}>
            {[["Start",ct.startDate?fmt(ct.startDate):"—"],["End",ct.endDate?fmt(ct.endDate):"—"],["Duration",ct.startDate&&ct.endDate?Math.round((new Date(ct.endDate)-new Date(ct.startDate))/86400000)+"d":"—"],["Value",ct.value?("$"+Number(ct.value).toLocaleString()):"—"]].map(function(pair){
              return<div key={pair[0]} style={{background:"#f8fafc",borderRadius:8,padding:"8px 12px"}}>
                <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{pair[0]}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#334155"}}>{pair[1]}</div>
              </div>;
            })}
          </div>

          {ct.notes&&<div style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:ct.fileName?8:0,fontStyle:"italic"}}>{ct.notes}</div>}

          {ct.fileName&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:9,marginTop:8}}>
            <span style={{fontSize:18}}>{ct.fileName.toLowerCase().endsWith(".pdf")?"📄":"📝"}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.fileName}</div>
              <div style={{fontSize:10,color:"#94a3b8"}}>{fmtBytes(ct.fileSize)}</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {ct.fileData&&<button onClick={()=>{
                const w=window.open();
                w.document.write(`<html><body style="margin:0;background:#1e1e2e"><iframe src="${ct.fileData}" style="width:100%;height:100vh;border:none"/></body></html>`);
              }} style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:6,padding:"4px 11px",fontSize:11,fontWeight:700,cursor:"pointer"}}>📂 Open</button>}
              {ct.fileData&&<a href={ct.fileData} download={ct.fileName} style={{background:"#ecfdf5",color:"#10b981",borderRadius:6,padding:"4px 11px",fontSize:11,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center"}}>↓ Save</a>}
              {!ct.fileData&&<span style={{background:"#f8fafc",color:"#94a3b8",borderRadius:6,padding:"4px 11px",fontSize:11,fontStyle:"italic"}}>Demo file</span>}
            </div>
          </div>}

          {!ct.fileName&&<div style={{marginTop:8,padding:"10px 14px",border:"1.5px dashed #e2e8f0",borderRadius:9,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14,color:"#94a3b8"}}>📎</span>
            <span style={{fontSize:12,color:"#94a3b8",flex:1}}>No file attached</span>
            <label style={{background:"#eef2ff",color:"#6366f1",borderRadius:6,padding:"4px 11px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
              + Attach File
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleQuickFile} style={{display:"none"}}/>
            </label>
          </div>}
        </div>;
      })}
    </SectionCard>}

    {showCTF&&<ContractForm contract={editCT} accountId={account.id} onClose={()=>{setSCTF(false);setECT(null);}}
      onSave={d=>{
        const data={...d,id:editCT?.id||uid(),accountId:account.id,createdAt:editCT?.createdAt||new Date().toISOString().slice(0,10)};
        onSaveContract(data);
        setSCTF(false);setECT(null);
      }}/>}
  </div>;
}

/* ═══ CONTACT DETAIL ═══ */
function ContactDetail({contact,account,opps,onBack,onEdit,onDelete,onViewAccount}){
  const tm=AT_META[account?.type]||AT_META.Prospect;
  return<div style={{padding:"22px 24px",maxWidth:680,margin:"0 auto"}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",gap:4}}>← Contacts</button>
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"24px 28px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <Avatar name={contact.name} size={52}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a"}}>{contact.name}</h2>
              {contact.primary&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Primary</span>}
            </div>
            <div style={{fontSize:13,color:"#64748b"}}>{contact.title}{contact.dept&&` · ${contact.dept}`}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={()=>{if(window.confirm("Delete contact?"))onDelete();}}>Delete</Btn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        {[["Role",contact.role],["Department",contact.dept||"—"],["Phone",contact.phone||"—"],["Email",contact.email||"—"]].map(([l,v])=>
          <div key={l} style={{background:"#f8fafc",borderRadius:9,padding:"10px 12px"}}>
            <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:600,color:"#334155"}}>{v}</div>
          </div>)}
      </div>
      {account&&<div style={{padding:"12px 14px",background:"#f8fafc",borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>onViewAccount(account)}>
        <Avatar name={account.name} size={30} color={tm.c} bg={tm.bg}/>
        <div>
          <div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>ACCOUNT</div>
          <div style={{fontSize:14,fontWeight:600,color:"#6366f1"}}>{account.name}</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:11,color:"#94a3b8"}}>View account →</div>
      </div>}
    </div>
    {opps.length>0&&<SectionCard title="Related Opportunities" count={opps.length}>
      {opps.map((o,i)=>{
        const m=OS_META[o.stage];
        return<div key={o.id} style={{padding:"10px 0",borderBottom:i<opps.length-1?"1px solid #f1f5f9":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:3}}>{o.name}</div>
            <Tag text={o.stage} color={m.c} bg={m.bg}/>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#10b981"}}>{currency(oppTotal(o))}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{fmt(o.startDate)} – {fmt(o.endDate)}</div>
          </div>
        </div>;
      })}
    </SectionCard>}
  </div>;
}

/* ═══ ACCOUNTS LIST ═══ */
function ViewToggle({view,setView}){
  var gi='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>';
  var li='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="3" cy="6" r="1.5"></circle><circle cx="3" cy="12" r="1.5"></circle><circle cx="3" cy="18" r="1.5"></circle></svg>';
  return<div style={{display:"flex",gap:4}}>
    <button title="Tile view" onClick={function(){setView("tile");}}
      style={{padding:"5px 8px",borderRadius:6,border:"1px solid "+(view==="tile"?"#6366f1":"#e2e8f0"),background:view==="tile"?"#6366f1":"#fff",cursor:"pointer",display:"flex",alignItems:"center",color:view==="tile"?"#fff":"#64748b"}}>
      <span dangerouslySetInnerHTML={{__html:gi}}></span>
    </button>
    <button title="List view" onClick={function(){setView("list");}}
      style={{padding:"5px 8px",borderRadius:6,border:"1px solid "+(view==="list"?"#6366f1":"#e2e8f0"),background:view==="list"?"#6366f1":"#fff",cursor:"pointer",display:"flex",alignItems:"center",color:view==="list"?"#fff":"#64748b"}}>
      <span dangerouslySetInnerHTML={{__html:li}}></span>
    </button>
  </div>;
}

function AccountsList({accounts,contacts,opps,onView,onAdd}){
  const[search,setSearch]=useState("");
  const[fType,setFType]=useState("All");
  const[fStatus,setFStatus]=useState("All");
  const[view,setView]=useState("tile");
  const filtered=accounts.filter(a=>{
    if(fType!=="All"&&a.type!==fType)return false;
    if(fStatus!=="All"&&a.status!==fStatus)return false;
    if(search){const q=search.toLowerCase();return a.name?.toLowerCase().includes(q)||a.industry?.toLowerCase().includes(q);}
    return true;
  });
  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
      <div><h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Accounts</h1>
        <p style={{fontSize:13,color:"#64748b"}}>{filtered.length} of {accounts.length}</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><ViewToggle view={view} setView={setView}/><Btn onClick={onAdd}>+ New Account</Btn></div>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search accounts…" style={{flex:"1 1 200px",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
      <select value={fType} onChange={e=>setFType(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Types</option>{ACCT_TYPES.map(t=><option key={t}>{t}</option>)}
      </select>
      <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Statuses</option>{ACCT_STATUS.map(s=><option key={s}>{s}</option>)}
      </select>
      {(fType!=="All"||fStatus!=="All"||search)&&<button onClick={()=>{setFType("All");setFStatus("All");setSearch("");}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff0f0",color:"#ef4444",cursor:"pointer"}}>✕ Clear</button>}
    </div>
    {view==="tile"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13}}>
      {filtered.map(a=>{
        const tm=AT_META[a.type]||AT_META.Prospect,sm=AS_META[a.status]||AS_META.Active;
        const ac=contacts.filter(c=>c.accountId===a.id),ao=opps.filter(o=>o.accountId===a.id);
        const pc=ac.find(c=>c.primary)||ac[0],tv=ao.reduce((s,o)=>s+oppTotal(o),0);
        const open=ao.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).length;
        return<div key={a.id} onClick={()=>onView(a)} style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 18px",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.09)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}>
              <Avatar name={a.name} size={34} color={tm.c} bg={tm.bg}/>
              <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:14,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div><div style={{fontSize:11,color:"#64748b"}}>{a.industry}</div></div>
            </div>
            <Tag text={a.type} color={tm.c} bg={tm.bg}/>
          </div>
          {pc&&<div style={{fontSize:12,color:"#64748b",marginBottom:10,display:"flex",alignItems:"center",gap:5}}><span>👤</span><span>{pc.name}</span><span style={{color:"#cbd5e1"}}>·</span><span style={{color:"#94a3b8"}}>{pc.role}</span></div>}
          <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{tv>0?currency(tv):"—"}</div><div style={{fontSize:10,color:"#94a3b8"}}>{open} open opp{open!==1?"s":""} · {ac.length} contact{ac.length!==1?"s":""}</div></div>
            <Tag text={a.status} color={sm.c} bg={sm.bg}/>
          </div>
        </div>;})}
      {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:"#94a3b8",fontSize:14}}>No accounts match.</div>}
    </div>}
    {view==="list"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      {filtered.length===0?<div style={{padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:14}}>No accounts match.</div>
      :<div style={{overflowX:"auto"}}><table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc"}}>{["","Account","Industry","Type","Status","Pipeline","Contacts","Assigned"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(a=>{
          const tm=AT_META[a.type]||AT_META.Prospect,sm=AS_META[a.status]||AS_META.Active;
          const ac=contacts.filter(c=>c.accountId===a.id),ao=opps.filter(o=>o.accountId===a.id);
          const tv=ao.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).reduce((s,o)=>s+oppTotal(o),0);
          return<tr key={a.id} onClick={()=>onView(a)} style={{borderTop:"1px solid #f1f5f9",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"10px 6px 10px 14px",width:38}}><Avatar name={a.name} size={30} color={tm.c} bg={tm.bg}/></td>
            <td style={{padding:"10px 14px"}}><div style={{fontWeight:600,color:"#0f172a"}}>{a.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{a.website||""}</div></td>
            <td style={{padding:"10px 14px",color:"#64748b"}}>{a.industry}</td>
            <td style={{padding:"10px 14px"}}><Tag text={a.type} color={tm.c} bg={tm.bg}/></td>
            <td style={{padding:"10px 14px"}}><Tag text={a.status} color={sm.c} bg={sm.bg}/></td>
            <td style={{padding:"10px 14px",fontWeight:600,color:"#334155"}}>{tv>0?currency(tv):"—"}</td>
            <td style={{padding:"10px 14px",color:"#64748b",textAlign:"center"}}>{ac.length}</td>
            <td style={{padding:"10px 14px",color:"#64748b"}}>{a.assignedTo||"—"}</td>
          </tr>;})}
        </tbody>
      </table></div>}
    </div>}
  </div>;
}

/* ═══ CONTACTS GLOBAL LIST ═══ */
function ContactsGlobal({contacts,accounts,opps,onView,onAdd,onViewAccount}){
  const[search,setSearch]=useState("");
  const[fRole,setFRole]=useState("All");
  const[fAcct,setFAcct]=useState("All");
  const[view,setView]=useState("tile");
  const filtered=contacts.filter(c=>{
    if(fRole!=="All"&&c.role!==fRole)return false;
    if(fAcct!=="All"&&c.accountId!==fAcct)return false;
    if(search){const q=search.toLowerCase();return c.name?.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q);}
    return true;
  });
  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
      <div><h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Contacts</h1>
        <p style={{fontSize:13,color:"#64748b"}}>{filtered.length} of {contacts.length}</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><ViewToggle view={view} setView={setView}/><Btn onClick={onAdd}>+ New Contact</Btn></div>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email…" style={{flex:"1 1 200px",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
      <select value={fAcct} onChange={e=>setFAcct(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Accounts</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <select value={fRole} onChange={e=>setFRole(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Roles</option>{ROLES.map(r=><option key={r}>{r}</option>)}
      </select>
      {(fRole!=="All"||fAcct!=="All"||search)&&<button onClick={()=>{setFRole("All");setFAcct("All");setSearch("");}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff0f0",color:"#ef4444",cursor:"pointer"}}>✕ Clear</button>}
    </div>
    {view==="tile"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13}}>
      {filtered.map(c=>{
        const acct=accounts.find(a=>a.id===c.accountId),tm=AT_META[acct?.type]||AT_META.Prospect;
        return<div key={c.id} onClick={()=>onView(c)} style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 18px",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.09)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
            <Avatar name={c.name} size={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{c.title||c.role}</div>
            </div>
            {c.primary&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,flexShrink:0}}>Primary</span>}
          </div>
          {acct&&<div onClick={e=>{e.stopPropagation();onViewAccount(acct);}} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",background:"#f8fafc",borderRadius:8,marginBottom:10,cursor:"pointer"}}>
            <Avatar name={acct.name} size={20} color={tm.c} bg={tm.bg}/>
            <span style={{fontSize:12,color:"#6366f1",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acct.name}</span>
          </div>}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <span style={{background:"#f1f5f9",color:"#475569",borderRadius:6,padding:"2px 8px",fontSize:11}}>{c.role}</span>
            {c.email&&<a href={"mailto:"+c.email} onClick={e=>e.stopPropagation()} style={{color:"#6366f1",fontSize:11}}>{c.email}</a>}
          </div>
        </div>;})}
      {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:"#94a3b8",fontSize:14}}>No contacts match.</div>}
    </div>}
    {view==="list"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      {filtered.length===0?<div style={{padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:14}}>No contacts match.</div>
      :<div style={{overflowX:"auto"}}><table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc"}}>{["Name","Account","Title","Role","Phone","Email"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(c=>{
          const acct=accounts.find(a=>a.id===c.accountId),tm=AT_META[acct?.type]||AT_META.Prospect;
          return<tr key={c.id} style={{borderTop:"1px solid #f1f5f9",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"12px 16px"}} onClick={()=>onView(c)}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={c.name} size={30}/><div><div style={{fontWeight:600,color:"#0f172a"}}>{c.name}</div>{c.primary&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20}}>Primary</span>}</div></div></td>
            <td style={{padding:"12px 16px"}} onClick={()=>acct&&onViewAccount(acct)}>{acct&&<div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={acct.name} size={22} color={tm.c} bg={tm.bg}/><span style={{color:"#6366f1",fontWeight:500,fontSize:12}}>{acct.name}</span></div>}</td>
            <td style={{padding:"12px 16px",color:"#64748b"}} onClick={()=>onView(c)}>{c.title||"—"}</td>
            <td style={{padding:"12px 16px"}} onClick={()=>onView(c)}><span style={{background:"#f1f5f9",color:"#475569",borderRadius:6,padding:"2px 8px",fontSize:11}}>{c.role}</span></td>
            <td style={{padding:"12px 16px"}}><a href={"tel:"+c.phone} style={{color:"#334155",fontSize:12}}>{c.phone||"—"}</a></td>
            <td style={{padding:"12px 16px"}}><a href={"mailto:"+c.email} style={{color:"#6366f1",fontSize:12}}>{c.email||"—"}</a></td>
          </tr>;})}
        </tbody>
      </table></div>}
    </div>}
  </div>;
}

/* ═══ OPPORTUNITIES PIPELINE ═══ */
function OpportunitiesPipeline({opps,accounts,onAdd,onEdit,onDelete,onView}){
  const[fStage,setFStage]=useState("All");
  const[fAcct,setFAcct]=useState("All");
  const[view,setView]=useState("tile");
  const filtered=opps.filter(o=>{
    if(fStage!=="All"&&o.stage!==fStage)return false;
    if(fAcct!=="All"&&o.accountId!==fAcct)return false;
    return true;
  });
  const pipeline=filtered.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).reduce((s,o)=>s+oppTotal(o),0);
  const won=filtered.filter(o=>o.stage==="Closed Won").reduce((s,o)=>s+oppTotal(o),0);
  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
      <div><h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Opportunities</h1>
        <p style={{fontSize:13,color:"#64748b"}}>{filtered.length} opportunities · {currency(pipeline)} open · {currency(won)} won</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><ViewToggle view={view} setView={setView}/><Btn onClick={onAdd}>+ New Opportunity</Btn></div>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
      <select value={fStage} onChange={e=>setFStage(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Stages</option>{OPP_STAGES.map(s=><option key={s}>{s}</option>)}
      </select>
      <select value={fAcct} onChange={e=>setFAcct(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Accounts</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      {(fStage!=="All"||fAcct!=="All")&&<button onClick={()=>{setFStage("All");setFAcct("All");}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff0f0",color:"#ef4444",cursor:"pointer"}}>✕ Clear</button>}
    </div>
    {view==="tile"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:13}}>
      {filtered.map(o=>{
        const m=OS_META[o.stage],acct=accounts.find(a=>a.id===o.accountId),tm=AT_META[acct?.type]||AT_META.Prospect;
        const dur=o.startDate&&o.endDate?Math.max(0,Math.round((new Date(o.endDate)-new Date(o.startDate))/(1000*60*60*24*30.44))):null;
        return<div key={o.id} style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 18px",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.09)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>onView&&onView(o)}>
              <div style={{fontSize:14,fontWeight:700,color:"#6366f1",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3}}>{o.name}</div>
              <Tag text={o.stage} color={m.c} bg={m.bg}/>
            </div>
            <div style={{display:"flex",gap:5,marginLeft:10,flexShrink:0}}>
              <Btn sz="sm" v="ghost" onClick={e=>{e.stopPropagation();onEdit(o);}}>Edit</Btn>
              <Btn sz="sm" v="danger" onClick={e=>{e.stopPropagation();if(window.confirm("Remove?"))onDelete(o.id);}}>✕</Btn>
            </div>
          </div>
          {acct&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 10px",background:"#f8fafc",borderRadius:7}}><Avatar name={acct.name} size={20} color={tm.c} bg={tm.bg}/><span style={{fontSize:12,color:"#334155",fontWeight:500}}>{acct.name}</span></div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            {[["One-time",Number(o.oneTime)>0?currency(o.oneTime):"—"],["Recurring",Number(o.recurring)>0?`${currency(o.recurring)}/${o.recurringPeriod||"mo"}`:"—"],["Duration",dur!==null?`${dur} mo`:"—"],["Total",currency(oppTotal(o))]].map(([l,v])=>
              <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"7px 10px"}}><div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:l==="Total"?"#10b981":"#334155"}}>{v}</div></div>)}
          </div>
          <StageBar stage={o.stage}/>
          {o.probability!=null&&Number(o.probability)>0&&<div style={{marginTop:6,fontSize:11,color:"#94a3b8",textAlign:"right"}}>{o.probability}% · Close: {fmt(o.endDate)}</div>}
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
            <button onClick={()=>onView&&onView(o)} style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%"}}>View Details & Activities →</button>
          </div>
        </div>;})}
      {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:"#94a3b8",fontSize:14}}>No opportunities match.</div>}
    </div>}
    {view==="list"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      {filtered.length===0?<div style={{padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:14}}>No opportunities match.</div>
      :<div style={{overflowX:"auto"}}><table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc"}}>{["Opportunity","Account","Stage","One-time","Recurring","Total","Close","Prob.",""].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(o=>{
          const m=OS_META[o.stage],acct=accounts.find(a=>a.id===o.accountId);
          return<tr key={o.id} style={{borderTop:"1px solid #f1f5f9"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"11px 12px"}} onClick={()=>onView&&onView(o)}>
              <div style={{fontWeight:600,color:"#6366f1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200,cursor:"pointer"}}>{o.name}</div>
            </td>
            <td style={{padding:"11px 12px",color:"#64748b"}}>{acct?.name||"—"}</td>
            <td style={{padding:"11px 12px"}}><Tag text={o.stage} color={m.c} bg={m.bg}/></td>
            <td style={{padding:"11px 12px",fontWeight:600,color:"#334155"}}>{Number(o.oneTime)>0?currency(o.oneTime):"—"}</td>
            <td style={{padding:"11px 12px",color:"#64748b"}}>{Number(o.recurring)>0?`${currency(o.recurring)}/${o.recurringPeriod||"mo"}`:"—"}</td>
            <td style={{padding:"11px 12px",fontWeight:700,color:"#10b981"}}>{currency(oppTotal(o))}</td>
            <td style={{padding:"11px 12px",color:"#64748b"}}>{fmt(o.endDate)}</td>
            <td style={{padding:"11px 12px",color:"#94a3b8"}}>{o.probability!=null&&Number(o.probability)>0?o.probability+"%":"—"}</td>
            <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:5}}>
              <Btn sz="sm" v="indigo" onClick={()=>onView&&onView(o)}>Details</Btn>
              <Btn sz="sm" v="ghost" onClick={()=>onEdit(o)}>Edit</Btn>
              <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Remove?"))onDelete(o.id);}}>✕</Btn>
            </div></td>
          </tr>;})}
        </tbody>
      </table></div>}
    </div>}
  </div>;
}

/* ═══ DASHBOARD ═══ */
function Dashboard({accounts,contacts,opps,acts,onViewAccount}){
  const clients=accounts.filter(a=>a.type==="Client");
  const wonOpps=opps.filter(o=>o.stage==="Closed Won");
  const openOpps=opps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage));
  const wonRev=wonOpps.reduce((s,o)=>s+oppTotal(o),0);
  const pipelineVal=openOpps.reduce((s,o)=>s+oppTotal(o),0);
  const closedTotal=opps.filter(o=>["Closed Won","Closed Lost"].includes(o.stage)).length;
  const wr=closedTotal>0?Math.round((wonOpps.length/closedTotal)*100):0;
  const recent=[...acts].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,7);

  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{marginBottom:22}}>
      <h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Good day, Senthil 👋</h1>
      <p style={{fontSize:13,color:"#64748b"}}>Ensemble Digital Labs — Account & Opportunity Pipeline</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:12,marginBottom:22}}>
      <StatCard label="Won Revenue" value={currency(wonRev)} sub={`${wonOpps.length} closed deals`} color="#10b981"/>
      <StatCard label="Open Pipeline" value={currency(pipelineVal)} sub={`${openOpps.length} opportunities`} color="#6366f1"/>
      <StatCard label="Win Rate" value={`${wr}%`} sub="closed deals" color="#f59e0b"/>
      <StatCard label="Accounts" value={accounts.length} sub={`${clients.length} clients`} color="#0ea5e9"/>
      <StatCard label="Contacts" value={contacts.length} sub="across all accounts" color="#8b5cf6"/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:16}}>
      {/* Stage funnel */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:20}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:16}}>Pipeline by Stage</div>
        {OPP_STAGES.filter(s=>s!=="Closed Lost").map(s=>{
          const cnt=opps.filter(o=>o.stage===s).length;
          const val=opps.filter(o=>o.stage===s).reduce((a,o)=>a+oppTotal(o),0);
          const pct=opps.length>0?(cnt/opps.length)*100:0;
          const m=OS_META[s];
          return<div key={s} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#334155"}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:m.c,display:"inline-block"}}/>
                {s}
              </span>
              <span style={{fontSize:11,color:"#94a3b8"}}>{cnt} · {val>0?currency(val):""}</span>
            </div>
            <div style={{height:5,background:"#f1f5f9",borderRadius:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:m.c,borderRadius:10}}></div>
            </div>
          </div>;
        })}
      </div>

      {/* Recent activity */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:20}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:14}}>Recent Activity</div>
        {recent.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No activity yet.</div>}
        {recent.map(act=>{
          const acct=accounts.find(a=>a.id===act.accountId);
          const am=AM[act.type]||{e:"•"};
          return<div key={act.id} style={{display:"flex",gap:9,marginBottom:11,cursor:"pointer"}} onClick={()=>acct&&onViewAccount(acct)}>
            <div style={{width:26,height:26,borderRadius:7,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{am.e}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acct?.name||"?"}</div>
              <div style={{fontSize:11,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{act.description}</div>
            </div>
            <span style={{fontSize:10,color:"#94a3b8",flexShrink:0}}>{fmtS(act.date)}</span>
          </div>;
        })}
      </div>
    </div>

    {/* Accounts table */}
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:16}}>
      <div style={{padding:"13px 18px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>Top Accounts</span>
        <button onClick={()=>{}} style={{background:"none",border:"none",color:"#6366f1",fontSize:12,cursor:"pointer",fontWeight:600}}>View all →</button>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f8fafc"}}>
            {["Account","Primary Contact","Industry","Open Opps","Pipeline","Type","Status"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {accounts.filter(a=>a.status==="Active").slice(0,7).map(a=>{
              const tm=AT_META[a.type]||AT_META.Prospect;
              const sm=AS_META[a.status]||AS_META.Active;
              const pc=contacts.find(c=>c.accountId===a.id&&c.primary)||contacts.find(c=>c.accountId===a.id);
              const ao=opps.filter(o=>o.accountId===a.id&&!["Closed Won","Closed Lost"].includes(o.stage));
              const av=ao.reduce((s,o)=>s+oppTotal(o),0);
              return<tr key={a.id} onClick={()=>onViewAccount(a)} style={{cursor:"pointer",borderTop:"1px solid #f1f5f9"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <Avatar name={a.name} size={28} color={tm.c} bg={tm.bg}/>
                    <span style={{fontWeight:600,color:"#0f172a"}}>{a.name}</span>
                  </div>
                </td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{pc?.name||"—"}</td>
                <td style={{padding:"11px 14px",color:"#64748b"}}>{a.industry}</td>
                <td style={{padding:"11px 14px",color:"#64748b",textAlign:"center"}}>{ao.length}</td>
                <td style={{padding:"11px 14px",fontWeight:600,color:"#334155"}}>{av>0?currency(av):"—"}</td>
                <td style={{padding:"11px 14px"}}><Tag text={a.type} color={tm.c} bg={tm.bg}/></td>
                <td style={{padding:"11px 14px"}}><Tag text={a.status} color={sm.c} bg={sm.bg}/></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}

/* ═══ LEAD COMPONENTS ═══ */

function LeadForm({lead,onClose,onSave}){
  const[f,sf]=useState({
    firstName:lead?.firstName||"",lastName:lead?.lastName||"",
    company:lead?.company||"",title:lead?.title||"",
    email:lead?.email||"",phone:lead?.phone||"",
    source:lead?.source||LEAD_SOURCES[0],industry:lead?.industry||INDUSTRIES[0],
    status:lead?.status||"New",rating:lead?.rating||"Warm",
    assignedTo:lead?.assignedTo||TEAM[0],notes:lead?.notes||"",
  });
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  const save=()=>{
    if(!f.firstName.trim()||!f.company.trim())return alert("First name and company are required.");
    onSave(f);
  };
  return<Modal title={lead?"Edit Lead":"New Lead"} onClose={onClose} onSave={save}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Field label="First Name *" value={f.firstName} onChange={v=>set("firstName",v)}/>
      <Field label="Last Name" value={f.lastName} onChange={v=>set("lastName",v)}/>
      <Field label="Company *" value={f.company} onChange={v=>set("company",v)}/>
      <Field label="Job Title" value={f.title} onChange={v=>set("title",v)}/>
      <Field label="Email" value={f.email} onChange={v=>set("email",v)} type="email"/>
      <Field label="Phone" value={f.phone} onChange={v=>set("phone",v)}/>
      <Select label="Lead Source" value={f.source} onChange={v=>set("source",v)} options={LEAD_SOURCES}/>
      <Select label="Industry" value={f.industry} onChange={v=>set("industry",v)} options={INDUSTRIES}/>
      <Select label="Status" value={f.status} onChange={v=>set("status",v)} options={LEAD_STATUSES.filter(s=>s!=="Converted")}/>
      <Select label="Rating" value={f.rating} onChange={v=>set("rating",v)} options={LEAD_RATINGS}/>
      <Select label="Assigned To" value={f.assignedTo} onChange={v=>set("assignedTo",v)} options={TEAM}/>
    </div>
    <div style={{marginTop:14}}>
      <TextArea label="Notes" value={f.notes} onChange={v=>set("notes",v)} span={1}/>
    </div>
  </Modal>
}

function LeadConvertModal({lead,accounts,onClose,onConvert}){
  const today=new Date().toISOString().slice(0,10);
  const leadName=(lead.firstName||"")+" "+(lead.lastName||"");
  const[useExisting,setUseExisting]=useState(false);
  const[existAcctId,setExistAcctId]=useState(accounts[0]?accounts[0].id:"");
  const[acctName,setAcctName]=useState(lead.company||"");
  const[acctIndustry,setAcctIndustry]=useState(lead.industry||INDUSTRIES[0]);
  const[conName,setConName]=useState(leadName.trim());
  const[conTitle,setConTitle]=useState(lead.title||"");
  const[conEmail,setConEmail]=useState(lead.email||"");
  const[conPhone,setConPhone]=useState(lead.phone||"");
  const[createOpp,setCreateOpp]=useState(true);
  const[oppName,setOppName]=useState((lead.company||"New Account")+" – Initial Engagement");
  const[oppStage,setOppStage]=useState("Prospecting");
  const[oppOneTime,setOppOneTime]=useState("");
  const[oppRecurring,setOppRecurring]=useState("");

  function doConvert(){
    if(!useExisting&&!acctName.trim())return alert("Account name required.");
    if(!conName.trim())return alert("Contact name required.");
    if(createOpp&&!oppName.trim())return alert("Opportunity name required.");
    const newAcctId=useExisting?existAcctId:uid();
    const newConId=uid();
    const newOppId=createOpp?uid():null;
    onConvert({
      newAcctId,newConId,newOppId,useExisting,
      acct:{id:newAcctId,name:acctName,industry:acctIndustry,type:"Prospect",status:"Active",website:"",phone:lead.phone||"",address:"",assignedTo:lead.assignedTo||TEAM[0],notes:"Converted from lead: "+leadName,createdAt:today},
      contact:{id:newConId,accountId:newAcctId,name:conName,title:conTitle,email:conEmail,phone:conPhone,dept:"Executive",role:"Decision Maker",primary:true,createdAt:today},
      opp:createOpp?{id:newOppId,accountId:newAcctId,name:oppName,stage:oppStage,oneTime:Number(oppOneTime)||0,recurring:Number(oppRecurring)||0,recurringPeriod:"Monthly",startDate:today,endDate:"",probability:30,notes:"",createdAt:today}:null,
    });
  }

  return<Modal title="Convert Lead to Account" onClose={onClose} onSave={doConvert} wide>
    <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:24}}>⚡</div>
      <div>
        <div style={{fontWeight:700,color:"#6d28d9",fontSize:14}}>{leadName.trim()||lead.company}</div>
        <div style={{fontSize:12,color:"#7c3aed"}}>{lead.company}{lead.title?" · "+lead.title:""}</div>
      </div>
    </div>

    <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:10}}>1. Account</div>
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <button onClick={()=>setUseExisting(false)}
        style={{flex:1,padding:"9px",borderRadius:8,border:"1.5px solid "+(useExisting?"#e2e8f0":"#6366f1"),background:useExisting?"#fff":"#eef2ff",color:useExisting?"#64748b":"#4338ca",fontSize:12,fontWeight:600,cursor:"pointer"}}>
        Create new account
      </button>
      <button onClick={()=>setUseExisting(true)}
        style={{flex:1,padding:"9px",borderRadius:8,border:"1.5px solid "+(useExisting?"#6366f1":"#e2e8f0"),background:useExisting?"#eef2ff":"#fff",color:useExisting?"#4338ca":"#64748b",fontSize:12,fontWeight:600,cursor:"pointer"}}>
        Link existing account
      </button>
    </div>
    {useExisting
      ?<div style={{marginBottom:16}}>
        <Lbl>Select Account</Lbl>
        <select value={existAcctId} onChange={e=>setExistAcctId(e.target.value)}
          style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Field label="Account Name *" value={acctName} onChange={setAcctName} span={2}/>
        <Select label="Industry" value={acctIndustry} onChange={setAcctIndustry} options={INDUSTRIES}/>
      </div>
    }

    <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14,marginBottom:10}}>
      <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:10}}>2. Contact</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Contact Name *" value={conName} onChange={setConName} span={2}/>
        <Field label="Job Title" value={conTitle} onChange={setConTitle}/>
        <Field label="Email" value={conEmail} onChange={setConEmail} type="email"/>
        <Field label="Phone" value={conPhone} onChange={setConPhone}/>
      </div>
    </div>

    <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>3. Opportunity</div>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#64748b",cursor:"pointer"}}>
          <input type="checkbox" checked={createOpp} onChange={e=>setCreateOpp(e.target.checked)} style={{cursor:"pointer"}}/>
          Create opportunity
        </label>
      </div>
      {createOpp&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Opportunity Name *" value={oppName} onChange={setOppName} span={2}/>
        <Select label="Stage" value={oppStage} onChange={setOppStage} options={OPP_STAGES}/>
        <Field label="One-time Value ($)" value={oppOneTime} onChange={setOppOneTime} type="number" placeholder="0"/>
        <Field label="Monthly Recurring ($)" value={oppRecurring} onChange={setOppRecurring} type="number" placeholder="0"/>
      </div>}
    </div>
  </Modal>
}

function LeadDetail({lead,convertedAccount,leadActs,leadProposals,onBack,onEdit,onDelete,onStatusChange,onConvert,onSaveAct,onDeleteAct,onSaveProposal,onEditProposal,onDeleteProposal}){
  const fullName=(lead.firstName||"")+" "+(lead.lastName||"");
  const lm=LS_META[lead.status]||LS_META.New;
  const rm=LR_META[lead.rating]||LR_META.Warm;
  const[tab,setTab]=useState("details");
  return<div style={{padding:"24px",maxWidth:900,margin:"0 auto"}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",gap:4}}>&#8592; Leads</button>
    {lead.isConverted&&<div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:20}}>&#9889;</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,color:"#6d28d9",marginBottom:2}}>This lead has been converted</div>
        <div style={{fontSize:12,color:"#7c3aed"}}>{convertedAccount?"Linked account: "+convertedAccount.name:"Converted on "+lead.convertedAt}</div>
      </div>
      {convertedAccount&&<span style={{fontSize:12,color:"#6d28d9",fontWeight:600,cursor:"pointer",background:"#ede9fe",padding:"4px 12px",borderRadius:20}}>View Account</span>}
    </div>}
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"22px 26px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <Avatar name={fullName.trim()||lead.company} size={46} color={lm.c} bg={lm.bg}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
              <span style={{fontSize:20,fontWeight:700,color:"#0f172a"}}>{fullName.trim()}</span>
              <Tag text={lead.status} color={lm.c} bg={lm.bg}/>
              <Tag text={lead.rating} color={rm.c} bg={rm.bg}/>
            </div>
            <div style={{fontSize:13,color:"#64748b"}}>{lead.title&&lead.title+" "}{lead.company}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {!lead.isConverted&&<Btn v="indigo" onClick={()=>onConvert(lead)}>&#9889; Convert Lead</Btn>}
          {!lead.isConverted&&<Btn v="ghost" onClick={onEdit}>Edit</Btn>}
          <Btn v="danger" onClick={()=>{if(window.confirm("Delete this lead?"))onDelete();}}>Delete</Btn>
        </div>
      </div>
      {!lead.isConverted&&<div style={{marginBottom:16}}>
        <Lbl>Status</Lbl>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
          {LEAD_STATUSES.filter(s=>s!=="Converted").map(s=>{
            const m=LS_META[s],active=lead.status===s;
            return<button key={s} onClick={()=>onStatusChange(s)}
              style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid "+(active?m.c:"#e2e8f0"),background:active?m.bg:"#fff",color:active?m.c:"#94a3b8",fontSize:12,fontWeight:active?700:400,cursor:"pointer"}}>
              {s}
            </button>;
          })}
        </div>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        {[["Company",lead.company],["Industry",lead.industry||""],["Source",lead.source],["Assigned",lead.assignedTo],["Phone",lead.phone||""],["Email",lead.email||""],["Created",lead.createdAt]].map(function(pair){
          return<div key={pair[0]} style={{background:"#f8fafc",borderRadius:9,padding:"10px 12px"}}>
            <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{pair[0]}</div>
            <div style={{fontSize:13,fontWeight:600,color:"#334155",wordBreak:"break-all"}}>{pair[1]||"—"}</div>
          </div>;
        })}
      </div>
      {lead.notes&&<div style={{marginTop:14,padding:"11px 14px",background:"#fffbeb",border:"1px solid #fef3c7",borderRadius:9}}>
        <div style={{fontSize:9,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>Notes</div>
        <div style={{fontSize:13,color:"#78350f",lineHeight:1.6}}>{lead.notes}</div>
      </div>}
    </div>
    <div style={{display:"flex",gap:2,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:3,width:"fit-content",marginBottom:16}}>
      {[["details","Details"],["activities","Activities ("+leadActs.length+")"],["proposals","Proposals ("+leadProposals.length+")"]].map(function(pair){
        var k=pair[0],lbl=pair[1],active=tab===k;
        return<button key={k} onClick={function(){setTab(k);}}
          style={{padding:"7px 16px",borderRadius:7,border:"none",background:active?"#6366f1":"transparent",color:active?"#fff":"#64748b",fontSize:12,fontWeight:active?600:400,cursor:"pointer",whiteSpace:"nowrap"}}>
          {lbl}
        </button>;
      })}
    </div>
    {tab==="details"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"20px 22px"}}>
      <div style={{fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:14}}>Lead Details</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        {[["First Name",lead.firstName||""],["Last Name",lead.lastName||""],["Company",lead.company],["Job Title",lead.title||""],["Email",lead.email||""],["Phone",lead.phone||""],["Lead Source",lead.source],["Industry",lead.industry||""],["Status",lead.status],["Rating",lead.rating],["Assigned To",lead.assignedTo],["Created",lead.createdAt]].map(function(pair){
          return<div key={pair[0]}>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{pair[0]}</div>
            <div style={{fontSize:13,color:"#334155",fontWeight:500}}>{pair[1]||"—"}</div>
          </div>;
        })}
      </div>
      {lead.notes&&<div style={{marginTop:16,paddingTop:16,borderTop:"1px solid #f1f5f9"}}>
        <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Notes</div>
        <div style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>{lead.notes}</div>
      </div>}
    </div>}
    {tab==="activities"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"20px 22px"}}>
      <LeadActivitiesPanel acts={leadActs} onAdd={function(d){onSaveAct({...d,leadId:lead.id});}} onDelete={onDeleteAct}/>
    </div>}
    {tab==="proposals"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"20px 22px"}}>
      <LeadProposalsPanel proposals={leadProposals} onAdd={function(d){onSaveProposal({...d,leadId:lead.id});}} onEdit={onEditProposal} onDelete={onDeleteProposal}/>
    </div>}
  </div>
}


function LeadsList({leads,onView,onAdd,onConvert}){
  const[search,setSearch]=useState("");
  const[fStatus,setFStatus]=useState("All");
  const[fRating,setFRating]=useState("All");
  const[showConverted,setShowConverted]=useState(false);
  const[view,setView]=useState("tile");
  const filtered=leads.filter(function(l){
    if(!showConverted&&l.isConverted)return false;
    if(fStatus!=="All"&&l.status!==fStatus)return false;
    if(fRating!=="All"&&l.rating!==fRating)return false;
    if(search){var q=search.toLowerCase();return(l.firstName+" "+l.lastName).toLowerCase().includes(q)||(l.company||"").toLowerCase().includes(q)||(l.email||"").toLowerCase().includes(q);}
    return true;
  });
  const active=leads.filter(l=>!l.isConverted),hot=active.filter(l=>l.rating==="Hot").length,converted=leads.filter(l=>l.isConverted).length;
  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
      <div><h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Leads</h1>
        <p style={{fontSize:13,color:"#64748b"}}>{active.length} active · {hot} hot · {converted} converted</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><ViewToggle view={view} setView={setView}/><Btn onClick={onAdd}>+ New Lead</Btn></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:18}}>
      {LEAD_STATUSES.filter(s=>s!=="Converted").map(function(s){
        const m=LS_META[s],cnt=leads.filter(l=>l.status===s&&!l.isConverted).length;
        return<div key={s} style={{background:"#fff",borderRadius:10,border:"1.5px solid "+(fStatus===s?m.c:"#e2e8f0"),padding:"10px 14px",cursor:"pointer"}} onClick={()=>setFStatus(fStatus===s?"All":s)}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><span style={{width:7,height:7,borderRadius:"50%",background:m.c,display:"inline-block"}}></span><span style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>{s}</span></div>
          <div style={{fontSize:20,fontWeight:700,color:m.c}}>{cnt}</div>
        </div>;})}
      <div style={{background:"#f5f3ff",borderRadius:10,border:"1px solid #ddd6fe",padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><span style={{width:7,height:7,borderRadius:"50%",background:"#7c3aed",display:"inline-block"}}></span><span style={{fontSize:9,color:"#7c3aed",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Converted</span></div>
        <div style={{fontSize:20,fontWeight:700,color:"#7c3aed"}}>{converted}</div>
      </div>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, company, email…" style={{flex:"1 1 200px",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
      <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Statuses</option>{LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}
      </select>
      <select value={fRating} onChange={e=>setFRating(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Ratings</option>{LEAD_RATINGS.map(r=><option key={r}>{r}</option>)}
      </select>
      <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#475569",cursor:"pointer",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff"}}>
        <input type="checkbox" checked={showConverted} onChange={e=>setShowConverted(e.target.checked)} style={{cursor:"pointer"}}/>Show converted
      </label>
    </div>
    {view==="tile"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:13}}>
      {filtered.map(function(lead){
        var lm=LS_META[lead.status]||LS_META.New,rm=LR_META[lead.rating]||LR_META.Warm;
        var fullName=((lead.firstName||"")+" "+(lead.lastName||"")).trim();
        return<div key={lead.id} style={{background:"#fff",borderRadius:14,border:"1px solid "+(lead.isConverted?"#ddd6fe":"#e2e8f0"),padding:"16px 18px",cursor:"pointer",opacity:lead.isConverted?0.88:1}}
          onClick={()=>onView(lead)} onMouseEnter={function(e){e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.09)";}} onMouseLeave={function(e){e.currentTarget.style.boxShadow="none";}}>
          {lead.isConverted&&<div style={{fontSize:10,color:"#7c3aed",fontWeight:700,letterSpacing:".05em",marginBottom:8,background:"#ede9fe",padding:"2px 8px",borderRadius:20,display:"inline-block"}}>CONVERTED</div>}
          <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
            <Avatar name={fullName||lead.company} size={36} color={lm.c} bg={lm.bg}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fullName||lead.company}</div><div style={{fontSize:12,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lead.title?lead.title+" · ":""}{lead.company}</div></div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}><Tag text={lead.status} color={lm.c} bg={lm.bg}/><Tag text={lead.rating} color={rm.c} bg={rm.bg}/><span style={{background:"#f1f5f9",color:"#475569",borderRadius:6,padding:"2px 8px",fontSize:11}}>{lead.source}</span></div>
          <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:"#64748b"}}>{lead.industry||"—"} · {lead.assignedTo}</span>
            {!lead.isConverted&&<button onClick={function(e){e.stopPropagation();onConvert(lead);}} style={{background:"#f5f3ff",border:"1px solid #ddd6fe",color:"#7c3aed",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:600,cursor:"pointer"}}>Convert ⚡</button>}
          </div>
        </div>;})}
      {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:"#94a3b8",fontSize:14}}>No leads match your filters.</div>}
    </div>}
    {view==="list"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      {filtered.length===0?<div style={{padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:14}}>No leads match.</div>
      :<div style={{overflowX:"auto"}}><table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc"}}>{["Name","Company","Status","Rating","Source","Industry","Assigned",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(function(lead){
          var lm=LS_META[lead.status]||LS_META.New,rm=LR_META[lead.rating]||LR_META.Warm;
          var fullName=((lead.firstName||"")+" "+(lead.lastName||"")).trim();
          return<tr key={lead.id} style={{borderTop:"1px solid #f1f5f9",cursor:"pointer",opacity:lead.isConverted?0.75:1}}
            onClick={()=>onView(lead)} onMouseEnter={function(e){e.currentTarget.style.background="#f8fafc";}} onMouseLeave={function(e){e.currentTarget.style.background="";}}>
            <td style={{padding:"11px 14px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={fullName||lead.company} size={28} color={lm.c} bg={lm.bg}/><div><div style={{fontWeight:600,color:"#0f172a"}}>{fullName||lead.company}</div>{lead.isConverted&&<span style={{background:"#ede9fe",color:"#7c3aed",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20}}>Converted</span>}</div></div></td>
            <td style={{padding:"11px 14px",color:"#64748b"}}>{lead.company}</td>
            <td style={{padding:"11px 14px"}}><Tag text={lead.status} color={lm.c} bg={lm.bg}/></td>
            <td style={{padding:"11px 14px"}}><Tag text={lead.rating} color={rm.c} bg={rm.bg}/></td>
            <td style={{padding:"11px 14px",color:"#64748b"}}>{lead.source}</td>
            <td style={{padding:"11px 14px",color:"#64748b"}}>{lead.industry||"—"}</td>
            <td style={{padding:"11px 14px",color:"#64748b"}}>{lead.assignedTo}</td>
            <td style={{padding:"11px 14px"}} onClick={function(e){e.stopPropagation();}}>{!lead.isConverted&&<button onClick={function(e){e.stopPropagation();onConvert(lead);}} style={{background:"#f5f3ff",border:"1px solid #ddd6fe",color:"#7c3aed",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>Convert ⚡</button>}</td>
          </tr>;})}
        </tbody>
      </table></div>}
    </div>}
  </div>
}


const SVGICONS={
  dashboard:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>',
  leads:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  accounts:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  contacts:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  opportunities:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
  plus:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  chevL:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
  chevR:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  activities:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  users:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  contracts:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  signout:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
};

/* ═══ ACTIVITIES GLOBAL ═══ */
function ActivitiesGlobal({acts,accounts,onAdd,onDelete,onViewAccount,onSaveAct}){
  const[view,setView]=useState("list");
  const[search,setSearch]=useState("");
  const[fType,setFType]=useState("All");
  const[fAcct,setFAcct]=useState("All");
  const[showAF,setShowAF]=useState(false);
  const[calYear,setCalYear]=useState(new Date().getFullYear());
  const[calMonth,setCalMonth]=useState(new Date().getMonth());

  const sorted=[...acts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const filtered=sorted.filter(a=>{
    if(fType!=="All"&&a.type!==fType)return false;
    if(fAcct!=="All"&&a.accountId!==fAcct)return false;
    if(search){const q=search.toLowerCase();return a.description?.toLowerCase().includes(q)||a.type?.toLowerCase().includes(q);}
    return true;
  });
  const typeCounts=ACT_TYPES.reduce((acc,t)=>{acc[t]=acts.filter(a=>a.type===t).length;return acc;},{});
  const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  /* build calendar grid */
  function buildCalDays(yr,mo){
    const first=new Date(yr,mo,1).getDay();
    const total=new Date(yr,mo+1,0).getDate();
    const cells=[];
    for(let i=0;i<first;i++)cells.push(null);
    for(let d=1;d<=total;d++)cells.push(d);
    while(cells.length%7!==0)cells.push(null);
    return cells;
  }
  const calDays=buildCalDays(calYear,calMonth);
  const actsByDate={};
  acts.forEach(a=>{
    const key=a.date;
    if(!actsByDate[key])actsByDate[key]=[];
    actsByDate[key].push(a);
  });
  const today=new Date();
  const [calSelDay,setCalSelDay]=useState(null);
  const calSelKey=calSelDay!=null?`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(calSelDay).padStart(2,"0")}`:null;
  const selDayActs=calSelKey?( actsByDate[calSelKey]||[]):[];

  return<div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>Activities</h1>
        <p style={{fontSize:13,color:"#64748b"}}>{acts.length} total · {filtered.length} shown</p>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {/* View Toggle */}
        <div style={{display:"flex",background:"#f1f5f9",borderRadius:8,padding:3,gap:2}}>
          {[["list","📋 List"],["calendar","📅 Calendar"]].map(([v,lbl])=><button key={v} onClick={()=>setView(v)}
            style={{padding:"5px 14px",borderRadius:6,border:"none",background:view===v?"#fff":"transparent",color:view===v?"#6366f1":"#64748b",fontSize:12,fontWeight:view===v?700:400,cursor:"pointer",boxShadow:view===v?"0 1px 3px rgba(0,0,0,0.08)":"none",whiteSpace:"nowrap"}}>{lbl}</button>)}
        </div>
        <Btn onClick={()=>setShowAF(true)}>+ Log Activity</Btn>
      </div>
    </div>

    {/* Type summary pills */}
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
      {ACT_TYPES.map(t=>{
        const am=AM[t]||{e:"•"};
        const cnt=typeCounts[t]||0;
        const active=fType===t;
        return<button key={t} onClick={()=>setFType(active?"All":t)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:20,border:"1.5px solid "+(active?"#6366f1":"#e2e8f0"),background:active?"#6366f1":"#fff",color:active?"#fff":"#64748b",cursor:"pointer",fontSize:12,fontWeight:active?700:400,transition:"all .15s"}}>
          <span style={{fontSize:14}}>{am.e}</span>{t}<span style={{fontSize:11,fontWeight:700,background:active?"rgba(255,255,255,0.25)":"#f1f5f9",borderRadius:10,padding:"1px 6px",marginLeft:2}}>{cnt}</span>
        </button>;
      })}
    </div>

    {/* Filters */}
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search activities…"
        style={{flex:"1 1 200px",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
      <select value={fAcct} onChange={e=>setFAcct(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
        <option value="All">All Accounts</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      {(fType!=="All"||fAcct!=="All"||search)&&<button onClick={()=>{setFType("All");setFAcct("All");setSearch("");}}
        style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fecdd3",fontSize:13,background:"#fff0f0",color:"#ef4444",cursor:"pointer",fontWeight:600}}>✕ Clear</button>}
    </div>

    {/* ── LIST VIEW ── */}
    {view==="list"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      {filtered.length===0&&<div style={{padding:"48px 0",textAlign:"center",color:"#94a3b8",fontSize:14}}>No activities match.</div>}
      {filtered.map((act,i)=>{
        const am=AM[act.type]||{e:"•"};
        const acct=accounts.find(a=>a.id===act.accountId);
        return<div key={act.id}
          style={{display:"flex",gap:14,padding:"15px 20px",borderBottom:i<filtered.length-1?"1px solid #f1f5f9":"none",alignItems:"flex-start"}}
          onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
          <div style={{width:40,height:40,borderRadius:11,background:"#f1f5f9",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{am.e}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:3}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,fontWeight:700,color:"#334155"}}>{act.type}</span>
                {acct&&<span onClick={()=>onViewAccount(acct)}
                  style={{fontSize:11,color:"#6366f1",fontWeight:600,cursor:"pointer",padding:"2px 9px",background:"#eef2ff",borderRadius:20}}>{acct.name}</span>}
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                <span style={{fontSize:11,color:"#94a3b8"}}>{fmt(act.date)}</span>
                <button onClick={()=>{if(window.confirm("Remove activity?"))onDelete(act.id);}}
                  style={{background:"none",border:"none",color:"#ef4444",fontSize:12,cursor:"pointer",padding:0}}>✕</button>
              </div>
            </div>
            <div style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>{act.description}</div>
          </div>
        </div>;
      })}
    </div>}

    {/* ── CALENDAR VIEW ── */}
    {view==="calendar"&&<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16,alignItems:"start"}}>
      {/* Month grid */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        {/* Nav header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #f1f5f9"}}>
          <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);setCalSelDay(null);}}
            style={{background:"#f1f5f9",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:14,color:"#334155",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <span style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);setCalSelDay(null);}}
            style={{background:"#f1f5f9",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:14,color:"#334155",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </div>
        {/* Day names */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>
          {DAY_NAMES.map(d=><div key={d} style={{textAlign:"center",padding:"8px 0",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".05em"}}>{d}</div>)}
        </div>
        {/* Days grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {calDays.map((d,i)=>{
            if(d===null)return<div key={"e"+i} style={{minHeight:70,borderRight:i%7!==6?"1px solid #f1f5f9":"none",borderBottom:"1px solid #f1f5f9",background:"#fafafa"}}></div>;
            const key=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const dayActs=actsByDate[key]||[];
            const isToday=today.getFullYear()===calYear&&today.getMonth()===calMonth&&today.getDate()===d;
            const isSel=calSelDay===d;
            return<div key={d} onClick={()=>setCalSelDay(isSel?null:d)}
              style={{minHeight:70,padding:"6px 5px",borderRight:i%7!==6?"1px solid #f1f5f9":"none",borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:isSel?"#eef2ff":"#fff",transition:"background .1s"}}
              onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="#f8fafc";}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="#fff";}}>
              <div style={{fontSize:12,fontWeight:isToday?700:400,color:isToday?"#fff":"#334155",width:22,height:22,borderRadius:"50%",background:isToday?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:3}}>{d}</div>
              {dayActs.slice(0,3).map((a,ai)=>{
                const am=AM[a.type]||{e:"•"};
                return<div key={a.id} style={{fontSize:9,background:"#eef2ff",color:"#4338ca",borderRadius:4,padding:"1px 5px",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600}}>
                  {am.e} {a.type}
                </div>;
              })}
              {dayActs.length>3&&<div style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>+{dayActs.length-3} more</div>}
            </div>;
          })}
        </div>
      </div>

      {/* Day detail panel */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",position:"sticky",top:0}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>
            {calSelDay?`${MONTH_NAMES[calMonth]} ${calSelDay}, ${calYear}`:"Select a day"}
          </div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
            {calSelKey?(actsByDate[calSelKey]||[]).length+" activities":"Click a day to view activities"}</div>
        </div>
        {calSelDay&&selDayActs.length===0&&<div style={{padding:"32px 18px",textAlign:"center",color:"#94a3b8",fontSize:13}}>No activities on this day.</div>}
        {selDayActs.map((act,i)=>{
          const am=AM[act.type]||{e:"•"};
          const acct=accounts.find(a=>a.id===act.accountId);
          return<div key={act.id} style={{padding:"13px 18px",borderBottom:i<selDayActs.length-1?"1px solid #f1f5f9":"none"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:9,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{am.e}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#334155",marginBottom:2}}>{act.type}</div>
                {acct&&<div style={{fontSize:11,color:"#6366f1",fontWeight:600,marginBottom:4,cursor:"pointer"}} onClick={()=>onViewAccount(acct)}>{acct.name}</div>}
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{act.description}</div>
              </div>
            </div>
          </div>;
        })}
        {!calSelDay&&<div style={{padding:"20px 18px"}}>
          {/* mini month summary */}
          {Object.entries(actsByDate).filter(([k])=>k.startsWith(`${calYear}-${String(calMonth+1).padStart(2,"0")}`)).length===0
            ?<div style={{textAlign:"center",color:"#94a3b8",fontSize:13}}>No activities this month.</div>
            :<div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".05em",marginBottom:10}}>This month</div>
              {Object.entries(actsByDate).filter(([k])=>k.startsWith(`${calYear}-${String(calMonth+1).padStart(2,"0")}`))
                .sort(([a],[b])=>a.localeCompare(b)).slice(0,5).map(([k,dayActs])=><div key={k} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",width:22,textAlign:"right"}}>{parseInt(k.split("-")[2])}</div>
                  <div style={{flex:1}}>
                    {dayActs.slice(0,2).map(a=>{const am=AM[a.type]||{e:"•"};return<div key={a.id} style={{fontSize:11,color:"#334155"}}>{am.e} {a.type}</div>;})}
                    {dayActs.length>2&&<div style={{fontSize:10,color:"#94a3b8"}}>+{dayActs.length-2} more</div>}
                  </div>
                </div>)}
            </div>}
        </div>}
      </div>
    </div>}

    {showAF&&<ActivityForm accounts={accounts} onClose={()=>setShowAF(false)}
      onSave={d=>{onSaveAct({...d,id:uid(),accountId:d.accountId,createdAt:d.date});setShowAF(false);}}/>}
  </div>;
}

/* ═══ OPPORTUNITY DETAIL ═══ */
function OppDetail({opp,account,acts,allAccounts,onBack,onEdit,onDelete,onSaveAct,onDeleteAct}){
  const[showAF,setShowAF]=useState(false);
  const m=OS_META[opp.stage];
  const tm=AT_META[account?.type]||AT_META.Prospect;
  const dur=opp.startDate&&opp.endDate?Math.max(0,Math.round((new Date(opp.endDate)-new Date(opp.startDate))/(1000*60*60*24*30.44))):null;
  const childActs=[...acts].filter(a=>a.oppId===opp.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const accountActs=[...acts].filter(a=>a.accountId===opp.accountId&&a.oppId!==opp.id).sort((a,b)=>new Date(b.date)-new Date(a.date));

  return<div style={{padding:"22px 24px",maxWidth:980,margin:"0 auto"}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",gap:4}}>← Opportunities</button>

    {/* Header card */}
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"22px 26px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}>
            <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a"}}>{opp.name}</h2>
            <Tag text={opp.stage} color={m.c} bg={m.bg}/>
            {opp.probability!=null&&Number(opp.probability)>0&&<span style={{fontSize:12,color:"#94a3b8",background:"#f8fafc",borderRadius:20,padding:"2px 9px"}}>{opp.probability}% probability</span>}
          </div>
          {account&&<div style={{display:"flex",alignItems:"center",gap:7}}>
            <Avatar name={account.name} size={22} color={tm.c} bg={tm.bg}/>
            <span style={{fontSize:13,color:"#64748b",fontWeight:500}}>{account.name}</span>
          </div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={()=>{if(window.confirm("Delete this opportunity?"))onDelete(opp.id);}}>Delete</Btn>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:14}}>
        {[
          ["One-time",Number(opp.oneTime)>0?currency(opp.oneTime):"—"],
          ["Recurring",Number(opp.recurring)>0?`${currency(opp.recurring)}/${opp.recurringPeriod||"mo"}`:"—"],
          ["Duration",dur!=null?`${dur} mo`:"—"],
          ["Total Value",currency(oppTotal(opp))],
          ["Start",fmt(opp.startDate)],
          ["Close / End",fmt(opp.endDate)],
        ].map(([l,v])=><div key={l} style={{background:"#f8fafc",borderRadius:9,padding:"10px 12px"}}>
          <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div>
          <div style={{fontSize:13,fontWeight:700,color:l==="Total Value"?"#10b981":"#334155"}}>{v}</div>
        </div>)}
      </div>
      <StageBar stage={opp.stage}/>
      {opp.notes&&<div style={{marginTop:12,padding:"11px 14px",background:"#fffbeb",border:"1px solid #fef3c7",borderRadius:9}}>
        <div style={{fontSize:9,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>NOTES</div>
        <div style={{fontSize:13,color:"#78350f",lineHeight:1.6}}>{opp.notes}</div>
      </div>}
    </div>

    {/* Activities card */}
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
      <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>Activities</span>
          <span style={{marginLeft:8,fontSize:12,color:"#94a3b8"}}>{childActs.length} linked to this opportunity</span>
        </div>
        <Btn sz="sm" onClick={()=>setShowAF(true)}>+ Log Activity</Btn>
      </div>
      <div style={{padding:"6px 20px 16px"}}>

        {/* Linked activities */}
        {childActs.length>0&&<>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 0 8px"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#6366f1",display:"inline-block"}}></span>
            <span style={{fontSize:10,fontWeight:700,color:"#6366f1",textTransform:"uppercase",letterSpacing:".07em"}}>Linked to this opportunity ({childActs.length})</span>
          </div>
          {childActs.map((act,i)=>{
            const am=AM[act.type]||{e:"•"};
            return<div key={act.id} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i<childActs.length-1?"1px solid #f1f5f9":"none",background:"transparent"}}
              onMouseEnter={e=>e.currentTarget.style.background="#fafbff"} onMouseLeave={e=>e.currentTarget.style.background=""}>
              <div style={{width:36,height:36,borderRadius:9,background:"#eef2ff",border:"1px solid #c7d2fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{am.e}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,gap:8}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#334155"}}>{act.type}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    <span style={{fontSize:11,color:"#94a3b8"}}>{fmt(act.date)}</span>
                    <button onClick={()=>{if(window.confirm("Remove activity?"))onDeleteAct(act.id);}}
                      style={{background:"none",border:"none",color:"#ef4444",fontSize:11,cursor:"pointer",padding:0}}>✕</button>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#64748b",lineHeight:1.5}}>{act.description}</div>
              </div>
            </div>;
          })}
        </>}

        {childActs.length===0&&<div style={{padding:"24px 0 8px",textAlign:"center",color:"#94a3b8",fontSize:13,background:"#fafbff",borderRadius:10,marginTop:8}}>
          No activities linked yet — click <b>+ Log Activity</b> to connect one to this opportunity.
        </div>}

        {/* Account-level activities */}
        {accountActs.length>0&&<>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"16px 0 8px",marginTop:8,borderTop:"1px solid #f1f5f9"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#94a3b8",display:"inline-block"}}></span>
            <span style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".07em"}}>Other account activities ({accountActs.length})</span>
          </div>
          {accountActs.map((act,i)=>{
            const am=AM[act.type]||{e:"•"};
            return<div key={act.id} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<accountActs.length-1?"1px solid #f1f5f9":"none",opacity:.75}}
              onMouseEnter={e=>{e.currentTarget.style.opacity="1";}} onMouseLeave={e=>{e.currentTarget.style.opacity=".75";}}>
              <div style={{width:34,height:34,borderRadius:9,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{am.e}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#334155"}}>{act.type}</span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>{fmt(act.date)}</span>
                </div>
                <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{act.description}</div>
              </div>
            </div>;
          })}
        </>}
      </div>
    </div>

    {showAF&&<ActivityForm accountId={opp.accountId} oppId={opp.id} accounts={allAccounts} onClose={()=>setShowAF(false)}
      onSave={d=>{onSaveAct({...d,id:uid(),accountId:opp.accountId,oppId:opp.id,createdAt:d.date});setShowAF(false);}}/>}
  </div>;
}

/* ═══ LOGIN SCREEN ═══ */

function LoginScreen({users,onLogin}){
  const[username,setUsername]=useState("");
  const[password,setPassword]=useState("");
  const[showPw,setShowPw]=useState(false);
  const[err,setErr]=useState("");
  const[busy,setBusy]=useState(false);
  const[mounted,setMounted]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>setMounted(true),50);return()=>clearTimeout(t);},[]);

  function attempt(e){
    e&&e.preventDefault();
    setErr("");
    if(!username.trim()||!password.trim()){setErr("Please enter your username and password.");return;}
    setBusy(true);
    setTimeout(()=>{
      const allUsers=[DEFAULT_ADMIN,...(users||[])];
      const match=allUsers.find(u=>u.username.toLowerCase()===username.trim().toLowerCase()&&u.password===password.trim());
      if(!match){setErr("Incorrect username or password.");setBusy(false);return;}
      if(match.status==="Inactive"){setErr("This account is inactive. Contact your Administrator.");setBusy(false);return;}
      onLogin({...match,lastLogin:new Date().toISOString().slice(0,10)});
    },550);
  }

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .enl-login * { box-sizing:border-box; }
        .enl-login { font-family:'Plus Jakarta Sans',system-ui,sans-serif; }

        @keyframes enl-in    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes enl-left  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes enl-right { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes enl-orb1  { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(18px,-22px) scale(1.06)} }
        @keyframes enl-orb2  { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(-14px,18px) scale(.94)} }
        @keyframes enl-orb3  { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(10px,12px) scale(1.04)} }
        @keyframes enl-dot   { 0%,100%{opacity:.5;transform:scale(1)}        50%{opacity:1;transform:scale(1.25)} }
        @keyframes enl-bar   { 0%{width:0%} 100%{width:100%} }
        @keyframes enl-spin  { to{transform:rotate(360deg)} }
        @keyframes enl-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .enl-panel-left  { animation: enl-left  .65s cubic-bezier(.22,1,.36,1) both; }
        .enl-panel-right { animation: enl-right .65s .08s cubic-bezier(.22,1,.36,1) both; }
        .enl-row1 { animation: enl-in .5s .2s  both; }
        .enl-row2 { animation: enl-in .5s .3s  both; }
        .enl-row3 { animation: enl-in .5s .38s both; }
        .enl-row4 { animation: enl-in .5s .44s both; }
        .enl-row5 { animation: enl-in .5s .5s  both; }
        .enl-row6 { animation: enl-in .5s .56s both; }

        .enl-orb1 { animation: enl-orb1 11s ease-in-out infinite; }
        .enl-orb2 { animation: enl-orb2 14s ease-in-out infinite 2s; }
        .enl-orb3 { animation: enl-orb3 9s  ease-in-out infinite 4s; }
        .enl-float { animation: enl-float 4s ease-in-out infinite; }

        .enl-feat { animation: enl-in .4s both; }
        .enl-feat:nth-child(1){animation-delay:.55s}
        .enl-feat:nth-child(2){animation-delay:.65s}
        .enl-feat:nth-child(3){animation-delay:.75s}
        .enl-feat:nth-child(4){animation-delay:.85s}

        .enl-input {
          width:100%; padding:11px 14px 11px 42px;
          border-radius:10px; border:1.5px solid #e2e8f0;
          font-size:14px; font-family:'Plus Jakarta Sans',sans-serif;
          outline:none; background:#f8fafc; color:#0f172a;
          transition:border .18s,box-shadow .18s,background .18s;
        }
        .enl-input:focus {
          border-color:#6366f1 !important;
          background:#fff !important;
          box-shadow:0 0 0 3px rgba(99,102,241,.12) !important;
        }
        .enl-input::placeholder { color:#94a3b8; }

        .enl-btn {
          width:100%; padding:12px;
          border-radius:10px; border:none;
          font-size:14px; font-weight:700;
          letter-spacing:.01em;
          font-family:'Plus Jakarta Sans',sans-serif;
          cursor:pointer; transition:all .18s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .enl-btn:not(:disabled):hover {
          transform:translateY(-2px);
          box-shadow:0 10px 30px rgba(99,102,241,.38) !important;
        }
        .enl-btn:not(:disabled):active { transform:none; }

        .enl-eye {
          position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#94a3b8; padding:3px;
          display:flex; align-items:center;
          transition:color .15s;
        }
        .enl-eye:hover { color:#6366f1; }

        .enl-pill {
          display:inline-flex; align-items:center; gap:6px;
          padding:5px 12px; border-radius:100px;
          font-size:11px; font-weight:600;
          letter-spacing:.03em;
          border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.55);
          background:rgba(255,255,255,.05);
          backdrop-filter:blur(4px);
          white-space:nowrap;
        }

        @media(max-width:820px){
          .enl-panel-left { display:none !important; }
          .enl-right-inner { padding:36px 28px !important; }
        }
      `}}/>

      <div className="enl-login" style={{
        minHeight:"100vh", display:"flex",
        background:"#f1f5f9", overflow:"hidden",
        fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
      }}>

        {/* ══════════════════════════════════════
            LEFT — Brand storytelling panel
        ══════════════════════════════════════ */}
        <div className="enl-panel-left" style={{
          flex:"0 0 50%", position:"relative", overflow:"hidden",
          background:"#0f172a",
          display:"flex", flexDirection:"column",
        }}>
          {/* Mesh gradient orbs */}
          <div className="enl-orb1" style={{position:"absolute",top:"-8%",left:"-10%",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.28) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div className="enl-orb2" style={{position:"absolute",bottom:"-12%",right:"-8%",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div className="enl-orb3" style={{position:"absolute",top:"42%",right:"12%",width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 65%)",pointerEvents:"none"}}/>

          {/* Fine dot grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none"}}/>

          {/* Diagonal accent line */}
          <div style={{position:"absolute",top:0,right:"28%",width:1,height:"100%",background:"linear-gradient(180deg,transparent,rgba(99,102,241,.15) 30%,rgba(139,92,246,.1) 70%,transparent)",pointerEvents:"none"}}/>

          <div style={{position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",padding:"48px 52px"}}>

            {/* Logo */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:64}}>
              <div style={{
                width:40,height:40,borderRadius:11,flexShrink:0,
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 0 0 5px rgba(99,102,241,.18)",
              }}>
                <span style={{fontSize:16,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>E</span>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",letterSpacing:".01em"}}>Ensemble Digital Labs</div>
                <div style={{fontSize:10,color:"#334155",letterSpacing:".12em",textTransform:"uppercase",fontWeight:500,marginTop:1}}>CRM Platform</div>
              </div>
            </div>

            {/* Main headline */}
            <div style={{flex:1}}>
              <div style={{fontSize:42,fontWeight:800,color:"#f1f5f9",lineHeight:1.1,letterSpacing:"-.5px",marginBottom:18}}>
                Grow Smarter.<br/>
                <span style={{background:"linear-gradient(135deg,#818cf8,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                  Market Better.
                </span>
              </div>
              <p style={{fontSize:14,color:"#475569",lineHeight:1.75,maxWidth:320,marginBottom:44,fontWeight:400}}>
                Your command center for healthcare marketing, CRM pipelines, campaigns, and client delivery — all in one place.
              </p>

              {/* Feature list */}
              <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:52}}>
                {[
                  {icon:"◎","label":"Pipeline & deal management"},
                  {icon:"◈","label":"Healthcare compliance (HIPAA / BAA)"},
                  {icon:"◉","label":"AI-powered campaign analytics"},
                  {icon:"◐","label":"Multi-client workspace control"},
                ].map(f=>(
                  <div key={f.label} className="enl-feat" style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{
                      width:30,height:30,borderRadius:8,flexShrink:0,
                      background:"rgba(99,102,241,.12)",
                      border:"1px solid rgba(99,102,241,.2)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,color:"#818cf8",
                    }}>{f.icon}</div>
                    <span style={{fontSize:13,color:"#64748b",fontWeight:500}}>{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Service pills */}
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["Healthcare","Digital Marketing","CRM Advisory","HIPAA","St. Louis, MO"].map(p=>(
                  <span key={p} className="enl-pill">{p}</span>
                ))}
              </div>
            </div>

            {/* Bottom divider + stats */}
            <div style={{
              marginTop:40,paddingTop:24,
              borderTop:"1px solid rgba(255,255,255,.06)",
              display:"flex",gap:0,
            }}>
              {[["15+","Clients"],["$2M+","Revenue"],["5★","Rated"]].map(([n,l],i)=>(
                <div key={l} style={{
                  flex:1,
                  paddingRight:i<2?20:0, paddingLeft:i>0?20:0,
                  borderRight:i<2?"1px solid rgba(255,255,255,.06)":"none",
                }}>
                  <div style={{fontSize:18,fontWeight:800,color:"#818cf8",lineHeight:1,marginBottom:3}}>{n}</div>
                  <div style={{fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Login form
        ══════════════════════════════════════ */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#f1f5f9",position:"relative",overflow:"hidden"}}>
          {/* Soft bg accents */}
          <div style={{position:"absolute",top:0,right:0,width:280,height:280,background:"radial-gradient(ellipse at top right,rgba(99,102,241,.06) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:0,left:0,width:220,height:220,background:"radial-gradient(ellipse at bottom left,rgba(139,92,246,.05) 0%,transparent 65%)",pointerEvents:"none"}}/>

          <div className="enl-panel-right enl-right-inner" style={{width:"100%",maxWidth:400,padding:"48px 44px",position:"relative",zIndex:2}}>

            {/* Status badge */}
            <div className="enl-row1" style={{
              display:"inline-flex",alignItems:"center",gap:7,
              background:"#eef2ff",borderRadius:100,
              padding:"5px 14px",marginBottom:28,
              border:"1px solid #c7d2fe",
            }}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#6366f1",display:"inline-block",animation:"enl-dot 2s ease-in-out infinite"}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#4338ca",letterSpacing:".06em",textTransform:"uppercase"}}>Secure Access Portal</span>
            </div>

            {/* Heading */}
            <div className="enl-row2" style={{marginBottom:28}}>
              <h2 style={{fontSize:28,fontWeight:800,color:"#0f172a",letterSpacing:"-.4px",lineHeight:1.15,marginBottom:6}}>
                Sign in to your<br/>workspace
              </h2>
              <p style={{fontSize:14,color:"#64748b",fontWeight:400,lineHeight:1.6}}>
                Enter your credentials to access Ensemble CRM
              </p>
            </div>

            {/* Username */}
            <div className="enl-row3" style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"#334155",marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>
                Username
              </label>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",opacity:.45}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input className="enl-input" value={username}
                  onChange={e=>{setUsername(e.target.value);setErr("");}}
                  onKeyDown={e=>e.key==="Enter"&&attempt()}
                  placeholder="your.username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="enl-row4" style={{marginBottom:22}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"#334155",marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>
                Password
              </label>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",opacity:.45}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input className="enl-input"
                  type={showPw?"text":"password"}
                  value={password}
                  onChange={e=>{setPassword(e.target.value);setErr("");}}
                  onKeyDown={e=>e.key==="Enter"&&attempt()}
                  placeholder="••••••••"
                  style={{paddingRight:40}}
                />
                <button className="enl-eye" type="button" onClick={()=>setShowPw(p=>!p)}>
                  {showPw
                    ?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    :<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {err&&(
              <div className="enl-row5" style={{
                background:"#fef2f2",border:"1px solid #fecaca",borderRadius:9,
                padding:"10px 14px",fontSize:13,color:"#dc2626",
                marginBottom:16,display:"flex",alignItems:"center",gap:8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {err}
              </div>
            )}

            {/* Submit */}
            <div className="enl-row5">
              <button onClick={attempt} disabled={busy} className="enl-btn" style={{
                background:busy?"#e0e7ff":"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
                color:busy?"#818cf8":"#fff",
                boxShadow:busy?"none":"0 4px 18px rgba(99,102,241,.35)",
              }}>
                {busy
                  ?<><div className="auth-spin"/>Signing in…</>
                  :<>Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                }
              </button>
            </div>

            {/* Footer */}
            <div className="enl-row6" style={{
              marginTop:36,paddingTop:22,
              borderTop:"1px solid #e2e8f0",
              display:"flex",justifyContent:"space-between",alignItems:"center",
            }}>
              <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>© 2025 Ensemble Digital Labs</span>
              <a href="https://ensembledigilabs.com" target="_blank" rel="noopener"
                style={{fontSize:11,color:"#6366f1",fontWeight:600,letterSpacing:".03em",display:"flex",alignItems:"center",gap:4}}
                onMouseEnter={e=>e.currentTarget.style.color="#4338ca"}
                onMouseLeave={e=>e.currentTarget.style.color="#6366f1"}
              >
                ensembledigilabs.com
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══ USER ADMINISTRATION ═══ */
function UserAdmin({users,currentUser,onSave,onDelete,onToggleStatus,notify}){
  const[showForm,setShowForm]=useState(false);
  const[editU,setEditU]=useState(null);
  const[search,setSearch]=useState("");
  const[fRole,setFRole]=useState("All");
  const[fStatus,setFStatus]=useState("All");
  const[confirmDel,setConfirmDel]=useState(null);

  const allUsers=[DEFAULT_ADMIN,...(users||[])];
  const filtered=allUsers.filter(u=>{
    if(fRole!=="All"&&u.role!==fRole)return false;
    if(fStatus!=="All"&&u.status!==fStatus)return false;
    if(search){const q=search.toLowerCase();return u.username?.toLowerCase().includes(q)||u.name?.toLowerCase().includes(q)||u.email?.toLowerCase().includes(q)||u.role?.toLowerCase().includes(q);}
    return true;
  });

  const stats={total:allUsers.length,active:allUsers.filter(u=>u.status==="Active").length,admins:allUsers.filter(u=>u.role==="Admin").length};
  const isAdmin=currentUser?.role==="Admin";
  const avatarColor=u=>({Admin:"#7c3aed",Manager:"#0ea5e9","Sales Rep":"#10b981",Viewer:"#64748b"}[u.role]||"#6366f1");
  const initials=n=>(n||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

  return(
    <div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:3}}>User Administration</h1>
          <p style={{fontSize:13,color:"#64748b"}}>Manage team members, roles, and access permissions</p>
        </div>
        {isAdmin&&<Btn onClick={()=>{setEditU(null);setShowForm(true);}}>+ Add User</Btn>}
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:18}}>
        {[["Total Users",stats.total,"#6366f1","👥"],["Active",stats.active,"#10b981","✅"],["Admins",stats.admins,"#7c3aed","🛡️"],["Other Roles",stats.total-stats.admins,"#0ea5e9","💼"]].map(([l,v,c,ic])=>
          <div key={l} style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ic}</div>
            <div>
              <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:2}}>{l}</div>
              <div style={{fontSize:24,fontWeight:700,color:c,lineHeight:1}}>{v}</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 200px"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13,pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…"
            style={{width:"100%",padding:"8px 12px 8px 30px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
        </div>
        <select value={fRole} onChange={e=>setFRole(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
          <option value="All">All Roles</option>{USER_ROLES.map(r=><option key={r}>{r}</option>)}
        </select>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
          <option value="All">All Statuses</option>{USER_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        {(search||fRole!=="All"||fStatus!=="All")&&
          <button onClick={()=>{setSearch("");setFRole("All");setFStatus("All");}}
            style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fecdd3",background:"#fff0f0",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>✕ Clear</button>}
      </div>

      {/* Table */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:700}}>
            <thead>
              <tr style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
                {["User","Username","Role","Status","Email","Last Login",""].map(h=>
                  <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={7} style={{padding:"48px",textAlign:"center",color:"#94a3b8"}}>No users match your filters.</td></tr>}
              {filtered.map((u,i)=>{
                const rm=ROLE_META[u.role]||ROLE_META.Viewer;
                const isBuiltIn=u.id==="u0";
                const isMe=u.id===currentUser?.id;
                const isActive=u.status!=="Inactive";
                return(
                  <tr key={u.id} style={{borderTop:"1px solid #f1f5f9"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}>
                    {/* Avatar + Name */}
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{position:"relative",flexShrink:0}}>
                          <div style={{width:36,height:36,borderRadius:"50%",background:avatarColor(u),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>
                            {initials(u.name||u.username)}
                          </div>
                          <span style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:isActive?"#10b981":"#94a3b8",border:"2px solid #fff"}}/>
                        </div>
                        <div>
                          <div style={{fontWeight:600,color:"#0f172a",display:"flex",alignItems:"center",gap:6}}>
                            {u.name||u.username}
                            {isMe&&<span style={{fontSize:9,fontWeight:700,background:"#eef2ff",color:"#6366f1",borderRadius:10,padding:"1px 6px"}}>YOU</span>}
                            {isBuiltIn&&<span style={{fontSize:9,fontWeight:700,background:"#ede9fe",color:"#7c3aed",borderRadius:10,padding:"1px 6px"}}>BUILT-IN</span>}
                          </div>
                          <div style={{fontSize:11,color:"#64748b"}}>{u.email||"—"}</div>
                        </div>
                      </div>
                    </td>
                    {/* Username */}
                    <td style={{padding:"13px 16px"}}>
                      <code style={{fontSize:12,background:"#f1f5f9",color:"#334155",padding:"2px 8px",borderRadius:6,fontFamily:"monospace"}}>{u.username}</code>
                    </td>
                    {/* Role */}
                    <td style={{padding:"13px 16px"}}>
                      <span style={{background:rm.bg,color:rm.c,borderRadius:20,fontSize:11,fontWeight:600,padding:"3px 11px",display:"inline-flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:12}}>{rm.icon}</span>{u.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{padding:"13px 16px"}}>
                      <span style={{background:isActive?"#ecfdf5":"#f1f5f9",color:isActive?"#10b981":"#64748b",borderRadius:20,fontSize:11,fontWeight:600,padding:"3px 11px"}}>
                        {isActive?"Active":"Inactive"}
                      </span>
                    </td>
                    {/* Email */}
                    <td style={{padding:"13px 16px",color:"#64748b",fontSize:12}}>{u.email||"—"}</td>
                    {/* Last Login */}
                    <td style={{padding:"13px 16px"}}>
                      {u.lastLogin?<span style={{fontSize:12,color:"#64748b"}}>{fmt(u.lastLogin)}</span>:<span style={{fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>Never</span>}
                    </td>
                    {/* Actions */}
                    <td style={{padding:"13px 16px"}}>
                      {isAdmin&&!isBuiltIn?(
                        <div style={{display:"flex",gap:6,justifyContent:"flex-end",flexWrap:"wrap"}}>
                          <Btn sz="sm" v="ghost" onClick={()=>{setEditU(u);setShowForm(true);}}>Edit</Btn>
                          {!isMe&&isActive&&(
                            <Btn sz="sm" v="ghost" onClick={()=>{onToggleStatus(u.id,"Inactive");notify("User deactivated");}}
                              style={{color:"#f59e0b",borderColor:"#fde68a"}}>Deactivate</Btn>
                          )}
                          {!isMe&&!isActive&&(
                            <Btn sz="sm" v="ghost" onClick={()=>{onToggleStatus(u.id,"Active");notify("User reactivated ✓");}}
                              style={{color:"#10b981",borderColor:"#a7f3d0"}}>Reactivate</Btn>
                          )}
                          {!isMe&&(
                            <Btn sz="sm" v="danger" onClick={()=>setConfirmDel(u.id)}>Delete</Btn>
                          )}
                        </div>
                      ):<span style={{color:"#94a3b8",fontSize:12}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission reference */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",marginTop:16}}>
        <div style={{padding:"13px 20px",borderBottom:"1px solid #f1f5f9"}}>
          <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Role Permissions</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",minWidth:500}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                <th style={{padding:"9px 20px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",width:"40%"}}>Permission</th>
                {USER_ROLES.map(r=>{const rm=ROLE_META[r];return(
                  <th key={r} style={{padding:"9px 14px",textAlign:"center",fontSize:10,fontWeight:700,color:rm.c,textTransform:"uppercase"}}>{rm.icon} {r}</th>
                );})}
              </tr>
            </thead>
            <tbody>
              {[
                ["View all CRM data",         [1,1,1,1]],
                ["Create & edit records",      [1,1,1,0]],
                ["Delete records",             [1,1,0,0]],
                ["Manage contracts & files",   [1,1,1,0]],
                ["Export data",                [1,1,0,0]],
                ["Manage users",               [1,0,0,0]],
                ["System configuration",       [1,0,0,0]],
              ].map(([perm,vals],i,arr)=>(
                <tr key={perm} style={{borderTop:"1px solid #f1f5f9"}}>
                  <td style={{padding:"10px 20px",color:"#334155",fontWeight:500}}>{perm}</td>
                  {vals.map((v,j)=>(
                    <td key={j} style={{padding:"10px 14px",textAlign:"center"}}>
                      {v?<span style={{color:"#10b981",fontSize:16}}>✓</span>:<span style={{color:"#e2e8f0",fontSize:16}}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm delete */}
      {confirmDel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#fff",borderRadius:16,padding:"28px 32px",maxWidth:380,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.22)",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
          <div style={{fontSize:16,fontWeight:700,color:"#0f172a",marginBottom:8}}>Delete User?</div>
          <p style={{fontSize:13,color:"#64748b",lineHeight:1.5,marginBottom:22}}>
            This will permanently remove <strong>{allUsers.find(u=>u.id===confirmDel)?.name||allUsers.find(u=>u.id===confirmDel)?.username}</strong> and all their access. This cannot be undone.
          </p>
          <div style={{display:"flex",gap:10}}>
            <Btn v="ghost" onClick={()=>setConfirmDel(null)} style={{flex:1}}>Cancel</Btn>
            <Btn v="danger" onClick={()=>{onDelete(confirmDel);setConfirmDel(null);notify("User deleted");}} style={{flex:1,fontWeight:700}}>Delete User</Btn>
          </div>
        </div>
      </div>}

      {showForm&&<UserForm user={editU} allUsers={allUsers} onClose={()=>{setShowForm(false);setEditU(null);}}
        onSave={d=>{
          const isNew=!editU;
          onSave({...d,id:editU?.id||uid(),createdAt:editU?.createdAt||new Date().toISOString().slice(0,10),lastLogin:editU?.lastLogin||null});
          notify(isNew?"User created ✓":"User updated ✓");
          setShowForm(false);setEditU(null);
        }}/>}
    </div>
  );
}

function UserForm({user,allUsers,onClose,onSave}){
  const isEdit=!!user;
  const[f,sf]=useState({
    username:user?.username||"",
    password:user?.password||"",
    name:user?.name||"",
    email:user?.email||"",
    role:user?.role||"Sales Rep",
    status:user?.status||"Active",
  });
  const[showPw,setShowPw]=useState(false);
  const set=(k,v)=>sf(p=>({...p,[k]:v}));

  function validate(){
    if(!f.username.trim())return"Username is required.";
    if(!isEdit&&!f.password.trim())return"Password is required.";
    // Username uniqueness (skip self)
    const taken=allUsers.find(u=>u.username.toLowerCase()===f.username.trim().toLowerCase()&&u.id!==user?.id);
    if(taken)return`Username "${f.username.trim()}" is already taken.`;
    return null;
  }

  return(
    <Modal title={isEdit?"Edit User":"Create New User"} onClose={onClose} onSave={()=>{const e=validate();if(e)return alert(e);onSave(f);}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Full Name" value={f.name} onChange={v=>set("name",v)} placeholder="e.g. Jane Smith" span={2}/>
        <Field label="Username *" value={f.username} onChange={v=>set("username",v)} placeholder="e.g. jsmith"/>
        <Field label="Email" value={f.email} onChange={v=>set("email",v)} type="email" placeholder="jane@company.com"/>

        {/* Password field with toggle */}
        <div style={{gridColumn:"span 2"}}>
          <Lbl>{isEdit?"New Password (leave blank to keep current)":"Password *"}</Lbl>
          <div style={{position:"relative"}}>
            <input type={showPw?"text":"password"} value={f.password} onChange={e=>set("password",e.target.value)}
              placeholder={isEdit?"Enter new password to change…":"Set a strong password"}
              style={{width:"100%",padding:"8px 38px 8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
            <button type="button" onClick={()=>setShowPw(p=>!p)}
              style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:14}}>
              {showPw?"🙈":"👁"}
            </button>
          </div>
        </div>

        {/* Role selector */}
        <div style={{gridColumn:"span 2"}}>
          <Lbl>Role</Lbl>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
            {USER_ROLES.map(r=>{const rm=ROLE_META[r];const active=f.role===r;return(
              <button key={r} onClick={()=>set("role",r)}
                style={{padding:"7px 16px",borderRadius:20,border:"1.5px solid "+(active?rm.c:"#e2e8f0"),background:active?rm.bg:"#fff",color:active?rm.c:"#64748b",fontSize:12,fontWeight:active?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .12s"}}>
                <span style={{fontSize:13}}>{rm.icon}</span>{r}
              </button>
            );})}
          </div>
          <div style={{marginTop:8,fontSize:11,color:"#94a3b8",lineHeight:1.5}}>
            {f.role==="Admin"&&"⚡ Admin has full system access including user management."}
            {f.role==="Manager"&&"📊 Manager can create, edit, and delete records but cannot manage users."}
            {f.role==="Sales Rep"&&"💼 Sales Rep can view and edit records but cannot delete or export."}
            {f.role==="Viewer"&&"👁️ Viewer can view records but cannot make any changes."}
          </div>
        </div>

        {isEdit&&<Select label="Status" value={f.status} onChange={v=>set("status",v)} options={USER_STATUSES} span={2}/>}
      </div>
    </Modal>
  );
}

/* ═══ CONTRACT COMPONENTS ═══ */

function ContractForm({contract,accountId,onClose,onSave}){
  const today=new Date().toISOString().slice(0,10);
  const[f,sf]=useState({
    name:contract?.name||"",
    type:contract?.type||CONTRACT_TYPES[0],
    startDate:contract?.startDate||today,
    endDate:contract?.endDate||"",
    value:contract?.value||"",
    status:contract?.status||"Active",
    notes:contract?.notes||"",
    fileName:contract?.fileName||"",
    fileSize:contract?.fileSize||0,
    fileData:contract?.fileData||null,
  });
  const[fileErr,setFileErr]=useState("");
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  const MAX=5*1024*1024;

  function handleFile(e){
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>MAX){setFileErr("File exceeds 5 MB limit.");return;}
    setFileErr("");
    const reader=new FileReader();
    reader.onload=function(ev){
      set("fileName",file.name);
      set("fileSize",file.size);
      set("fileData",ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function fmtBytes(b){
    if(!b)return"";
    if(b<1024)return b+"B";
    if(b<1048576)return(b/1024).toFixed(1)+"KB";
    return(b/1048576).toFixed(2)+"MB";
  }

  const cm=CT_META[f.type]||CT_META.Other;
  const days=f.startDate&&f.endDate?Math.round((new Date(f.endDate)-new Date(f.startDate))/(86400000)):null;

  return<Modal title={contract?"Edit Contract":"New Contract"} onClose={onClose}
    onSave={()=>{if(!f.name.trim())return alert("Contract name required.");onSave(f);}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Field label="Contract Name *" value={f.name} onChange={v=>set("name",v)} span={2}/>

      <div style={{gridColumn:"span 1"}}>
        <Lbl>Contract Type</Lbl>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
          {CONTRACT_TYPES.map(t=>{
            const m=CT_META[t]||CT_META.Other;
            const active=f.type===t;
            return<button key={t} onClick={()=>set("type",t)}
              style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(active?m.c:"#e2e8f0"),background:active?m.bg:"#fff",color:active?m.c:"#64748b",fontSize:12,fontWeight:active?600:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <span>{m.icon}</span>{t}
            </button>;
          })}
        </div>
      </div>

      <div style={{gridColumn:"span 1"}}>
        <Lbl>Status</Lbl>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          {["Active","Expired","Pending","Terminated"].map(s=>{
            const active=f.status===s;
            const c=s==="Active"?"#10b981":s==="Expired"?"#64748b":s==="Pending"?"#f59e0b":"#ef4444";
            return<button key={s} onClick={()=>set("status",s)}
              style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(active?c:"#e2e8f0"),background:active?"#f8fafc":"#fff",color:active?c:"#64748b",fontSize:12,fontWeight:active?600:400,cursor:"pointer"}}>
              {s}
            </button>;
          })}
        </div>
      </div>

      <Field label="Start Date" value={f.startDate} onChange={v=>set("startDate",v)} type="date"/>
      <Field label="End Date" value={f.endDate} onChange={v=>set("endDate",v)} type="date"/>
      <Field label="Contract Value ($)" value={f.value} onChange={v=>set("value",v)} type="number" placeholder="0"/>
      <div style={{display:"flex",alignItems:"flex-end",paddingBottom:6}}>
        {days!==null&&days>=0&&<span style={{fontSize:12,color:"#64748b"}}>📅 {days} days · {(days/365).toFixed(1)} yr{days>=730?"s":""}</span>}
      </div>

      <TextArea label="Notes" value={f.notes} onChange={v=>set("notes",v)} span={2} rows={2}/>
    </div>

    {/* File attachment */}
    <div style={{marginTop:16,padding:"14px 16px",background:"#f8fafc",borderRadius:10,border:"1.5px dashed #cbd5e1"}}>
      <div style={{fontSize:12,fontWeight:600,color:"#475569",marginBottom:8}}>📎 Attach Contract File <span style={{fontWeight:400,color:"#94a3b8"}}>(PDF, DOC, DOCX — max 5 MB)</span></div>
      {f.fileName
        ?<div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #e2e8f0"}}>
          <span style={{fontSize:18}}>{f.fileName.endsWith(".pdf")?"📄":"📝"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.fileName}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{fmtBytes(f.fileSize)}</div>
          </div>
          <button onClick={()=>{set("fileName","");set("fileSize",0);set("fileData",null);}}
            style={{background:"#fff0f0",border:"none",color:"#ef4444",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",fontWeight:600}}>Remove</button>
        </div>
        :<label style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"18px",cursor:"pointer",borderRadius:8,transition:"background .15s"}}
          onMouseEnter={function(e){e.currentTarget.style.background="#eef2ff";}}
          onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:28}}>☁️</span>
          <span style={{fontSize:13,color:"#6366f1",fontWeight:600}}>Click to upload or drag &amp; drop</span>
          <span style={{fontSize:11,color:"#94a3b8"}}>PDF · DOC · DOCX · up to 5 MB</span>
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} style={{display:"none"}}/>
        </label>
      }
      {fileErr&&<div style={{marginTop:6,fontSize:12,color:"#ef4444",fontWeight:500}}>{fileErr}</div>}
    </div>
  </Modal>
}

/* ═══ CONTRACTS & PROPOSALS SCREEN ═══ */
function ContractsScreen({contracts,accounts,onSave,onDelete,notify}){
  const[search,setSearch]=useState("");
  const[fType,setFType]=useState("All");
  const[fStatus,setFStatus]=useState("All");
  const[fAccount,setFAccount]=useState("All");
  const[view,setView]=useState("cards"); // cards | table
  const[showForm,setShowForm]=useState(false);
  const[editCT,setEditCT]=useState(null);
  const[selCT,setSelCT]=useState(null); // detail panel

  const today=new Date();

  const filtered=contracts.filter(ct=>{
    if(fType!=="All"&&ct.type!==fType)return false;
    if(fStatus!=="All"&&ct.status!==fStatus)return false;
    if(fAccount!=="All"&&ct.accountId!==fAccount)return false;
    if(search){
      const q=search.toLowerCase();
      const acct=accounts.find(a=>a.id===ct.accountId);
      return ct.name?.toLowerCase().includes(q)||ct.type?.toLowerCase().includes(q)||acct?.name?.toLowerCase().includes(q)||ct.notes?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));

  /* ─── Summary stats ─── */
  const totalValue=contracts.reduce((s,c)=>s+Number(c.value||0),0);
  const byStatus=s=>contracts.filter(c=>c.status===s).length;
  const expiringSoon=contracts.filter(c=>{
    if(!c.endDate||c.status!=="Active")return false;
    const d=Math.round((new Date(c.endDate)-today)/86400000);
    return d>=0&&d<=30;
  }).length;

  function fmtBytes(b){if(!b)return"";if(b<1048576)return(b/1024).toFixed(0)+"KB";return(b/1048576).toFixed(2)+"MB";}

  function handleQuickFile(ct,e){
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>5*1024*1024){alert("File exceeds 5 MB.");return;}
    const reader=new FileReader();
    reader.onload=ev=>onSave({...ct,fileName:file.name,fileSize:file.size,fileData:ev.target.result});
    reader.readAsDataURL(file);
  }

  function ContractCard({ct}){
    const cm=CT_META[ct.type]||CT_META.Other;
    const acct=accounts.find(a=>a.id===ct.accountId);
    const statColor=ct.status==="Active"?"#10b981":ct.status==="Expired"?"#64748b":ct.status==="Pending"?"#f59e0b":"#ef4444";
    const statBg=ct.status==="Active"?"#ecfdf5":ct.status==="Expired"?"#f1f5f9":ct.status==="Pending"?"#fef3c7":"#fef2f2";
    const daysLeft=ct.endDate?Math.round((new Date(ct.endDate)-today)/86400000):null;
    const isExpired=ct.endDate&&new Date(ct.endDate)<today;
    const urgent=daysLeft!==null&&daysLeft>=0&&daysLeft<=30;
    const isSel=selCT?.id===ct.id;

    return(
      <div onClick={()=>setSelCT(isSel?null:ct)}
        style={{background:"#fff",borderRadius:14,border:"2px solid "+(isSel?"#6366f1":"#e2e8f0"),padding:"18px 20px",cursor:"pointer",transition:"all .15s",boxShadow:isSel?"0 0 0 3px rgba(99,102,241,.12)":"none"}}
        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.borderColor="#c7d2fe";}}
        onMouseLeave={e=>{if(!isSel)e.currentTarget.style.borderColor="#e2e8f0";}}>
        {/* Top row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1,minWidth:0}}>
            <div style={{width:40,height:40,borderRadius:11,background:cm.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{cm.icon}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.name}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <span style={{background:cm.bg,color:cm.c,borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px"}}>{ct.type}</span>
                <span style={{background:statBg,color:statColor,borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px"}}>{ct.status}</span>
                {urgent&&<span style={{background:"#fff7ed",color:"#ea580c",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px"}}>⚠️ {daysLeft}d left</span>}
                {isExpired&&ct.status!=="Expired"&&<span style={{background:"#fef2f2",color:"#dc2626",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px"}}>Overdue</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,marginLeft:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
            <label title="Attach file" style={{display:"inline-flex",alignItems:"center",padding:"4px 8px",borderRadius:7,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",fontSize:11,fontWeight:600,cursor:"pointer",gap:3}}>
              📎<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e=>handleQuickFile(ct,e)} style={{display:"none"}}/>
            </label>
            <Btn sz="sm" v="ghost" onClick={()=>{setEditCT(ct);setShowForm(true);}}>Edit</Btn>
            <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Delete this contract?"))onDelete(ct.id);}}>✕</Btn>
          </div>
        </div>

        {/* Account */}
        {acct&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,padding:"6px 10px",background:"#f8fafc",borderRadius:8}}>
          <Avatar name={acct.name} size={20} color="#6366f1" bg="#eef2ff"/>
          <span style={{fontSize:12,color:"#334155",fontWeight:500}}>{acct.name}</span>
        </div>}

        {/* KPI row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:ct.fileName?10:0}}>
          {[["Value",ct.value?("$"+Number(ct.value).toLocaleString()):"—"],["Start",ct.startDate?fmt(ct.startDate):"—"],["End",ct.endDate?fmt(ct.endDate):"—"],["Days",ct.startDate&&ct.endDate?Math.round((new Date(ct.endDate)-new Date(ct.startDate))/86400000)+"d":"—"]].map(([l,v])=>
            <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"6px 9px"}}>
              <div style={{fontSize:8,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:1}}>{l}</div>
              <div style={{fontSize:12,fontWeight:700,color:l==="Value"?"#10b981":"#334155"}}>{v}</div>
            </div>
          )}
        </div>

        {/* File chip */}
        {ct.fileName&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:"#f1f5f9",borderRadius:8,border:"1px solid #e2e8f0"}} onClick={e=>e.stopPropagation()}>
          <span style={{fontSize:15}}>{ct.fileName.toLowerCase().endsWith(".pdf")?"📄":"📝"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.fileName}</div>
            <div style={{fontSize:9,color:"#94a3b8"}}>{fmtBytes(ct.fileSize)}</div>
          </div>
          {ct.fileData&&<>
            <button onClick={()=>{const w=window.open();w.document.write(`<html><body style="margin:0;background:#1e1e2e"><iframe src="${ct.fileData}" style="width:100%;height:100vh;border:none"/></body></html>`);}}
              style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}}>Open</button>
            <a href={ct.fileData} download={ct.fileName}
              style={{background:"#ecfdf5",color:"#10b981",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,textDecoration:"none",flexShrink:0}}>↓</a>
          </>}
        </div>}
        {!ct.fileName&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",border:"1.5px dashed #e2e8f0",borderRadius:8,marginTop:ct.notes?6:0}} onClick={e=>e.stopPropagation()}>
          <span style={{fontSize:13,color:"#cbd5e1"}}>📎</span>
          <span style={{fontSize:11,color:"#94a3b8",flex:1}}>No file attached</span>
          <label style={{background:"#eef2ff",color:"#6366f1",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:600,cursor:"pointer",flexShrink:0}}>
            + Attach<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e=>handleQuickFile(ct,e)} style={{display:"none"}}/>
          </label>
        </div>}
        {ct.notes&&<div style={{marginTop:8,fontSize:11,color:"#64748b",fontStyle:"italic",lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ct.notes}</div>}
      </div>
    );
  }

  /* ─── Detail side-panel ─── */
  function DetailPanel({ct}){
    const cm=CT_META[ct.type]||CT_META.Other;
    const acct=accounts.find(a=>a.id===ct.accountId);
    const statColor=ct.status==="Active"?"#10b981":ct.status==="Expired"?"#64748b":ct.status==="Pending"?"#f59e0b":"#ef4444";
    const statBg=ct.status==="Active"?"#ecfdf5":ct.status==="Expired"?"#f1f5f9":ct.status==="Pending"?"#fef3c7":"#fef2f2";
    const daysLeft=ct.endDate?Math.round((new Date(ct.endDate)-today)/86400000):null;
    const pct=ct.startDate&&ct.endDate?Math.min(100,Math.max(0,Math.round((today-new Date(ct.startDate))/(new Date(ct.endDate)-new Date(ct.startDate))*100))):null;
    return(
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",position:"sticky",top:0}}>
        {/* Header */}
        <div style={{padding:"16px 18px",borderBottom:"1px solid #f1f5f9",background:"linear-gradient(135deg,"+cm.bg+",#fff)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:11,background:cm.bg,border:"1.5px solid "+cm.c+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{cm.icon}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:3}}>{ct.name}</div>
                <span style={{background:statBg,color:statColor,borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px"}}>{ct.status}</span>
              </div>
            </div>
            <button onClick={()=>setSelCT(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:16,padding:2,lineHeight:1}}>✕</button>
          </div>
          {acct&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:"rgba(255,255,255,.7)",borderRadius:8}}>
            <Avatar name={acct.name} size={18} color="#6366f1" bg="#eef2ff"/>
            <span style={{fontSize:12,color:"#334155",fontWeight:500}}>{acct.name}</span>
          </div>}
        </div>

        {/* KPIs */}
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["Contract Value",ct.value?("$"+Number(ct.value).toLocaleString()):"—"],["Type",ct.type],["Start Date",ct.startDate?fmt(ct.startDate):"—"],["End Date",ct.endDate?fmt(ct.endDate):"—"],["Days Remaining",daysLeft!=null&&daysLeft>=0?daysLeft+"d":daysLeft!=null?"Expired":"—"],["Total Days",ct.startDate&&ct.endDate?Math.round((new Date(ct.endDate)-new Date(ct.startDate))/86400000)+"d":"—"]].map(([l,v])=>
              <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:8,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:l==="Contract Value"?"#10b981":"#334155"}}>{v}</div>
              </div>
            )}
          </div>
          {pct!==null&&<div style={{marginTop:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:10,fontWeight:600,color:"#64748b"}}>Contract Progress</span>
              <span style={{fontSize:10,fontWeight:700,color:"#6366f1"}}>{pct}%</span>
            </div>
            <div style={{height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:3,transition:"width .4s"}}/>
            </div>
          </div>}
        </div>

        {/* Notes */}
        {ct.notes&&<div style={{padding:"12px 18px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Notes</div>
          <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{ct.notes}</div>
        </div>}

        {/* File */}
        <div style={{padding:"12px 18px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Attached File</div>
          {ct.fileName
            ?<div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"#f8fafc",borderRadius:9,border:"1px solid #e2e8f0"}}>
              <span style={{fontSize:20}}>{ct.fileName.toLowerCase().endsWith(".pdf")?"📄":"📝"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.fileName}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>{fmtBytes(ct.fileSize)}</div>
              </div>
              {ct.fileData&&<div style={{display:"flex",gap:5,flexShrink:0}}>
                <button onClick={()=>{const w=window.open();w.document.write(`<html><body style="margin:0;background:#1e1e2e"><iframe src="${ct.fileData}" style="width:100%;height:100vh;border:none"/></body></html>`);}}
                  style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>📂 Open</button>
                <a href={ct.fileData} download={ct.fileName}
                  style={{background:"#ecfdf5",color:"#10b981",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center"}}>↓ Save</a>
              </div>}
            </div>
            :<div style={{padding:"12px",border:"1.5px dashed #e2e8f0",borderRadius:9,textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:6}}>📎</div>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>No file attached</div>
              <label style={{background:"#eef2ff",color:"#6366f1",borderRadius:7,padding:"5px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                + Attach File<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e=>handleQuickFile(ct,e)} style={{display:"none"}}/>
              </label>
            </div>}
        </div>

        {/* Actions */}
        <div style={{padding:"12px 18px",display:"flex",gap:8}}>
          <Btn v="ghost" onClick={()=>{setEditCT(ct);setShowForm(true);}} style={{flex:1}}>Edit</Btn>
          <Btn v="danger" onClick={()=>{if(window.confirm("Delete this contract?"))onDelete(ct.id);setSelCT(null);}} style={{flex:1}}>Delete</Btn>
        </div>
      </div>
    );
  }

  return(
    <div style={{padding:"24px",maxWidth:1400,margin:"0 auto"}}>
      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:3}}>Contracts & Proposals</h1>
          <p style={{fontSize:13,color:"#64748b"}}>{contracts.length} total · {filtered.length} shown</p>
        </div>
        <Btn onClick={()=>{setEditCT(null);setShowForm(true);}}>+ New Contract</Btn>
      </div>

      {/* Stats strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:18}}>
        {[
          {label:"Total Contracts",val:contracts.length,       color:"#6366f1",icon:"📋"},
          {label:"Active",          val:byStatus("Active"),     color:"#10b981",icon:"✅"},
          {label:"Pending",         val:byStatus("Pending"),    color:"#f59e0b",icon:"⏳"},
          {label:"Expiring Soon",   val:expiringSoon,           color:"#f97316",icon:"⚠️"},
          {label:"Total Value",     val:"$"+totalValue.toLocaleString(),color:"#10b981",icon:"💰",wide:true},
        ].map(s=>
          <div key={s.label} style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:s.wide?16:22,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
            </div>
          </div>
        )}
      </div>

      {/* Type filter pills */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {["All",...CONTRACT_TYPES].map(t=>{
          const m=t==="All"?null:CT_META[t]||CT_META.Other;
          const active=fType===t;
          const cnt=t==="All"?contracts.length:contracts.filter(c=>c.type===t).length;
          return<button key={t} onClick={()=>setFType(t)}
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 13px",borderRadius:20,border:"1.5px solid "+(active?(m?.c||"#6366f1"):"#e2e8f0"),background:active?(m?.bg||"#eef2ff"):"#fff",color:active?(m?.c||"#6366f1"):"#64748b",fontSize:12,fontWeight:active?700:400,cursor:"pointer",transition:"all .12s"}}>
            {m&&<span style={{fontSize:13}}>{m.icon}</span>}{t}
            <span style={{fontSize:10,fontWeight:700,background:active?"rgba(0,0,0,0.08)":"#f1f5f9",borderRadius:10,padding:"1px 5px",marginLeft:2}}>{cnt}</span>
          </button>;
        })}
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 220px"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13,pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contracts…"
            style={{width:"100%",padding:"8px 12px 8px 30px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
        </div>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
          <option value="All">All Statuses</option>{["Active","Expired","Pending","Terminated"].map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={fAccount} onChange={e=>setFAccount(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",cursor:"pointer"}}>
          <option value="All">All Accounts</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {/* View toggle */}
        <div style={{display:"flex",background:"#f1f5f9",padding:3,borderRadius:8,gap:2,marginLeft:"auto"}}>
          {[["cards","⊞ Cards"],["table","☰ Table"]].map(([v,lbl])=>
            <button key={v} onClick={()=>setView(v)}
              style={{padding:"5px 13px",borderRadius:6,border:"none",background:view===v?"#fff":"transparent",color:view===v?"#6366f1":"#64748b",fontSize:11,fontWeight:view===v?700:400,cursor:"pointer",whiteSpace:"nowrap",boxShadow:view===v?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
              {lbl}
            </button>
          )}
        </div>
        {(search||fType!=="All"||fStatus!=="All"||fAccount!=="All")&&
          <button onClick={()=>{setSearch("");setFType("All");setFStatus("All");setFAccount("All");}}
            style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fecdd3",background:"#fff0f0",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>✕ Clear</button>}
      </div>

      {filtered.length===0&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"60px 0",textAlign:"center",color:"#94a3b8",fontSize:14}}>
        No contracts match your filters.<br/>
        <button onClick={()=>{setEditCT(null);setShowForm(true);}} style={{marginTop:12,padding:"8px 18px",borderRadius:8,border:"none",background:"#eef2ff",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Contract</button>
      </div>}

      {/* Layout: grid/detail or table */}
      {filtered.length>0&&<div style={{display:"grid",gridTemplateColumns:selCT?"1fr 320px":"1fr",gap:16,alignItems:"start"}}>
        <div>
          {/* ── CARDS VIEW ── */}
          {view==="cards"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
            {filtered.map(ct=><ContractCard key={ct.id} ct={ct}/>)}
          </div>}

          {/* ── TABLE VIEW ── */}
          {view==="table"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:800}}>
                <thead>
                  <tr style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
                    {["Contract","Account","Type","Status","Value","Start","End","File",""].map(h=>
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ct=>{
                    const cm=CT_META[ct.type]||CT_META.Other;
                    const acct=accounts.find(a=>a.id===ct.accountId);
                    const statColor=ct.status==="Active"?"#10b981":ct.status==="Expired"?"#64748b":ct.status==="Pending"?"#f59e0b":"#ef4444";
                    const statBg=ct.status==="Active"?"#ecfdf5":ct.status==="Expired"?"#f1f5f9":ct.status==="Pending"?"#fef3c7":"#fef2f2";
                    const isSel=selCT?.id===ct.id;
                    return(
                      <tr key={ct.id} style={{borderTop:"1px solid #f1f5f9",background:isSel?"#f5f3ff":""}}
                        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="#f8fafc";}}
                        onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="";}}>
                        <td style={{padding:"11px 14px",cursor:"pointer"}} onClick={()=>setSelCT(isSel?null:ct)}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:17}}>{cm.icon}</span>
                            <span style={{fontWeight:600,color:"#0f172a"}}>{ct.name}</span>
                          </div>
                        </td>
                        <td style={{padding:"11px 14px",color:"#64748b"}}>{acct?.name||"—"}</td>
                        <td style={{padding:"11px 14px"}}><span style={{background:cm.bg,color:cm.c,borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 9px"}}>{ct.type}</span></td>
                        <td style={{padding:"11px 14px"}}><span style={{background:statBg,color:statColor,borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 9px"}}>{ct.status}</span></td>
                        <td style={{padding:"11px 14px",fontWeight:700,color:"#10b981"}}>{ct.value?("$"+Number(ct.value).toLocaleString()):"—"}</td>
                        <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{ct.startDate?fmt(ct.startDate):"—"}</td>
                        <td style={{padding:"11px 14px",color:"#64748b",fontSize:12}}>{ct.endDate?fmt(ct.endDate):"—"}</td>
                        <td style={{padding:"11px 14px"}}>
                          {ct.fileName
                            ?<div style={{display:"flex",gap:4}}>
                              {ct.fileData&&<button onClick={()=>{const w=window.open();w.document.write(`<html><body style="margin:0;background:#1e1e2e"><iframe src="${ct.fileData}" style="width:100%;height:100vh;border:none"/></body></html>`);}}
                                style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Open</button>}
                              {ct.fileData&&<a href={ct.fileData} download={ct.fileName}
                                style={{background:"#ecfdf5",color:"#10b981",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center"}}>↓</a>}
                            </div>
                            :<label style={{background:"#f8fafc",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:600,cursor:"pointer",border:"1px dashed #e2e8f0"}}>
                              📎<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e=>handleQuickFile(ct,e)} style={{display:"none"}}/>
                            </label>}
                        </td>
                        <td style={{padding:"11px 14px"}}>
                          <div style={{display:"flex",gap:5,justifyContent:"flex-end"}}>
                            <Btn sz="sm" v="ghost" onClick={()=>{setEditCT(ct);setShowForm(true);}}>Edit</Btn>
                            <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Delete?"))onDelete(ct.id);}}>✕</Btn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>}
        </div>

        {/* Side detail panel */}
        {selCT&&<DetailPanel ct={selCT}/>}
      </div>}

      {showForm&&<ContractForm contract={editCT} accountId={editCT?.accountId||null}
        onClose={()=>{setShowForm(false);setEditCT(null);}}
        onSave={d=>{
          const data={...d,id:editCT?.id||uid(),accountId:editCT?.accountId||d.accountId||null,createdAt:editCT?.createdAt||new Date().toISOString().slice(0,10)};
          onSave(data);
          notify(editCT?"Contract updated ✓":"Contract added ✓");
          setShowForm(false);setEditCT(null);
        }}/>}
    </div>
  );
}

/* ═══ IMPORT / EXPORT ═══ */
function ImportExport({accounts,contacts,opps,leads,contracts,acts,
  onImportAccounts,onImportContacts,onImportOpps,onImportLeads,onImportContracts,
  notify}){

  const[tab,setTab]=useState("import");
  const[module,setModule]=useState("accounts");
  const[step,setStep]=useState("upload");   // upload | preview | done
  const[rows,setRows]=useState([]);
  const[mapped,setMapped]=useState([]);
  const[fileErr,setFileErr]=useState("");
  const[fileName,setFileName]=useState("");
  const[importing,setImporting]=useState(false);
  const[importResult,setImportResult]=useState(null);
  const fileRef=useRef();

  /* ── Field schemas per module ── */
  const SCHEMAS={
    accounts:{
      label:"Accounts",
      icon:"🏢",
      color:"#6366f1",
      required:["name"],
      fields:["name","type","industry","status","website","phone","address","city","state","zip","country","annualRevenue","employees","notes"],
      sample:[
        {name:"Acme Corp",type:"Client",industry:"Technology",status:"Active",website:"acme.com",phone:"314-555-0100",city:"St. Louis",state:"MO"},
        {name:"BetaHealth",type:"Prospect",industry:"Healthcare",status:"Active",phone:"314-555-0101",city:"Clayton",state:"MO"},
      ],
    },
    contacts:{
      label:"Contacts",
      icon:"👤",
      color:"#10b981",
      required:["name"],
      fields:["name","title","dept","role","phone","email","accountName","primary","notes"],
      sample:[
        {name:"Jane Smith",title:"VP Sales",dept:"Sales",role:"Decision Maker",phone:"314-555-0200",email:"jane@acme.com",accountName:"Acme Corp"},
        {name:"Bob Jones",title:"IT Director",dept:"IT",role:"Technical Contact",email:"bob@betahealth.com",accountName:"BetaHealth"},
      ],
    },
    leads:{
      label:"Leads",
      icon:"🎯",
      color:"#f59e0b",
      required:["firstName","lastName"],
      fields:["firstName","lastName","company","title","email","phone","source","status","rating","industry","address","city","state","notes"],
      sample:[
        {firstName:"Alice",lastName:"Brown",company:"TechStart",title:"CEO",email:"alice@techstart.com",source:"Referral",status:"New",rating:"Hot"},
        {firstName:"David",lastName:"Lee",company:"MedGroup",email:"david@medgroup.com",source:"LinkedIn",status:"Contacted",rating:"Warm"},
      ],
    },
    opportunities:{
      label:"Opportunities",
      icon:"💰",
      color:"#0ea5e9",
      required:["name"],
      fields:["name","accountName","stage","oneTime","recurring","recurringPeriod","startDate","endDate","probability","notes"],
      sample:[
        {name:"EHR Implementation",accountName:"BetaHealth",stage:"Proposal",oneTime:"25000",recurring:"2500",recurringPeriod:"Monthly",startDate:"2026-06-01",endDate:"2027-05-31",probability:"60"},
        {name:"Annual Support",accountName:"Acme Corp",stage:"Closed Won",oneTime:"0",recurring:"1500",recurringPeriod:"Monthly",startDate:"2026-01-01",endDate:"2026-12-31",probability:"100"},
      ],
    },
    contracts:{
      label:"Contracts",
      icon:"📄",
      color:"#8b5cf6",
      required:["name"],
      fields:["name","type","accountName","status","value","startDate","endDate","notes"],
      sample:[
        {name:"BAA — BetaHealth 2026",type:"BAA",accountName:"BetaHealth",status:"Active",value:"0",startDate:"2026-01-01",endDate:"2026-12-31"},
        {name:"SaaS MSA — Acme",type:"MSA",accountName:"Acme Corp",status:"Active",value:"30000",startDate:"2026-01-01",endDate:"2027-12-31"},
      ],
    },
  };

  const schema=SCHEMAS[module];

  /* ── CSV parser ── */
  function parseCSV(text){
    // Strip UTF-8 BOM if present
    const clean=text.replace(/^\uFEFF/,"").trim();
    const lines=clean.split(/\r?\n/);
    if(lines.length<2)return{headers:[],rows:[]};
    const headers=lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,"").trim());
    const rows=lines.slice(1).filter(l=>l.trim()).map(line=>{
      const vals=[];let cur="",inQ=false;
      for(let i=0;i<line.length;i++){
        const ch=line[i];
        if(ch==='"'){
          if(inQ&&line[i+1]==='"'){cur+='"';i++;}  // escaped quote
          else{inQ=!inQ;}
        } else if(ch===","&&!inQ){vals.push(cur.trim());cur="";}
        else{cur+=ch;}
      }
      vals.push(cur.trim());
      return Object.fromEntries(headers.map((h,i)=>[h,vals[i]||""]));
    });
    return{headers,rows};
  }

  /* ── Convert parsed row → CRM record ── */
  function rowToRecord(row,mod,existingAccounts){
    const id=uid();
    const today=new Date().toISOString().slice(0,10);
    if(mod==="accounts"){
      return{id,createdAt:today,name:row.name||"",type:row.type||"Prospect",industry:row.industry||"Other",
        status:row.status||"Active",website:row.website||"",phone:row.phone||"",
        address:row.address||"",city:row.city||"",state:row.state||"",zip:row.zip||"",
        country:row.country||"",annualRevenue:row.annualRevenue||"",employees:row.employees||"",notes:row.notes||""};
    }
    if(mod==="contacts"){
      const acct=existingAccounts.find(a=>a.name.toLowerCase()===row.accountName?.toLowerCase());
      return{id,createdAt:today,name:row.name||"",title:row.title||"",dept:row.dept||"Other",
        role:row.role||"",phone:row.phone||"",email:row.email||"",
        accountId:acct?.id||null,primary:row.primary==="true"||row.primary==="1",notes:row.notes||""};
    }
    if(mod==="leads"){
      return{id,createdAt:today,firstName:row.firstName||"",lastName:row.lastName||"",
        company:row.company||"",title:row.title||"",email:row.email||"",phone:row.phone||"",
        source:row.source||"Other",status:row.status||"New",rating:row.rating||"Cold",
        industry:row.industry||"Other",address:row.address||"",city:row.city||"",
        state:row.state||"",notes:row.notes||"",isConverted:false,convertedAccountId:null,convertedContactId:null};
    }
    if(mod==="opportunities"){
      const acct=existingAccounts.find(a=>a.name.toLowerCase()===row.accountName?.toLowerCase());
      return{id,createdAt:today,name:row.name||"",accountId:acct?.id||null,stage:row.stage||"Prospecting",
        oneTime:row.oneTime||"0",recurring:row.recurring||"0",recurringPeriod:row.recurringPeriod||"Monthly",
        startDate:row.startDate||"",endDate:row.endDate||"",probability:row.probability||"",notes:row.notes||""};
    }
    if(mod==="contracts"){
      const acct=existingAccounts.find(a=>a.name.toLowerCase()===row.accountName?.toLowerCase());
      return{id,createdAt:today,name:row.name||"",type:row.type||"Other",accountId:acct?.id||null,
        status:row.status||"Active",value:row.value||"",startDate:row.startDate||"",endDate:row.endDate||"",notes:row.notes||""};
    }
    return null;
  }

  function handleFile(e){
    const file=e.target.files[0];
    if(!file)return;
    setFileErr("");setRows([]);setMapped([]);setFileName(file.name);
    if(!file.name.endsWith(".csv")){setFileErr("Please upload a CSV file.");return;}
    const reader=new FileReader();
    reader.onload=ev=>{
      const{headers,rows:parsed}=parseCSV(ev.target.result);
      if(!parsed.length){setFileErr("CSV is empty or has no data rows.");return;}
      const required=schema.required;
      const missing=required.filter(r=>!headers.map(h=>h.toLowerCase()).includes(r.toLowerCase()));
      if(missing.length){setFileErr(`Missing required column(s): ${missing.join(", ")}`);return;}
      setRows(parsed);
      const converted=parsed.map(r=>rowToRecord(r,module,accounts)).filter(Boolean);
      setMapped(converted);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  function doImport(){
    setImporting(true);
    setTimeout(()=>{
      const fns={accounts:onImportAccounts,contacts:onImportContacts,opps:onImportOpps,leads:onImportLeads,contracts:onImportContracts};
      fns[module]&&fns[module](mapped);
      setImportResult({count:mapped.length,module:schema.label});
      setStep("done");setImporting(false);
      notify(`${mapped.length} ${schema.label} imported ✓`);
    },600);
  }

  function reset(){setStep("upload");setRows([]);setMapped([]);setFileName("");setFileErr("");setImportResult(null);if(fileRef.current)fileRef.current.value="";}

  /* ── CSV builder ── */
  function toCSV(headers,dataRows){
    const esc=v=>{
      const s=String(v??"");
      return(s.includes(",")||s.includes('"')||s.includes("\n"))?`"${s.replace(/"/g,'""')}"`:s;
    };
    return[headers.join(","),...dataRows.map(r=>headers.map(h=>esc(r[h]??"")).join(","))].join("\n");
  }

  function downloadCSV(name,text){
    const blob=new Blob(["\uFEFF"+text],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=name;a.style.display="none";
    document.body.appendChild(a);a.click();
    setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},200);
  }

  function downloadJSON(name,data){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=name;a.style.display="none";
    document.body.appendChild(a);a.click();
    setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},200);
  }

  function exportModule(mod){
    const s=SCHEMAS[mod];
    const dataMap={accounts,contacts,leads,opportunities:opps,contracts};
    const actualData=dataMap[mod]||[];
    if(!actualData.length){notify("No data to export.");return;}
    downloadCSV(`ensemble_${mod}_${new Date().toISOString().slice(0,10)}.csv`,toCSV(s.fields,actualData));
    notify(`${s.label} exported ✓`);
  }

  function exportAll(){
    const payload={exportedAt:new Date().toISOString(),version:"5.1",accounts,contacts,opps,leads,contracts,acts};
    downloadJSON(`ensemble_backup_${new Date().toISOString().slice(0,10)}.json`,payload);
    notify("Full backup exported ✓");
  }

  function downloadTemplate(mod){
    const s=SCHEMAS[mod];
    downloadCSV(`ensemble_${mod}_template.csv`,toCSV(s.fields,s.sample));
    notify(`${s.label} template downloaded ✓`);
  }

  const MODULES=Object.entries(SCHEMAS);

  /* ─────────────────────────────────────────── */
  return(
    <div style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:3}}>Import &amp; Export</h1>
        <p style={{fontSize:13,color:"#64748b"}}>Bring data in from CSV, download exports, or create a full JSON backup</p>
      </div>

      {/* Tab toggle */}
      <div style={{display:"flex",gap:2,background:"#f1f5f9",padding:4,borderRadius:11,width:"fit-content",marginBottom:24}}>
        {[["import","⬆️  Import Data"],["export","⬇️  Export Data"],["backup","🗄️  Backup / Restore"]].map(([k,lbl])=>
          <button key={k} onClick={()=>{setTab(k);reset();}}
            style={{padding:"7px 22px",borderRadius:8,border:"none",background:tab===k?"#fff":"transparent",color:tab===k?"#6366f1":"#64748b",fontSize:12,fontWeight:tab===k?700:500,cursor:"pointer",boxShadow:tab===k?"0 1px 4px rgba(0,0,0,.10)":"none",transition:"all .15s",whiteSpace:"nowrap"}}>
            {lbl}
          </button>
        )}
      </div>

      {/* ══ IMPORT TAB ══ */}
      {tab==="import"&&<div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>

        {/* Module selector */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em"}}>Select Module</div>
          {MODULES.map(([k,s])=>{
            const active=module===k;
            const cnt={accounts:accounts.length,contacts:contacts.length,leads:leads.length,opportunities:opps.length,contracts:contracts.length}[k]||0;
            return(
              <button key={k} onClick={()=>{setModule(k);reset();}}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",border:"none",borderBottom:"1px solid #f1f5f9",background:active?"#eef2ff":"#fff",cursor:"pointer",textAlign:"left",transition:"background .12s"}}>
                <div style={{width:34,height:34,borderRadius:9,background:active?s.color+"20":"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:active?700:500,color:active?s.color:"#334155"}}>{s.label}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{cnt} existing</div>
                </div>
                {active&&<span style={{color:s.color,fontSize:16}}>›</span>}
              </button>
            );
          })}
        </div>

        {/* Main import area */}
        <div>
          {/* Step indicator */}
          <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:18}}>
            {[["upload","1","Upload CSV"],["preview","2","Preview & Map"],["done","3","Done"]].map(([s,n,lbl],i,arr)=>{
              const done=step==="preview"&&s==="upload"||step==="done"&&s!=="done";
              const active=step===s;
              const c=active?schema.color:done?"#10b981":"#94a3b8";
              return(
                <React.Fragment key={s}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:done?"#10b981":active?schema.color:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:done||active?"#fff":"#94a3b8",transition:"all .2s"}}>
                      {done?"✓":n}
                    </div>
                    <span style={{fontSize:10,fontWeight:active?700:400,color:c,whiteSpace:"nowrap"}}>{lbl}</span>
                  </div>
                  {i<arr.length-1&&<div style={{flex:1,height:2,background:done?"#10b981":"#e2e8f0",margin:"0 8px",marginBottom:14,transition:"background .2s"}}/>}
                </React.Fragment>
              );
            })}
          </div>

          {/* STEP 1 — UPLOAD */}
          {step==="upload"&&<>
            {/* Drop zone */}
            <label style={{display:"block",cursor:"pointer"}}>
              <div style={{border:"2px dashed #c7d2fe",borderRadius:14,padding:"40px 24px",textAlign:"center",background:"#fafbff",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=schema.color;e.currentTarget.style.background="#eef2ff";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#c7d2fe";e.currentTarget.style.background="#fafbff";}}>
                <div style={{fontSize:44,marginBottom:12}}>📂</div>
                <div style={{fontSize:15,fontWeight:700,color:"#334155",marginBottom:6}}>Drop your CSV file here</div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>or click to browse</div>
                <span style={{background:schema.color,color:"#fff",padding:"8px 22px",borderRadius:9,fontSize:13,fontWeight:600,display:"inline-block"}}>Choose CSV File</span>
                <div style={{marginTop:12,fontSize:11,color:"#94a3b8"}}>Only .csv files · UTF-8 encoding recommended</div>
              </div>
              <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{display:"none"}}/>
            </label>

            {fileErr&&<div style={{marginTop:12,padding:"10px 14px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:9,fontSize:12,color:"#dc2626",display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:16}}>⚠️</span>{fileErr}
            </div>}

            {/* Field reference + template download */}
            <div style={{marginTop:16,background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>CSV Column Reference — {schema.label}</span>
                  <span style={{marginLeft:8,fontSize:11,color:"#ef4444",fontWeight:600}}>Required: {schema.required.join(", ")}</span>
                </div>
                <button onClick={()=>downloadTemplate(module)}
                  style={{background:"#eef2ff",color:"#6366f1",border:"none",borderRadius:7,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                  ⬇️ Download Template
                </button>
              </div>
              <div style={{padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:6}}>
                {schema.fields.map(f=>{
                  const req=schema.required.includes(f);
                  return<span key={f} style={{background:req?"#fef3c7":"#f8fafc",color:req?"#92400e":"#475569",border:"1px solid "+(req?"#fde68a":"#e2e8f0"),borderRadius:20,fontSize:11,fontWeight:req?700:400,padding:"3px 10px"}}>{f}{req?" *":""}</span>;
                })}
              </div>
              <div style={{padding:"0 16px 12px",fontSize:11,color:"#94a3b8"}}>
                💡 Use the template to see example data. The <code style={{background:"#f1f5f9",padding:"0 4px",borderRadius:3}}>accountName</code> column is matched to existing accounts by name.
              </div>
            </div>
          </>}

          {/* STEP 2 — PREVIEW */}
          {step==="preview"&&<div>
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:14}}>
              <div style={{padding:"14px 18px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div>
                  <span style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{schema.icon} Preview: {fileName}</span>
                  <span style={{marginLeft:10,fontSize:12,color:"#64748b"}}>{rows.length} row{rows.length!==1?"s":""} found</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn v="ghost" sz="sm" onClick={reset}>← Re-upload</Btn>
                  <button onClick={doImport} disabled={importing}
                    style={{padding:"7px 18px",borderRadius:9,border:"none",background:importing?"#a5b4fc":schema.color,color:"#fff",fontSize:13,fontWeight:700,cursor:importing?"default":"pointer",display:"flex",alignItems:"center",gap:7}}>
                    {importing?<><div className="auth-spin"/>Importing…</>:<>✓ Import {rows.length} {schema.label}</>}
                  </button>
                </div>
              </div>
              {/* Preview table — first 8 rows */}
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",minWidth:500}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      <th style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase"}}>#</th>
                      {Object.keys(rows[0]||{}).slice(0,8).map(h=><th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0,8).map((row,i)=>(
                      <tr key={i} style={{borderTop:"1px solid #f1f5f9"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{padding:"8px 14px",color:"#94a3b8",fontWeight:600}}>{i+1}</td>
                        {Object.values(row).slice(0,8).map((v,j)=><td key={j} style={{padding:"8px 14px",color:"#334155",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v||<span style={{color:"#cbd5e1"}}>—</span>}</td>)}
                      </tr>
                    ))}
                    {rows.length>8&&<tr><td colSpan={9} style={{padding:"8px 14px",color:"#94a3b8",fontStyle:"italic",fontSize:11}}>… and {rows.length-8} more row{rows.length-8!==1?"s":""}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Unmapped account warning */}
            {(module==="contacts"||module==="opportunities"||module==="contracts")&&mapped.filter(r=>rows.find((_,i)=>i===mapped.indexOf(r))&&!r.accountId).length>0&&(
              <div style={{padding:"10px 14px",background:"#fef3c7",border:"1px solid #fde68a",borderRadius:9,fontSize:12,color:"#92400e",display:"flex",gap:8}}>
                <span>⚠️</span>
                <span><strong>{mapped.filter(r=>!r.accountId).length} row(s)</strong> could not be matched to an existing Account by name. They will be imported without an account link — you can assign them later.</span>
              </div>
            )}
          </div>}

          {/* STEP 3 — DONE */}
          {step==="done"&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"48px 32px",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:14}}>🎉</div>
            <div style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:6}}>Import Complete!</div>
            <p style={{fontSize:14,color:"#64748b",marginBottom:24}}>
              <strong style={{color:schema.color}}>{importResult?.count}</strong> {importResult?.module} were added to your CRM.
            </p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={reset}
                style={{padding:"9px 22px",borderRadius:9,border:"none",background:"#eef2ff",color:"#6366f1",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Import More
              </button>
              <button onClick={()=>{setTab("export");reset();}}
                style={{padding:"9px 22px",borderRadius:9,border:"none",background:schema.color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Export to Verify →
              </button>
            </div>
          </div>}
        </div>
      </div>}

      {/* ══ EXPORT TAB ══ */}
      {tab==="export"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:16}}>
          {MODULES.map(([k,s])=>{
            const cnt={accounts:accounts.length,contacts:contacts.length,leads:leads.length,opportunities:opps.length,contracts:contracts.length}[k]||0;
            return(
              <div key={k} style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"20px 22px"}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                  <div style={{width:44,height:44,borderRadius:11,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:2}}>{s.label}</div>
                    <div style={{fontSize:12,color:"#64748b"}}>{cnt} record{cnt!==1?"s":""}</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={()=>exportModule(k)} disabled={cnt===0}
                    style={{padding:"8px 0",borderRadius:8,border:"none",background:cnt>0?s.color+"18":"#f8fafc",color:cnt>0?s.color:"#94a3b8",fontSize:12,fontWeight:600,cursor:cnt>0?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    ⬇️ Export CSV
                  </button>
                  <button onClick={()=>downloadTemplate(k)}
                    style={{padding:"8px 0",borderRadius:8,border:"1px dashed #e2e8f0",background:"#fff",color:"#64748b",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    📋 Template
                  </button>
                </div>
                {cnt===0&&<div style={{marginTop:8,fontSize:11,color:"#94a3b8",textAlign:"center"}}>No data to export</div>}
              </div>
            );
          })}
        </div>
        <div style={{padding:"14px 18px",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",fontSize:12,color:"#64748b"}}>
          💡 <strong style={{color:"#334155"}}>CSV exports</strong> include all fields and are ready to open in Excel, Google Sheets, or Numbers. Use the template files to understand the column format before importing.
        </div>
      </div>}

      {/* ══ BACKUP / RESTORE TAB ══ */}
      {tab==="backup"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>

        {/* Export full backup */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"24px"}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
            <div style={{width:46,height:46,borderRadius:12,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🗄️</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:2}}>Full Backup</div>
              <div style={{fontSize:12,color:"#64748b"}}>Export everything as a single JSON file</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Accounts",accounts.length],["Contacts",contacts.length],["Leads",leads.length],["Opportunities",opps.length],["Contracts",contracts.length],["Activities",acts.length]].map(([l,n])=>
              <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"#64748b"}}>{l}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#334155"}}>{n}</span>
              </div>
            )}
          </div>
          <button onClick={exportAll}
            style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:"0 4px 12px rgba(16,185,129,.25)"}}>
            ⬇️ Download JSON Backup
          </button>
          <div style={{marginTop:10,fontSize:11,color:"#94a3b8",textAlign:"center"}}>Includes all records, IDs, and relationships</div>
        </div>

        {/* Restore from JSON */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"24px"}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
            <div style={{width:46,height:46,borderRadius:12,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>♻️</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:2}}>Restore from Backup</div>
              <div style={{fontSize:12,color:"#64748b"}}>Upload a previously exported JSON file</div>
            </div>
          </div>
          <RestorePanel accounts={accounts} onImportAccounts={onImportAccounts} onImportContacts={onImportContacts}
            onImportOpps={onImportOpps} onImportLeads={onImportLeads} onImportContracts={onImportContracts} notify={notify}/>
        </div>

        {/* localStorage direct */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"24px",gridColumn:"span 2"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:4}}>💻 Direct Browser Console Import</div>
          <p style={{fontSize:12,color:"#64748b",marginBottom:14,lineHeight:1.6}}>
            Advanced users can paste data directly into the browser DevTools console. Press <kbd style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:4,padding:"1px 6px",fontSize:11,fontFamily:"monospace"}}>F12</kbd> → Console tab and run:
          </p>
          <div style={{background:"#0f172a",borderRadius:10,padding:"16px 18px",fontFamily:"monospace",fontSize:12,color:"#a5f3fc",lineHeight:1.8,overflowX:"auto"}}>
            <div style={{color:"#94a3b8"}}>// Replace [...] with your JSON array of records</div>
            <div><span style={{color:"#f9a8d4"}}>localStorage</span><span style={{color:"#fff"}}>.setItem(</span><span style={{color:"#86efac"}}>"ecrm_accts"</span><span style={{color:"#fff"}}>, </span><span style={{color:"#f9a8d4"}}>JSON</span><span style={{color:"#fff"}}>.stringify([...]));</span></div>
            <div><span style={{color:"#f9a8d4"}}>localStorage</span><span style={{color:"#fff"}}>.setItem(</span><span style={{color:"#86efac"}}>"ecrm_contacts"</span><span style={{color:"#fff"}}>, </span><span style={{color:"#f9a8d4"}}>JSON</span><span style={{color:"#fff"}}>.stringify([...]));</span></div>
            <div><span style={{color:"#f9a8d4"}}>localStorage</span><span style={{color:"#fff"}}>.setItem(</span><span style={{color:"#86efac"}}>"ecrm_leads"</span><span style={{color:"#fff"}}>, </span><span style={{color:"#f9a8d4"}}>JSON</span><span style={{color:"#fff"}}>.stringify([...]));</span></div>
            <div><span style={{color:"#f9a8d4"}}>localStorage</span><span style={{color:"#fff"}}>.setItem(</span><span style={{color:"#86efac"}}>"ecrm_opps"</span><span style={{color:"#fff"}}>, </span><span style={{color:"#f9a8d4"}}>JSON</span><span style={{color:"#fff"}}>.stringify([...]));</span></div>
            <div style={{color:"#94a3b8",marginTop:4}}>// Then reload the page</div>
            <div><span style={{color:"#f9a8d4"}}>location</span><span style={{color:"#fff"}}>.reload();</span></div>
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
            {[["ecrm_accts","Accounts"],["ecrm_contacts","Contacts"],["ecrm_leads","Leads"],["ecrm_opps","Opportunities"],["ecrm_contracts","Contracts"],["ecrm_acts","Activities"]].map(([key,label])=>
              <div key={key} style={{background:"#f8fafc",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <code style={{fontSize:11,color:"#6366f1",fontFamily:"monospace"}}>{key}</code>
                <span style={{fontSize:11,color:"#64748b"}}>{label}</span>
              </div>
            )}
          </div>
        </div>
      </div>}
    </div>
  );
}

function RestorePanel({onImportAccounts,onImportContacts,onImportOpps,onImportLeads,onImportContracts,notify}){
  const[status,setStatus]=useState(null);
  const[err,setErr]=useState("");
  const ref=useRef();

  function handleFile(e){
    const file=e.target.files[0];
    if(!file)return;
    setErr("");setStatus(null);
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        let counts={};
        if(data.accounts?.length){onImportAccounts(data.accounts);counts.accounts=data.accounts.length;}
        if(data.contacts?.length){onImportContacts(data.contacts);counts.contacts=data.contacts.length;}
        if(data.leads?.length){onImportLeads(data.leads);counts.leads=data.leads.length;}
        if(data.opps?.length){onImportOpps(data.opps);counts.opportunities=data.opps.length;}
        if(data.contracts?.length){onImportContracts(data.contracts);counts.contracts=data.contracts.length;}
        setStatus(counts);
        notify("Backup restored ✓");
      }catch(ex){setErr("Invalid JSON file. Please upload a backup created by this app.");}
    };
    reader.readAsText(file);
  }

  return(
    <div>
      {!status&&<>
        <div style={{padding:"20px",border:"2px dashed #fde68a",borderRadius:10,textAlign:"center",background:"#fffbeb",marginBottom:12,cursor:"pointer"}}
          onClick={()=>ref.current?.click()}>
          <div style={{fontSize:28,marginBottom:8}}>📤</div>
          <div style={{fontSize:13,fontWeight:600,color:"#92400e",marginBottom:4}}>Click to choose JSON backup file</div>
          <div style={{fontSize:11,color:"#a16207"}}>Only .json files exported from this app</div>
        </div>
        <input ref={ref} type="file" accept=".json" onChange={handleFile} style={{display:"none"}}/>
        {err&&<div style={{padding:"9px 12px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,fontSize:12,color:"#dc2626"}}>{err}</div>}
        <div style={{marginTop:10,padding:"9px 12px",background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,fontSize:11,color:"#92400e"}}>
          ⚠️ <strong>Warning:</strong> Restoring replaces all current data for each module found in the backup.
        </div>
      </>}
      {status&&<div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:36,marginBottom:10}}>✅</div>
        <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:8}}>Backup Restored!</div>
        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
          {Object.entries(status).map(([k,n])=>
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 14px",background:"#f8fafc",borderRadius:7,fontSize:12}}>
              <span style={{color:"#64748b",textTransform:"capitalize"}}>{k}</span>
              <span style={{fontWeight:700,color:"#10b981"}}>{n} records</span>
            </div>
          )}
        </div>
        <button onClick={()=>setStatus(null)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#f1f5f9",color:"#64748b",fontSize:12,cursor:"pointer"}}>Restore Another</button>
      </div>}
    </div>
  );
}

/* ═══ LEAD CHILD COMPONENTS ═══ */

function LeadActivityForm({onClose,onSave}){
  const today=new Date().toISOString().slice(0,10);
  const[f,sf]=useState({type:"In Person",subject:"",notes:"",date:today,duration:""});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  return<Modal title="Log Lead Activity" onClose={onClose} onSave={()=>{if(!f.subject.trim())return alert("Subject required.");onSave(f);}}>
    <div style={{marginBottom:16}}>
      <Lbl>Activity Type</Lbl>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
        {LEAD_ACT_TYPES.map(t=>{
          const m=LEAD_ACT_META[t]||{e:"📋",c:"#64748b",bg:"#f1f5f9"};
          const active=f.type===t;
          return<button key={t} onClick={()=>set("type",t)}
            style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid "+(active?m.c:"#e2e8f0"),background:active?m.bg:"#fff",color:active?m.c:"#64748b",fontSize:12,fontWeight:active?600:400,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <span>{m.e}</span>{t}
          </button>;
        })}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Field label="Subject *" value={f.subject} onChange={v=>set("subject",v)} span={2}/>
      <Field label="Date" value={f.date} onChange={v=>set("date",v)} type="date"/>
      <Field label="Duration (mins)" value={f.duration} onChange={v=>set("duration",v)} type="number" placeholder="e.g. 30"/>
    </div>
    <div style={{marginTop:14}}>
      <Lbl>Notes</Lbl>
      <textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={3}
        placeholder="Key discussion points, decisions, next steps…"
        style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",resize:"vertical"}}/>
    </div>
  </Modal>
}

function LeadActivitiesPanel({acts,onAdd,onDelete}){
  const[showForm,setShowForm]=useState(false);
  const sorted=[...acts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const typeCounts=LEAD_ACT_TYPES.reduce((acc,t)=>{acc[t]=acts.filter(a=>a.type===t).length;return acc;},{});

  return<div>
    {/* Summary strip */}
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
      {LEAD_ACT_TYPES.map(t=>{
        const m=LEAD_ACT_META[t];
        const cnt=typeCounts[t]||0;
        return<div key={t} style={{background:cnt>0?m.bg:"#f8fafc",borderRadius:9,border:"1px solid "+(cnt>0?m.c:"#e2e8f0"),padding:"8px 14px",display:"flex",alignItems:"center",gap:7,minWidth:0}}>
          <span style={{fontSize:16}}>{m.e}</span>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:cnt>0?m.c:"#94a3b8"}}>{t}</div>
            <div style={{fontSize:18,fontWeight:700,color:cnt>0?m.c:"#cbd5e1",lineHeight:1}}>{cnt}</div>
          </div>
        </div>;
      })}
    </div>

    {/* Log button + list */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>Activity Log <span style={{fontSize:12,color:"#94a3b8",fontWeight:400}}>({acts.length})</span></div>
      <Btn sz="sm" onClick={()=>setShowForm(true)}>+ Log Activity</Btn>
    </div>

    {sorted.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#94a3b8",fontSize:13,background:"#f8fafc",borderRadius:10}}>No activities yet — log a meeting, email, or call to start tracking.</div>}

    {sorted.map((act,i)=>{
      const m=LEAD_ACT_META[act.type]||{e:"📋",c:"#64748b",bg:"#f1f5f9"};
      return<div key={act.id} style={{display:"flex",gap:12,padding:"14px 0",borderBottom:i<sorted.length-1?"1px solid #f1f5f9":"none"}}>
        <div style={{width:38,height:38,borderRadius:10,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{m.e}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3,flexWrap:"wrap",gap:6}}>
            <div>
              <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{act.subject}</span>
              <span style={{marginLeft:8,background:m.bg,color:m.c,borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 8px"}}>{act.type}</span>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:11,color:"#94a3b8"}}>{act.date}{act.duration?" · "+act.duration+"m":""}</span>
              <button onClick={()=>{if(window.confirm("Delete this activity?"))onDelete(act.id);}}
                style={{background:"none",border:"none",color:"#ef4444",fontSize:12,cursor:"pointer",padding:0}}>✕</button>
            </div>
          </div>
          {act.notes&&<div style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginTop:2}}>{act.notes}</div>}
        </div>
      </div>;
    })}

    {showForm&&<LeadActivityForm onClose={()=>setShowForm(false)} onSave={d=>{onAdd({...d,id:uid(),createdAt:d.date});setShowForm(false);}}/>}
  </div>
}

function LeadProposalForm({proposal,onClose,onSave}){
  const today=new Date().toISOString().slice(0,10);
  const[f,sf]=useState({
    name:proposal?.name||"",
    version:proposal?.version||"v1.0",
    status:proposal?.status||"Draft",
    amount:proposal?.amount||"",
    sentDate:proposal?.sentDate||"",
    expiryDate:proposal?.expiryDate||"",
    notes:proposal?.notes||"",
    fileName:proposal?.fileName||"",
    fileSize:proposal?.fileSize||0,
    fileData:proposal?.fileData||null,
  });
  const[fileErr,setFileErr]=useState("");
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  const MAX=5*1024*1024;
  const STATUSES=["Draft","Sent","Viewed","Accepted","Declined","Expired"];
  const STATUS_C={Draft:"#64748b",Sent:"#6366f1",Viewed:"#f59e0b",Accepted:"#10b981",Declined:"#ef4444",Expired:"#94a3b8"};

  function handleFile(e){
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>MAX){setFileErr("File exceeds 5 MB limit.");return;}
    setFileErr("");
    const reader=new FileReader();
    reader.onload=ev=>{set("fileName",file.name);set("fileSize",file.size);set("fileData",ev.target.result);};
    reader.readAsDataURL(file);
  }
  function fmtBytes(b){if(!b)return"";if(b<1048576)return(b/1024).toFixed(0)+"KB";return(b/1048576).toFixed(2)+"MB";}

  return<Modal title={proposal?"Edit Proposal":"New Proposal"} wide onClose={onClose}
    onSave={()=>{if(!f.name.trim())return alert("Proposal name required.");onSave(f);}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Field label="Proposal Name *" value={f.name} onChange={v=>set("name",v)} span={2}/>
      <Field label="Version" value={f.version} onChange={v=>set("version",v)} placeholder="v1.0"/>
      <Field label="Value ($)" value={f.amount} onChange={v=>set("amount",v)} type="number" placeholder="0"/>

      <div style={{gridColumn:"span 2"}}>
        <Lbl>Status</Lbl>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
          {STATUSES.map(s=>{
            const active=f.status===s;
            const c=STATUS_C[s]||"#64748b";
            return<button key={s} onClick={()=>set("status",s)}
              style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid "+(active?c:"#e2e8f0"),background:active?"#f8fafc":"#fff",color:active?c:"#64748b",fontSize:12,fontWeight:active?600:400,cursor:"pointer"}}>
              {s}
            </button>;
          })}
        </div>
      </div>

      <Field label="Date Sent" value={f.sentDate} onChange={v=>set("sentDate",v)} type="date"/>
      <Field label="Expiry Date" value={f.expiryDate} onChange={v=>set("expiryDate",v)} type="date"/>
    </div>
    <div style={{marginTop:14}}>
      <Lbl>Notes</Lbl>
      <textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={2}
        placeholder="Scope summary, special terms, next steps…"
        style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",resize:"vertical"}}/>
    </div>

    <div style={{marginTop:16,padding:"14px 16px",background:"#f8fafc",borderRadius:10,border:"1.5px dashed #cbd5e1"}}>
      <div style={{fontSize:12,fontWeight:600,color:"#475569",marginBottom:8}}>📎 Attach Proposal File <span style={{fontWeight:400,color:"#94a3b8"}}>(PDF, DOC, DOCX, PPTX — max 5 MB)</span></div>
      {f.fileName
        ?<div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #e2e8f0"}}>
          <span style={{fontSize:18}}>{f.fileName.toLowerCase().endsWith(".pdf")?"📄":f.fileName.toLowerCase().endsWith(".pptx")?"📊":"📝"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.fileName}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{fmtBytes(f.fileSize)}</div>
          </div>
          <button onClick={()=>{set("fileName","");set("fileSize",0);set("fileData",null);}}
            style={{background:"#fff0f0",border:"none",color:"#ef4444",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",fontWeight:600}}>Remove</button>
        </div>
        :<label style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"18px",cursor:"pointer",borderRadius:8}}
          onMouseEnter={e=>e.currentTarget.style.background="#eef2ff"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{fontSize:28}}>☁️</span>
          <span style={{fontSize:13,color:"#6366f1",fontWeight:600}}>Click to upload or drag &amp; drop</span>
          <span style={{fontSize:11,color:"#94a3b8"}}>PDF · DOC · DOCX · PPTX · up to 5 MB</span>
          <input type="file" accept=".pdf,.doc,.docx,.pptx,.ppt,.txt" onChange={handleFile} style={{display:"none"}}/>
        </label>
      }
      {fileErr&&<div style={{marginTop:6,fontSize:12,color:"#ef4444",fontWeight:500}}>{fileErr}</div>}
    </div>
  </Modal>
}

function LeadProposalsPanel({proposals,onAdd,onEdit,onDelete}){
  const[showForm,setShowForm]=useState(false);
  const[editP,setEditP]=useState(null);
  const STATUS_C={Draft:"#64748b",Sent:"#6366f1",Viewed:"#f59e0b",Accepted:"#10b981",Declined:"#ef4444",Expired:"#94a3b8"};
  const STATUS_BG={Draft:"#f1f5f9",Sent:"#eef2ff",Viewed:"#fef3c7",Accepted:"#ecfdf5",Declined:"#fef2f2",Expired:"#f1f5f9"};
  function fmtBytes(b){if(!b)return"";if(b<1048576)return(b/1024).toFixed(0)+"KB";return(b/1048576).toFixed(2)+"MB";}

  const totalValue=proposals.reduce((s,p)=>s+(Number(p.amount)||0),0);
  const accepted=proposals.filter(p=>p.status==="Accepted");
  const acceptedValue=accepted.reduce((s,p)=>s+(Number(p.amount)||0),0);

  return<div>
    {/* Summary */}
    {proposals.length>0&&<div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
      {[["Total Proposals",proposals.length,"#6366f1","#eef2ff"],["Total Value","$"+totalValue.toLocaleString(),"#10b981","#ecfdf5"],["Accepted",accepted.length+" ("+( proposals.length>0?Math.round(accepted.length/proposals.length*100):0)+"%)","#10b981","#ecfdf5"],["Won Value","$"+acceptedValue.toLocaleString(),"#f59e0b","#fef3c7"]].map(([l,v,c,bg])=>
        <div key={l} style={{background:bg,border:"1px solid "+c,borderRadius:10,padding:"10px 16px"}}>
          <div style={{fontSize:10,color:c,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
          <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
        </div>)}
    </div>}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>Proposals <span style={{fontSize:12,color:"#94a3b8",fontWeight:400}}>({proposals.length})</span></div>
      <Btn sz="sm" onClick={()=>{setEditP(null);setShowForm(true);}}>+ New Proposal</Btn>
    </div>

    {proposals.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#94a3b8",fontSize:13,background:"#f8fafc",borderRadius:10}}>No proposals yet — create your first proposal for this lead.</div>}

    {proposals.map((p,i)=>{
      const sc=STATUS_C[p.status]||"#64748b";
      const sbg=STATUS_BG[p.status]||"#f1f5f9";
      const fileIcon=p.fileName?.toLowerCase().endsWith(".pdf")?"📄":p.fileName?.toLowerCase().endsWith(".pptx")?"📊":"📝";
      const isExpired=p.expiryDate&&new Date(p.expiryDate)<new Date();
      const daysLeft=p.expiryDate?Math.round((new Date(p.expiryDate)-new Date())/86400000):null;
      return<div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"16px 18px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f172a",marginBottom:4}}>{p.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{background:sbg,color:sc,borderRadius:20,fontSize:11,fontWeight:600,padding:"2px 10px"}}>{p.status}</span>
              <span style={{background:"#f1f5f9",color:"#64748b",borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 8px"}}>{p.version}</span>
              {isExpired&&p.status!=="Accepted"&&<span style={{background:"#fef2f2",color:"#ef4444",borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 8px"}}>Expired</span>}
              {!isExpired&&daysLeft!==null&&daysLeft<=14&&daysLeft>=0&&<span style={{background:"#fff7ed",color:"#f97316",borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 8px"}}>⚠️ {daysLeft}d left</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <Btn sz="sm" v="ghost" onClick={()=>{setEditP(p);setShowForm(true);}}>Edit</Btn>
            <Btn sz="sm" v="danger" onClick={()=>{if(window.confirm("Delete this proposal?"))onDelete(p.id);}}>Delete</Btn>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:p.notes||p.fileName?10:0}}>
          {[["Value",p.amount?("$"+Number(p.amount).toLocaleString()):"—"],["Sent",p.sentDate?p.sentDate:"—"],["Expires",p.expiryDate?p.expiryDate:"—"]].map(([l,v])=>
            <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#334155"}}>{v}</div>
            </div>)}
        </div>

        {p.notes&&<div style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:p.fileName?8:0,fontStyle:"italic"}}>{p.notes}</div>}

        {p.fileName&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,marginTop:6}}>
          <span style={{fontSize:16}}>{fileIcon}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fileName}</div>
            <div style={{fontSize:10,color:"#94a3b8"}}>{fmtBytes(p.fileSize)}</div>
          </div>
          {p.fileData
            ?<a href={p.fileData} download={p.fileName} style={{background:"#eef2ff",color:"#6366f1",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:600,textDecoration:"none"}}>↓ Download</a>
            :<span style={{background:"#f8fafc",color:"#94a3b8",borderRadius:6,padding:"3px 10px",fontSize:11}}>Demo file</span>
          }
        </div>}
      </div>;
    })}

    {showForm&&<LeadProposalForm proposal={editP} onClose={()=>{setShowForm(false);setEditP(null);}}
      onSave={d=>{
        const data={...d,id:editP?.id||uid(),createdAt:editP?.createdAt||new Date().toISOString().slice(0,10)};
        if(editP){onEdit(data);}else{onAdd(data);}
        setShowForm(false);setEditP(null);
      }}/>}
  </div>
}

/* ═══ APP ROOT ═══ */
function App(){
  const[currentUser,setCurrentUser]=useState(null);
  const[users,setUsers]=useState([]);
  const[accounts,setAccounts]=useState([]);
  const[contacts,setContacts]=useState([]);
  const[opps,setOpps]=useState([]);
  const[acts,setActs]=useState([]);
  const[leads,setLeads]=useState([]);
  const[contracts,setContracts]=useState([]);
  const[leadActs,setLeadActs]=useState([]);
  const[leadProposals,setLeadProposals]=useState([]);

  const[nav,setNav]=useState("dashboard");
  const[selAcct,setSelAcct]=useState(null);
  const[selContact,setSelContact]=useState(null);
  const[selLead,setSelLead]=useState(null);
  const[selOpp,setSelOpp]=useState(null);
  const[prevNav,setPrevNav]=useState(null);

  const[showAF,setShowAF]=useState(false);
  const[showCF,setShowCF]=useState(false);
  const[editContact,setEditContact]=useState(null);
  const[showOF,setShowOF]=useState(false);
  const[editOpp,setEditOpp]=useState(null);
  const[showAcctF,setShowAcctF]=useState(false);
  const[editAcct,setEditAcct]=useState(null);
  const[showLF,setShowLF]=useState(false);
  const[editLead,setEditLead]=useState(null);
  const[convertLead,setConvertLead]=useState(null);

  const[toast,setToast]=useState(null);

  useEffect(()=>{
    // Restore session
    const sess=ls("ecrm_session");
    if(sess&&sess.id){setCurrentUser(sess);}
    // Load users
    setUsers(ls("ecrm_users")||[]);
    setAccounts(ls("ecrm_accts")||D_ACCOUNTS);
    setContacts(ls("ecrm_contacts")||D_CONTACTS);
    setOpps(ls("ecrm_opps")||D_OPPS);
    setActs(ls("ecrm_acts")||D_ACTS);
    setLeads(ls("ecrm_leads")||D_LEADS);
    setContracts(ls("ecrm_contracts")||D_CONTRACTS);
    setLeadActs(ls("ecrm_lead_acts")||D_LEAD_ACTS);
    setLeadProposals(ls("ecrm_lead_proposals")||D_LEAD_PROPOSALS);
    const s=document.getElementById("splash");if(s){s.style.opacity="0";setTimeout(()=>s.style.display="none",300);}
  },[]);

  const saveAccts=v=>{setAccounts(v);lss("ecrm_accts",v);};
  const saveCons=v=>{setContacts(v);lss("ecrm_contacts",v);};
  const saveOpps=v=>{setOpps(v);lss("ecrm_opps",v);};
  const saveActs=v=>{setActs(v);lss("ecrm_acts",v);};
  const saveLeads=v=>{setLeads(v);lss("ecrm_leads",v);};
  const saveContracts=v=>{setContracts(v);lss("ecrm_contracts",v);};
  const saveLeadActs=v=>{setLeadActs(v);lss("ecrm_lead_acts",v);};
  const saveLeadProposals=v=>{setLeadProposals(v);lss("ecrm_lead_proposals",v);};
  const saveUsers=v=>{setUsers(v);lss("ecrm_users",v);};

  function handleLogin(user){
    const u={...user,lastLogin:new Date().toISOString().slice(0,10)};
    setCurrentUser(u);
    lss("ecrm_session",u);
    // Persist lastLogin back into user list (skip built-in Admin)
    if(u.id!=="u0"){
      const next=(ls("ecrm_users")||[]).map(x=>x.id===u.id?{...x,lastLogin:u.lastLogin}:x);
      saveUsers(next);
    }
  }
  function handleLogout(){
    setCurrentUser(null);
    lss("ecrm_session",null);
    setNav("dashboard");
  }

  function notify(msg){setToast(msg);setTimeout(()=>setToast(null),2800);}

  function openAccount(a){setSelAcct(a);setNav("account-detail");}
  function openContact(c){setSelContact(c);setPrevNav(nav);setNav("contact-detail");}
  function openLead(l){setSelLead(l);setNav("lead-detail");}
  function openOpp(o){setSelOpp(o);setPrevNav(nav);setNav("opp-detail");}

  const liveAcct=selAcct?accounts.find(a=>a.id===selAcct.id)||selAcct:null;
  const liveLead=selLead?leads.find(l=>l.id===selLead.id)||selLead:null;
  const liveOpp=selOpp?opps.find(o=>o.id===selOpp.id)||selOpp:null;

  function handleConvert(data){
    const today=new Date().toISOString().slice(0,10);
    if(!data.useExisting){
      const next=[data.acct,...accounts];
      saveAccts(next);
    }
    const nextCons=[data.contact,...contacts];
    saveCons(nextCons);
    if(data.opp){
      saveOpps([data.opp,...opps]);
    }
    const nextLeads=leads.map(l=>l.id===convertLead.id?{...l,status:"Converted",isConverted:true,convertedAt:today,convertedAccountId:data.newAcctId,convertedContactId:data.newConId}:l);
    saveLeads(nextLeads);
    setConvertLead(null);
    notify("Lead converted successfully ✓");
    setNav("accounts");setSelAcct(null);
  }

  const NAV_ITEMS=[
    {k:"dashboard",label:"Home"},
    {k:"leads",label:"Leads"},
    {k:"accounts",label:"Accounts"},
    {k:"contacts",label:"Contacts"},
    {k:"opportunities",label:"Opportunities"},
    {k:"contracts",label:"Contracts"},
    {k:"activities",label:"Activities"},
    {k:"import",label:"Import / Export"},
    ...(currentUser?.role==="Admin"?[{k:"users",label:"Users"}]:[]),
  ];
  const[sideOpen,setSideOpen]=useState(true);
  const[globalSearch,setGlobalSearch]=useState("");
  const[showSearch,setShowSearch]=useState(false);

  // ── Gate: show login if not authenticated ──
  if(!currentUser){
    return <LoginScreen users={users} onLogin={handleLogin}/>;
  }

  return<div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
    {toast&&<div style={{position:"fixed",top:12,right:12,zIndex:999,background:"#10b981",color:"#fff",padding:"9px 16px",borderRadius:10,fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",pointerEvents:"none"}}>{toast}</div>}

    {/* ════ COLLAPSIBLE SIDEBAR ════ */}
    <div style={{width:sideOpen?228:60,minWidth:sideOpen?228:60,background:"#0f172a",display:"flex",flexDirection:"column",height:"100vh",transition:"width .2s ease",overflow:"hidden",flexShrink:0,borderRight:"1px solid #1e293b"}}>

      {/* Logo row */}
      <div style={{height:56,display:"flex",alignItems:"center",padding:"0 14px",borderBottom:"1px solid #1e293b",gap:10,flexShrink:0}}>
        {sideOpen
          ?<a href="https://ensembledigilabs.com" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",flex:1,overflow:"hidden",minWidth:0}}
             onMouseEnter={function(e){e.currentTarget.style.opacity="0.85";}}
             onMouseLeave={function(e){e.currentTarget.style.opacity="1";}}>
            <img src="https://ensembledigilabs.com/assets/images/logo-2.png" alt="Ensemble Digital Labs"
              style={{height:32,maxWidth:140,objectFit:"contain",flexShrink:0,filter:"brightness(0) invert(1)"}}/>
          </a>
          :<div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0,marginLeft:"auto"}}>E</div>
        }
        <button title={sideOpen?"Collapse sidebar":"Expand sidebar"}
          onClick={function(){setSideOpen(function(p){return !p;});}}
          style={{background:"none",border:"none",cursor:"pointer",padding:0,color:"#475569",display:"flex",alignItems:"center",flexShrink:0,marginLeft:sideOpen?0:"auto"}}
          onMouseEnter={function(e){e.currentTarget.style.color="#94a3b8";}}
          onMouseLeave={function(e){e.currentTarget.style.color="#475569";}}>
          <span dangerouslySetInnerHTML={{__html:sideOpen?SVGICONS.chevL:SVGICONS.chevR}}></span>
        </button>
      </div>

      {/* Nav items */}
      <div style={{flex:1,padding:"10px 8px",overflowY:"auto",overflowX:"hidden"}}>
        {sideOpen&&<div style={{fontSize:9,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:".1em",padding:"4px 6px 8px"}}>MAIN MENU</div>}
        {!sideOpen&&<div style={{height:6}}></div>}
        {NAV_ITEMS.map(function(item){
          var k=item.k,label=item.label;
          var isAccts=k==="accounts"&&(nav==="account-detail"||(nav==="contact-detail"&&prevNav!=="contacts"));
          var isCons =k==="contacts"&&(nav==="contact-detail"&&prevNav==="contacts");
          var isLeads=k==="leads"&&(nav==="leads"||nav==="lead-detail");
          var isOpps =k==="opportunities"&&(nav==="opportunities"||nav==="opp-detail");
          var active =nav===k||isAccts||isCons||isLeads||isOpps;
          var badge  =k==="leads"?leads.filter(function(l){return !l.isConverted;}).length:0;
          return<div key={k} style={{position:"relative",marginBottom:2}}>
            {active&&<span style={{position:"absolute",left:0,top:"18%",height:"64%",width:3,background:"#6366f1",borderRadius:"0 3px 3px 0",zIndex:1}}></span>}
            <button title={!sideOpen?label:""}
              onClick={function(){if(k==="accounts")setSelAcct(null);if(k==="leads")setSelLead(null);if(k==="opportunities")setSelOpp(null);setNav(k);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sideOpen?"9px 10px":"10px 0",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:active?"rgba(99,102,241,0.18)":"transparent",color:active?"#a5b4fc":"#64748b",cursor:"pointer",fontSize:13,fontWeight:active?600:400,transition:"background .15s,color .15s"}}
              onMouseEnter={function(e){if(!active){e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="#94a3b8";}}}
              onMouseLeave={function(e){e.currentTarget.style.background=active?"rgba(99,102,241,0.18)":"transparent";e.currentTarget.style.color=active?"#a5b4fc":"#64748b";}}>
              <span style={{flexShrink:0,display:"flex",alignItems:"center"}} dangerouslySetInnerHTML={{__html:SVGICONS[k]||""}}></span>
              {sideOpen&&<span style={{flex:1,textAlign:"left",whiteSpace:"nowrap",overflow:"hidden"}}>{label}</span>}
              {sideOpen&&badge>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:10,fontSize:9,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{badge}</span>}
              {!sideOpen&&badge>0&&<span style={{position:"absolute",top:5,right:5,background:"#ef4444",color:"#fff",borderRadius:"50%",fontSize:8,fontWeight:700,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{badge}</span>}
            </button>
          </div>;
        })}

        {/* Quick-add divider */}
        <div style={{borderTop:"1px solid #1e293b",margin:"10px 4px"}}></div>
        {sideOpen&&<div style={{fontSize:9,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:".1em",padding:"4px 6px 8px"}}>QUICK ADD</div>}

        <div style={{position:"relative",marginBottom:2}}>
          <button title={!sideOpen?"New Lead":""}
            onClick={function(){setEditLead(null);setShowLF(true);}}
            style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:sideOpen?"8px 10px":"9px 0",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",color:"#475569",cursor:"pointer",fontSize:12,fontWeight:500,transition:"background .15s,color .15s"}}
            onMouseEnter={function(e){e.currentTarget.style.background="rgba(99,102,241,0.12)";e.currentTarget.style.color="#a5b4fc";}}
            onMouseLeave={function(e){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#475569";}}>
            <span style={{width:22,height:22,borderRadius:6,border:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} dangerouslySetInnerHTML={{__html:SVGICONS.plus}}></span>
            {sideOpen&&<span style={{whiteSpace:"nowrap"}}>New Lead</span>}
          </button>
        </div>

        <div style={{position:"relative",marginBottom:2}}>
          <button title={!sideOpen?"New Account":""}
            onClick={function(){setEditAcct(null);setShowAcctF(true);}}
            style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:sideOpen?"8px 10px":"9px 0",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",color:"#475569",cursor:"pointer",fontSize:12,fontWeight:500,transition:"background .15s,color .15s"}}
            onMouseEnter={function(e){e.currentTarget.style.background="rgba(99,102,241,0.12)";e.currentTarget.style.color="#a5b4fc";}}
            onMouseLeave={function(e){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#475569";}}>
            <span style={{width:22,height:22,borderRadius:6,border:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} dangerouslySetInnerHTML={{__html:SVGICONS.plus}}></span>
            {sideOpen&&<span style={{whiteSpace:"nowrap"}}>New Account</span>}
          </button>
        </div>
      </div>

      {/* User footer */}
      <div style={{padding:"10px 10px 12px",borderTop:"1px solid #1e293b",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* Avatar */}
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>
            {(currentUser?.name||currentUser?.username||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
          </div>
          {sideOpen&&<>
            <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser?.name||currentUser?.username}</div>
              <div style={{fontSize:10,color:"#475569",whiteSpace:"nowrap"}}>
                <span style={{background:(ROLE_META[currentUser?.role]||ROLE_META.Viewer).bg,color:(ROLE_META[currentUser?.role]||ROLE_META.Viewer).c,borderRadius:6,padding:"1px 5px",fontSize:9,fontWeight:700}}>{currentUser?.role}</span>
              </div>
            </div>
            <button title="Sign out" onClick={handleLogout}
              style={{background:"none",border:"none",cursor:"pointer",color:"#475569",padding:5,borderRadius:7,display:"flex",alignItems:"center",flexShrink:0,transition:"all .12s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#ef4444";e.currentTarget.style.background="rgba(239,68,68,.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="#475569";e.currentTarget.style.background="none";}}>
              <span dangerouslySetInnerHTML={{__html:SVGICONS.signout}}/>
            </button>
          </>}
          {!sideOpen&&<button title="Sign out" onClick={handleLogout}
            style={{background:"none",border:"none",cursor:"pointer",color:"#475569",padding:4,borderRadius:6,display:"flex",marginLeft:"auto"}}
            onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
            onMouseLeave={e=>e.currentTarget.style.color="#475569"}>
            <span dangerouslySetInnerHTML={{__html:SVGICONS.signout}}/>
          </button>}
        </div>
      </div>
    </div>

    {/* ════ MAIN AREA ════ */}
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Topbar with Global Search */}
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",height:52,display:"flex",alignItems:"center",padding:"0 22px",gap:12,flexShrink:0,position:"relative",zIndex:200}}>

        {/* Breadcrumb */}
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,minWidth:0,flexShrink:0}}>
          <span style={{color:"#94a3b8",fontWeight:500,textTransform:"capitalize"}}>
            {nav==="account-detail"||nav==="contact-detail"?"Accounts":nav==="lead-detail"?"Leads":nav==="opp-detail"?"Opportunities":nav==="users"?"Users":nav==="contracts"?"Contracts":nav==="import"?"Import / Export":nav==="dashboard"?"Home":nav}
          </span>
          {nav==="account-detail"&&liveAcct&&<span style={{color:"#cbd5e1"}}>/</span>}
          {nav==="account-detail"&&liveAcct&&<span style={{color:"#334155",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{liveAcct.name}</span>}
          {nav==="lead-detail"&&liveLead&&<span style={{color:"#cbd5e1"}}>/</span>}
          {nav==="lead-detail"&&liveLead&&<span style={{color:"#334155",fontWeight:600,whiteSpace:"nowrap"}}>{((liveLead.firstName||"")+" "+(liveLead.lastName||"")).trim()||liveLead.company}</span>}
          {nav==="contact-detail"&&selContact&&<span style={{color:"#cbd5e1"}}>/</span>}
          {nav==="contact-detail"&&selContact&&<span style={{color:"#334155",fontWeight:600}}>{selContact.name}</span>}
        </div>

        {/* Global Search Box */}
        <div style={{flex:1,position:"relative",maxWidth:420}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none",fontSize:14}}>🔍</span>
            <input
              value={globalSearch}
              onChange={function(e){setGlobalSearch(e.target.value);setShowSearch(e.target.value.length>0);}}
              onFocus={function(){if(globalSearch.length>0)setShowSearch(true);}}
              onBlur={function(){setTimeout(function(){setShowSearch(false);},200);}}
              placeholder="Search leads, accounts, contacts, opportunities…"
              style={{width:"100%",padding:"8px 12px 8px 32px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",background:"#f8fafc",color:"#0f172a",transition:"border-color .15s,background .15s"}}
              onMouseEnter={function(e){e.target.style.borderColor="#6366f1";}}
              onMouseLeave={function(e){if(document.activeElement!==e.target)e.target.style.borderColor="#e2e8f0";}}
            />
            {globalSearch&&<button onClick={function(){setGlobalSearch("");setShowSearch(false);}}
              style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:14,lineHeight:1}}>✕</button>}
          </div>

          {/* Search Results Dropdown */}
          {showSearch&&globalSearch.length>0&&(function(){
            var q=globalSearch.toLowerCase();
            var results=[];
            leads.forEach(function(l){
              var name=((l.firstName||"")+" "+(l.lastName||"")).trim();
              if(name.toLowerCase().includes(q)||(l.company||"").toLowerCase().includes(q)||(l.email||"").toLowerCase().includes(q))
                results.push({type:"Lead",icon:"👤",label:name||l.company,sub:l.company,color:"#6366f1",bg:"#eef2ff",action:function(){setSelLead(l);setNav("lead-detail");setGlobalSearch("");setShowSearch(false);}});
            });
            accounts.forEach(function(a){
              if((a.name||"").toLowerCase().includes(q)||(a.industry||"").toLowerCase().includes(q))
                results.push({type:"Account",icon:"🏢",label:a.name,sub:a.industry+" · "+a.type,color:"#10b981",bg:"#ecfdf5",action:function(){setSelAcct(a);setNav("account-detail");setGlobalSearch("");setShowSearch(false);}});
            });
            contacts.forEach(function(c){
              if((c.name||"").toLowerCase().includes(q)||(c.email||"").toLowerCase().includes(q)||(c.title||"").toLowerCase().includes(q))
                results.push({type:"Contact",icon:"👥",label:c.name,sub:c.title||c.role,color:"#8b5cf6",bg:"#f5f3ff",action:function(){setSelContact(c);setPrevNav(nav);setNav("contact-detail");setGlobalSearch("");setShowSearch(false);}});
            });
            opps.forEach(function(o){
              var acctName=(accounts.find(function(a){return a.id===o.accountId;})||{}).name||"";
              if((o.name||"").toLowerCase().includes(q)||acctName.toLowerCase().includes(q))
                results.push({type:"Opportunity",icon:"💰",label:o.name,sub:acctName+" · "+o.stage,color:"#f59e0b",bg:"#fef3c7",action:function(){setNav("opportunities");setGlobalSearch("");setShowSearch(false);}});
            });
            if(results.length===0)return<div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#fff",borderRadius:10,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",border:"1px solid #e2e8f0",padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:13,zIndex:300}}>No results for "<strong>{globalSearch}</strong>"</div>;
            return<div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#fff",borderRadius:10,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",border:"1px solid #e2e8f0",overflow:"hidden",zIndex:300,maxHeight:380,overflowY:"auto"}}>
              <div style={{padding:"8px 14px",borderBottom:"1px solid #f1f5f9",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em"}}>{results.length} result{results.length!==1?"s":""}</div>
              {results.map(function(r,i){
                return<div key={i} onClick={r.action}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",borderBottom:i<results.length-1?"1px solid #f8fafc":"none"}}
                  onMouseEnter={function(e){e.currentTarget.style.background="#f8fafc";}}
                  onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                  <div style={{width:32,height:32,borderRadius:8,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{r.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</div>
                    <div style={{fontSize:11,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.sub}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,color:r.color,background:r.bg,padding:"2px 8px",borderRadius:20,flexShrink:0}}>{r.type}</span>
                </div>;
              })}
            </div>;
          })()}
        </div>

        {/* Action buttons */}
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <Btn v="ghost" sz="sm" onClick={function(){setEditLead(null);setShowLF(true);}}>+ Lead</Btn>
          <Btn sz="sm" onClick={function(){setEditAcct(null);setShowAcctF(true);}}>+ Account</Btn>
        </div>
      </div>

      {/* Page content */}
      <div style={{flex:1,overflowY:"auto"}}>

      {nav==="dashboard"&&<Dashboard accounts={accounts} contacts={contacts} opps={opps} acts={acts} onViewAccount={openAccount}/>}

      {nav==="leads"&&<LeadsList leads={leads}
        onView={openLead}
        onAdd={()=>{setEditLead(null);setShowLF(true);}}
        onConvert={l=>setConvertLead(l)}/>}

      {nav==="lead-detail"&&liveLead&&<LeadDetail
        lead={liveLead}
        convertedAccount={liveLead.convertedAccountId?accounts.find(a=>a.id===liveLead.convertedAccountId):null}
        leadActs={leadActs.filter(a=>a.leadId===liveLead.id).sort((a,b)=>new Date(b.date)-new Date(a.date))}
        leadProposals={leadProposals.filter(p=>p.leadId===liveLead.id)}
        onBack={()=>{setNav("leads");setSelLead(null);}}
        onEdit={()=>{setEditLead(liveLead);setShowLF(true);}}
        onDelete={()=>{saveLeads(leads.filter(l=>l.id!==liveLead.id));notify("Lead deleted");setNav("leads");setSelLead(null);}}
        onStatusChange={s=>{saveLeads(leads.map(l=>l.id===liveLead.id?{...l,status:s}:l));notify("Status updated");}}
        onConvert={l=>setConvertLead(l)}
        onSaveAct={a=>{saveLeadActs([a,...leadActs]);notify("Activity logged ✓");}}
        onDeleteAct={id=>{saveLeadActs(leadActs.filter(a=>a.id!==id));notify("Activity removed");}}
        onSaveProposal={p=>{saveLeadProposals([p,...leadProposals]);notify("Proposal added ✓");}}
        onEditProposal={p=>{saveLeadProposals(leadProposals.map(x=>x.id===p.id?p:x));notify("Proposal updated ✓");}}
        onDeleteProposal={id=>{saveLeadProposals(leadProposals.filter(p=>p.id!==id));notify("Proposal deleted");}}/>}

      {nav==="accounts"&&!selAcct&&<AccountsList accounts={accounts} contacts={contacts} opps={opps}
        onView={openAccount} onAdd={()=>{setEditAcct(null);setShowAcctF(true);}}/>}

      {nav==="account-detail"&&liveAcct&&<AccountDetail
        account={liveAcct}
        contacts={contacts.filter(c=>c.accountId===liveAcct.id)}
        opps={opps.filter(o=>o.accountId===liveAcct.id)}
        acts={acts.filter(a=>a.accountId===liveAcct.id)}
        contracts={contracts.filter(c=>c.accountId===liveAcct.id)}
        allAccounts={accounts}
        onBack={()=>{setNav("accounts");setSelAcct(null);}}
        onEdit={()=>{setEditAcct(liveAcct);setShowAcctF(true);}}
        onDelete={()=>{
          saveAccts(accounts.filter(a=>a.id!==liveAcct.id));
          saveCons(contacts.filter(c=>c.accountId!==liveAcct.id));
          saveOpps(opps.filter(o=>o.accountId!==liveAcct.id));
          saveActs(acts.filter(a=>a.accountId!==liveAcct.id));
          saveContracts(contracts.filter(c=>c.accountId!==liveAcct.id));
          notify("Account deleted");setNav("accounts");setSelAcct(null);
        }}
        onStatusChange={s=>{const next=accounts.map(a=>a.id===liveAcct.id?{...a,status:s}:a);saveAccts(next);notify(`Status → ${s}`);}}
        onSaveContact={c=>{const ex=contacts.find(x=>x.id===c.id);saveCons(ex?contacts.map(x=>x.id===c.id?c:x):[c,...contacts]);notify(ex?"Contact updated ✓":"Contact added ✓");}}
        onDeleteContact={id=>{saveCons(contacts.filter(c=>c.id!==id));notify("Contact removed");}}
        onSaveOpp={o=>{const ex=opps.find(x=>x.id===o.id);saveOpps(ex?opps.map(x=>x.id===o.id?o:x):[o,...opps]);notify(ex?"Opportunity updated ✓":"Opportunity added ✓");}}
        onDeleteOpp={id=>{saveOpps(opps.filter(o=>o.id!==id));notify("Opportunity removed");}}
        onSaveAct={a=>{saveActs([a,...acts]);notify("Activity logged ✓");}}
        onDeleteAct={id=>{saveActs(acts.filter(a=>a.id!==id));notify("Activity removed");}}
        onSaveContract={c=>{const ex=contracts.find(x=>x.id===c.id);saveContracts(ex?contracts.map(x=>x.id===c.id?c:x):[c,...contracts]);notify(ex?"Contract updated ✓":"Contract added ✓");}}
        onDeleteContract={id=>{saveContracts(contracts.filter(c=>c.id!==id));notify("Contract deleted");}}
        onViewContact={c=>{setSelContact(c);setPrevNav("account-detail");setNav("contact-detail");}}
        onViewOpp={openOpp}
      />}

      {nav==="contacts"&&<ContactsGlobal contacts={contacts} accounts={accounts} opps={opps}
        onView={c=>{setSelContact(c);setPrevNav("contacts");setNav("contact-detail");}}
        onAdd={()=>{setEditContact(null);setShowCF(true);}}
        onViewAccount={openAccount}/>}

      {nav==="contact-detail"&&selContact&&<ContactDetail
        contact={selContact}
        account={accounts.find(a=>a.id===selContact.accountId)}
        opps={opps.filter(o=>o.accountId===selContact.accountId)}
        onBack={()=>{setNav(prevNav||"contacts");}}
        onEdit={()=>{setEditContact(selContact);setShowCF(true);}}
        onDelete={()=>{saveCons(contacts.filter(c=>c.id!==selContact.id));notify("Contact deleted");setNav(prevNav||"contacts");}}
        onViewAccount={a=>{openAccount(a);}}
      />}

      {nav==="opportunities"&&<OpportunitiesPipeline opps={opps} accounts={accounts}
        onAdd={()=>{setEditOpp(null);setShowOF(true);}}
        onEdit={o=>{setEditOpp(o);setShowOF(true);}}
        onDelete={id=>{saveOpps(opps.filter(o=>o.id!==id));notify("Opportunity removed");}}
        onView={openOpp}/>}

      {nav==="activities"&&<ActivitiesGlobal
        acts={acts}
        accounts={accounts}
        onDelete={id=>{saveActs(acts.filter(a=>a.id!==id));notify("Activity removed");}}
        onViewAccount={openAccount}
        onSaveAct={a=>{saveActs([a,...acts]);notify("Activity logged ✓");}}/>}

      {nav==="contracts"&&<ContractsScreen
        contracts={contracts}
        accounts={accounts}
        notify={notify}
        onSave={c=>{
          const ex=contracts.find(x=>x.id===c.id);
          saveContracts(ex?contracts.map(x=>x.id===c.id?c:x):[c,...contracts]);
        }}
        onDelete={id=>{saveContracts(contracts.filter(c=>c.id!==id));notify("Contract deleted");}}
      />}

      {nav==="users"&&currentUser?.role==="Admin"&&<UserAdmin
        users={users}
        currentUser={currentUser}
        notify={notify}
        onSave={u=>{
          const next=users.find(x=>x.id===u.id)?users.map(x=>x.id===u.id?u:x):[...users,u];
          saveUsers(next);
        }}
        onDelete={id=>{saveUsers(users.filter(u=>u.id!==id));}}
        onToggleStatus={(id,status)=>{saveUsers(users.map(u=>u.id===id?{...u,status}:u));}}
      />}

      {nav==="import"&&<ImportExport
        accounts={accounts} contacts={contacts} opps={opps} leads={leads} contracts={contracts} acts={acts}
        notify={notify}
        onImportAccounts={rows=>{saveAccts([...accounts,...rows]);}}
        onImportContacts={rows=>{saveCons([...contacts,...rows]);}}
        onImportOpps={rows=>{saveOpps([...opps,...rows]);}}
        onImportLeads={rows=>{saveLeads([...leads,...rows]);}}
        onImportContracts={rows=>{saveContracts([...contracts,...rows]);}}
      />}

      {nav==="opp-detail"&&liveOpp&&<OppDetail
        opp={liveOpp}
        account={accounts.find(a=>a.id===liveOpp.accountId)}
        acts={acts}
        allAccounts={accounts}
        onBack={()=>{setNav(prevNav||"opportunities");setSelOpp(null);}}
        onEdit={()=>{setEditOpp(liveOpp);setShowOF(true);}}
        onDelete={id=>{saveOpps(opps.filter(o=>o.id!==id));notify("Opportunity removed");setNav("opportunities");setSelOpp(null);}}
        onSaveAct={a=>{saveActs([a,...acts]);notify("Activity logged ✓");}}
        onDeleteAct={id=>{saveActs(acts.filter(a=>a.id!==id));notify("Activity removed");}}/>}
      </div>
    </div>

    {/* Global modals */}
    {/* Global modals */}
    {showAcctF&&<AccountForm account={editAcct} onClose={()=>{setShowAcctF(false);setEditAcct(null);}}
      onSave={d=>{
        if(editAcct){const next=accounts.map(a=>a.id===editAcct.id?{...a,...d}:a);saveAccts(next);notify("Account updated ✓");}
        else{saveAccts([{...d,id:uid(),createdAt:new Date().toISOString().slice(0,10)},...accounts]);notify("Account added ✓");}
        setShowAcctF(false);setEditAcct(null);
      }}/>}

    {showCF&&<ContactForm contact={editContact} accounts={accounts} onClose={()=>{setShowCF(false);setEditContact(null);}}
      onSave={d=>{
        const data={...d,id:editContact?.id||uid(),createdAt:editContact?.createdAt||new Date().toISOString().slice(0,10)};
        const ex=contacts.find(c=>c.id===data.id);
        saveCons(ex?contacts.map(c=>c.id===data.id?data:c):[data,...contacts]);
        notify(ex?"Contact updated ✓":"Contact added ✓");setShowCF(false);setEditContact(null);
      }}/>}

    {showOF&&<OppForm opp={editOpp} accounts={accounts} onClose={()=>{setShowOF(false);setEditOpp(null);}}
      onSave={d=>{
        const data={...d,id:editOpp?.id||uid(),createdAt:editOpp?.createdAt||new Date().toISOString().slice(0,10)};
        const ex=opps.find(o=>o.id===data.id);
        saveOpps(ex?opps.map(o=>o.id===data.id?data:o):[data,...opps]);
        notify(ex?"Opportunity updated ✓":"Opportunity added ✓");setShowOF(false);setEditOpp(null);
      }}/>}

    {showLF&&<LeadForm lead={editLead} onClose={()=>{setShowLF(false);setEditLead(null);}}
      onSave={d=>{
        if(editLead){
          saveLeads(leads.map(l=>l.id===editLead.id?{...l,...d}:l));
          notify("Lead updated ✓");
        } else {
          saveLeads([{...d,id:uid(),createdAt:new Date().toISOString().slice(0,10),isConverted:false,convertedAccountId:null,convertedContactId:null,convertedAt:null},...leads]);
          notify("Lead added ✓");
        }
        setShowLF(false);setEditLead(null);
      }}/>}

    {convertLead&&<LeadConvertModal lead={convertLead} accounts={accounts}
      onClose={()=>setConvertLead(null)}
      onConvert={handleConvert}/>}

  </div>;
}

export default App;
