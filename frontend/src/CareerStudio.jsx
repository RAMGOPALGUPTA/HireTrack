import { useMemo, useState } from "react";
import { BrainCircuit, Target, BookOpen, ShieldAlert, Sparkles, ClipboardCheck, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";

const SKILLS = ["Java","Python","JavaScript","TypeScript","React","Node.js","Spring Boot","SQL","PostgreSQL","MongoDB","HTML","CSS","REST API","Git","Docker","AWS","Azure","Data Structures","Algorithms","OOP","Machine Learning","Figma","UI/UX","Testing","Linux","Communication","Problem Solving"];
const QUESTION_BANK = {
  "Software Engineer": ["Explain the time and space complexity of your favourite algorithm.","How would you design a URL shortener?","What happens when you enter a URL in a browser?","Explain a difficult bug you diagnosed and fixed.","How do you choose between SQL and NoSQL?","Describe a project architecture you built and the trade-offs you made."],
  "Frontend Developer": ["How does the browser render a React application?","Explain state, props and component re-rendering.","How would you improve the performance of a slow page?","What is the difference between client-side and server-side rendering?","How do you make an interface accessible?","How would you structure a reusable component system?"],
  "Backend Developer": ["Explain authentication with JWT and refresh tokens.","How do database indexes improve query performance?","How would you design a rate limiter?","Explain transactions and ACID properties.","How do you secure a REST API?","How would you investigate a slow API endpoint?"],
  "Data Analyst": ["How would you handle missing values in a dataset?","Explain the difference between INNER JOIN and LEFT JOIN.","How do you validate a business metric?","When would you use median instead of mean?","Describe a dashboard that changed a decision.","How would you investigate a sudden drop in conversion?"]
};
const initialProfile = { skills: [], projects: "", resume: "", targetRole: "Software Engineer", practiceCount: 0, completed: [] };
const storageKey = (email) => "hiretrack_career_studio_" + (email || "guest");
function loadProfile(email) { try { return { ...initialProfile, ...JSON.parse(localStorage.getItem(storageKey(email)) || "{}") }; } catch { return initialProfile; } }
function scoreMatch(resume, jd) {
  const jdText = jd.toLowerCase();
  const detected = SKILLS.filter(s => jdText.includes(s.toLowerCase()));
  const matched = detected.filter(s => resume.toLowerCase().includes(s.toLowerCase()));
  const missing = detected.filter(s => !resume.toLowerCase().includes(s.toLowerCase()));
  const score = detected.length ? Math.round((matched.length / detected.length) * 100) : 0;
  return { score, detected, matched, missing, source };
}
function SectionTitle({ eyebrow, title, description, icon: Icon }) {
  return <div className="cs-title"><div className="cs-title-icon"><Icon size={20}/></div><div><small>{eyebrow}</small><h2>{title}</h2><p>{description}</p></div></div>;
}
function Metric({ label, value, note }) { return <div className="cs-metric"><small>{label}</small><strong>{value}</strong><span>{note}</span></div>; }

export default function CareerStudio({ apps = [], user }) {
  const [tab, setTab] = useState("match");
  const [profile, setProfile] = useState(() => loadProfile(user?.email));
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [match, setMatch] = useState(null);
  const [role, setRole] = useState("Software Engineer");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [safetyText, setSafetyText] = useState("");
  const [safety, setSafety] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [notice, setNotice] = useState("");
  const questions = QUESTION_BANK[role];
  const saveProfile = (next) => { setProfile(next); localStorage.setItem(storageKey(user?.email), JSON.stringify(next)); };
  const pipeline = useMemo(() => {
    const total = apps.length;
    const interviews = apps.filter(a => a.status === "INTERVIEW" || a.status === "OFFER").length;
    const offers = apps.filter(a => a.status === "OFFER").length;
    const rejected = apps.filter(a => a.status === "REJECTED").length;
    return { total, interviews, offers, rejected, interviewRate: total ? Math.round(interviews / total * 100) : 0, offerRate: total ? Math.round(offers / total * 100) : 0 };
  }, [apps]);
  const readiness = useMemo(() => {
    const skillScore = Math.min(profile.skills.length / 8, 1) * 35;
    const projectScore = Math.min(profile.projects.trim().length / 220, 1) * 25;
    const resumeScore = Math.min(profile.resume.trim().length / 350, 1) * 20;
    const practiceScore = Math.min(profile.practiceCount / 5, 1) * 20;
    return Math.round(skillScore + projectScore + resumeScore + practiceScore);
  }, [profile]);
  const roadmap = useMemo(() => {
    const priorities = match?.missing?.length ? match.missing : ["Data Structures", "SQL", "REST API", "Git"];
    return priorities.slice(0, 6).map((skill, i) => ({ skill, week: Math.floor(i / 2) + 1, priority: i < 2 ? "High" : "Medium" }));
  }, [match]);
  function analyzeMatch() {
    if (resumeText.trim().length < 30 || jobText.trim().length < 30) { setNotice("Paste meaningful resume text and a job description (at least 30 characters each)."); return; }
    const result = scoreMatch(resumeText, jobText);
    setMatch(result); setNotice("Analysis complete. This is a transparent keyword-based estimate, not an employer score.");
    const next = { ...profile, resume: resumeText };
    saveProfile(next);
  }
  function addSkill(value) {
    const skill = value.trim();
    if (!skill || profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())) return;
    saveProfile({ ...profile, skills: [...profile.skills, skill] }); setNewSkill("");
  }
  function checkSafety() {
    const text = safetyText.toLowerCase();
    const checks = [
      ["Requests payment, registration fees or a security deposit", /registration fee|security deposit|pay.*(job|interview|training)|processing fee|application fee|pay to apply/.test(text)],
      ["Requests bank PIN, OTP, card details or passwords", /otp|bank pin|card number|cvv|password|net banking/.test(text)],
      ["Promises unusually high pay with little detail", /guaranteed.*salary|earn.*per day|no experience.*(high| lakh)|easy money/.test(text)],
      ["Uses urgency or pressure to force a decision", /urgent|immediately|limited seats|today only|act now/.test(text)],
      ["Pushes communication to informal channels only", /whatsapp only|telegram only|dm only/.test(text)],
      ["Contains vague company or role information", /work from home.*no interview|no interview.*salary/.test(text)]
    ];
    const flags = checks.filter(x => x[1]).map(x => x[0]);
    setSafety({ flags, level: flags.length >= 3 ? "High caution" : flags.length ? "Review carefully" : "No obvious red flags detected" });
  }
  function saveAnswer() {
    if (answer.trim().length < 20) { setNotice("Write a fuller answer before saving your practice."); return; }
    const nextAnswers = [...answers, { role, question: questions[questionIndex], answer: answer.trim(), date: new Date().toISOString() }];
    setAnswers(nextAnswers); saveProfile({ ...profile, practiceCount: profile.practiceCount + 1 });
    setAnswer(""); setQuestionIndex((questionIndex + 1) % questions.length); setNotice("Practice answer saved in this session. Structure it using context, action and result.");
  }
  const tabs = [["match","Resume match",Target],["readiness","Readiness",Sparkles],["interview","Mock interview",ClipboardCheck],["roadmap","Skill roadmap",BookOpen],["safety","Job safety",ShieldAlert],["insights","Placement insights",TrendingUp]];
  return <div className="career-studio">
    <div className="cs-hero"><div><span className="cs-kicker">HIRETRACK INTELLIGENCE LAB</span><h2>Turn job searching into a strategy.</h2><p>Understand your fit, strengthen your skills and make each application more intentional.</p></div><div className="cs-hero-mark"><BrainCircuit size={42}/><span>CAREER<br/>INTELLIGENCE</span></div></div>
    <div className="cs-tabs">{tabs.map(([id,label,Icon])=><button key={id} className={tab===id?"active":""} onClick={()=>{setTab(id);setNotice("");}}><Icon size={16}/>{label}</button>)}</div>
    {notice && <div className="cs-notice">{notice}</div>}
    {tab==="match" && <div className="cs-layout"><div className="cs-panel"><SectionTitle eyebrow="01 / OPPORTUNITY FIT" title="Resume–job match" description="Compare your resume against a role's requirements." icon={Target}/><label>Resume text<textarea rows="9" value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste resume text: skills, projects, education and experience..."/></label><label>Job description<textarea rows="9" value={jobText} onChange={e=>setJobText(e.target.value)} placeholder="Paste the complete job description here..."/></label><button className="primary" onClick={analyzeMatch}>Analyze compatibility <Sparkles size={16}/></button></div><div className="cs-panel"><SectionTitle eyebrow="YOUR ANALYSIS" title="Match report" description="Skill coverage based on terms found in the job description." icon={ClipboardCheck}/>{match?<><div className="cs-score"><strong>{match.score}%</strong><span>skill keyword coverage</span></div><div className="cs-skill-columns"><div><b className="positive">Matched ({match.matched.length})</b>{match.matched.length?match.matched.map(s=><span className="cs-chip good" key={s}>{s}</span>):<p className="cs-muted">No matching skills detected yet.</p>}</div><div><b className="warning">Missing ({match.missing.length})</b>{match.missing.length?match.missing.map(s=><span className="cs-chip missing" key={s}>{s}</span>):<p className="cs-muted">No missing skills from this list.</p>}</div></div><p className="cs-disclaimer">The score only measures overlap with HireTrack's built-in skill dictionary. It does not assess proficiency, seniority or guarantee selection.</p></>:<div className="cs-empty"><Target size={30}/><b>Your report will appear here</b><p>Paste both texts and run the analysis to see matching and missing skills.</p></div>}</div></div>}
    {tab==="readiness" && <div className="cs-layout"><div className="cs-panel"><SectionTitle eyebrow="02 / PREPARATION PROFILE" title="Career readiness" description="Build a practical snapshot of your current preparation." icon={Sparkles}/><div className="cs-readiness"><strong>{readiness}</strong><span>/ 100 readiness index</span><div><i style={{width:readiness+"%"}}/></div></div><label>Target role<select value={profile.targetRole} onChange={e=>saveProfile({...profile,targetRole:e.target.value})}>{Object.keys(QUESTION_BANK).map(r=><option key={r}>{r}</option>)}</select></label><label>Skills you can demonstrate<input value={newSkill} onChange={e=>setNewSkill(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addSkill(newSkill))} placeholder="Type a skill and press Enter"/></label><div className="cs-chip-list">{profile.skills.map(s=><button className="cs-chip" key={s} onClick={()=>saveProfile({...profile,skills:profile.skills.filter(x=>x!==s)})}>{s} ×</button>)}</div><label>Projects and measurable outcomes<textarea rows="4" value={profile.projects} onChange={e=>saveProfile({...profile,projects:e.target.value})} placeholder="Describe projects, your contribution, technologies and outcomes..."/></label><label>Resume summary<textarea rows="4" value={profile.resume} onChange={e=>saveProfile({...profile,resume:e.target.value})} placeholder="Paste a concise resume summary..."/></label><p className="cs-disclaimer">Your readiness index is a self-assessment checklist, not a prediction of hiring outcomes. Your profile is saved in this browser.</p></div><div className="cs-panel"><SectionTitle eyebrow="SCORING BREAKDOWN" title="What contributes" description="Complete each area to strengthen your preparation." icon={CheckCircle2}/>{[["Demonstrable skills",Math.min(profile.skills.length/8,1)*35,35],["Project evidence",Math.min(profile.projects.trim().length/220,1)*25,25],["Resume detail",Math.min(profile.resume.trim().length/350,1)*20,20],["Interview practice",Math.min(profile.practiceCount/5,1)*20,20]].map(([name,value,max])=><div className="cs-breakdown" key={name}><div><b>{name}</b><span>{Math.round(value)} / {max}</span></div><div><i style={{width:value/max*100+"%"}}/></div></div>)}<div className="cs-tip"><b>Make the score meaningful</b><p>Add skills you can explain in an interview, describe your own contribution to projects and practice role-specific questions.</p></div></div></div>}
    {tab==="interview" && <div className="cs-layout"><div className="cs-panel"><SectionTitle eyebrow="03 / PRACTICE ROOM" title="Mock interview studio" description="Practice role-specific questions and save your answers." icon={ClipboardCheck}/><label>Interview track<select value={role} onChange={e=>{setRole(e.target.value);setQuestionIndex(0);}}>{Object.keys(QUESTION_BANK).map(r=><option key={r}>{r}</option>)}</select></label><div className="cs-question"><small>QUESTION {questionIndex+1} OF {questions.length}</small><h3>{questions[questionIndex]}</h3><p>Use a clear structure: explain the context, your approach, trade-offs and result.</p></div><label>Your answer<textarea rows="7" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer as if you were speaking to an interviewer..."/></label><div className="cs-actions"><button className="secondary" onClick={()=>setQuestionIndex((questionIndex+1)%questions.length)}>Skip question</button><button className="primary" onClick={saveAnswer}>Save practice answer</button></div></div><div className="cs-panel"><SectionTitle eyebrow="PRACTICE HISTORY" title="Your progress" description="Answers saved during this session." icon={BookOpen}/><Metric label="Answers this session" value={answers.length} note="Current browser session"/><Metric label="Practice sessions recorded" value={profile.practiceCount} note="Saved to this browser profile"/>{answers.slice().reverse().map((a,i)=><div className="cs-history" key={i}><b>{a.role}</b><p>{a.question}</p><small>{a.answer.slice(0,180)}{a.answer.length>180?"…":""}</small></div>)}{!answers.length&&<p className="cs-muted">Your saved answers will appear here.</p>}</div></div>}
    {tab==="roadmap" && <div className="cs-panel"><SectionTitle eyebrow="04 / NEXT STEPS" title="Skill development roadmap" description="Turn missing requirements into a focused learning plan." icon={BookOpen}/><p className="cs-muted">Generate this roadmap from your latest resume match, or start with foundational skills.</p><div className="cs-roadmap">{roadmap.map((r,i)=><div className="cs-roadmap-row" key={r.skill}><div className="cs-week">W{r.week}</div><div><b>{r.skill}</b><p>{i%2===0?"Learn the fundamentals and complete a guided exercise.":"Build a small project and document what you learned."}</p></div><span className={r.priority==="High"?"priority-high":"priority-medium"}>{r.priority}</span></div>)}</div><button className="secondary" onClick={()=>{setMatch(null);setNotice("Roadmap reset to foundational skills. Run a new resume match to personalize it.");}}>Reset roadmap</button></div>}
    {tab==="safety" && <div className="cs-layout"><div className="cs-panel"><SectionTitle eyebrow="05 / OPPORTUNITY SAFETY" title="Job posting risk review" description="Screen pasted job text for common warning signs." icon={ShieldAlert}/><label>Paste job post, recruiter message or offer text<textarea rows="12" value={safetyText} onChange={e=>setSafetyText(e.target.value)} placeholder="Paste the message or job description you want to review..."/></label><button className="primary" onClick={checkSafety}>Check warning signs <ShieldAlert size={16}/></button></div><div className="cs-panel"><SectionTitle eyebrow="RISK INDICATORS" title="Safety report" description="A preliminary text-only screening." icon={AlertTriangle}/>{safety?<><div className={"cs-risk "+(safety.flags.length>=3?"high":"low")}>{safety.level}</div>{safety.flags.length?safety.flags.map(f=><div className="cs-flag" key={f}><AlertTriangle size={16}/>{f}</div>):<p className="cs-muted">No indicators from this checklist were detected. This does not establish that the employer is legitimate.</p>}<p className="cs-disclaimer">Always verify the company domain, recruiter identity and official careers page independently. Never pay to obtain a job or share OTPs, PINs or passwords.</p></>:<div className="cs-empty"><ShieldAlert size={30}/><b>Review a job message</b><p>Paste the text to identify common risk indicators.</p></div>}</div></div>}
    {tab==="insights" && <div className="cs-panel"><SectionTitle eyebrow="06 / APPLICATION PERFORMANCE" title="Placement intelligence" description="Use your own application history to understand your funnel." icon={TrendingUp}/><div className="cs-metrics-grid"><Metric label="Applications tracked" value={pipeline.total} note="All saved applications"/><Metric label="Interview-stage reach" value={pipeline.interviewRate+"%"} note={pipeline.interviews+" reached interview or offer"}/><Metric label="Offer conversion" value={pipeline.offerRate+"%"} note={pipeline.offers+" offers recorded"}/><Metric label="Rejected" value={pipeline.rejected} note="Use patterns to refine targeting"/></div><div className="cs-tip"><b>How to interpret this</b><p>Low interview reach may indicate a resume, targeting or eligibility mismatch. Strong interview reach but few offers may indicate a need for more interview practice. These are hypotheses to investigate, not causal conclusions.</p></div><div className="cs-funnel">{[["Applied",pipeline.total],["Interview / Offer",pipeline.interviews],["Offer",pipeline.offers]].map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong><i style={{width:(pipeline.total?value/pipeline.total*100:0)+"%"}}/></div>)}</div></div>}
  </div>;
}
